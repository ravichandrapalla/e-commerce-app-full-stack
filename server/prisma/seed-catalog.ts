import "dotenv/config";
import { PrismaClient, ProductApprovalStatus, Role } from "@prisma/client";
import {
  CATALOG_CATEGORY_LABELS,
  CATALOG_CATEGORY_NAMES,
  CATALOG_CATEGORY_SLUGS,
  type CatalogCategorySlug,
} from "../src/constants/catalogCategories";
import { hashPassword } from "../src/utils/hash";

const prisma = new PrismaClient();

const SEED_MARKER = "[catalog-seed]";
const MAX_PRODUCTS = 60;
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin@1234";
const ADMIN_NAME = "admin";
const SELLER_EMAIL = "seller@gmail.com";
const SELLER_PASSWORD = "seller@1234";
const SELLER_NAME = "seller";
const SELLER_REPUTATION = 78;

const PRICE_BY_SLUG: Record<CatalogCategorySlug, [number, number]> = {
  BABY_PRODUCTS: [299, 3499],
  BEAUTY_HEALTH: [199, 4999],
  CLOTHING_ACCESSORIES_JEWELLERY: [499, 8999],
  ELECTRONICS: [999, 89999],
  GROCERY: [49, 1999],
  HOBBY_ARTS_STATIONERY: [99, 4999],
  HOME_KITCHEN_TOOLS: [299, 14999],
  PET_SUPPLIES: [149, 5999],
  SPORTS_OUTDOOR: [399, 19999],
};

const productsPerCategory = (): number[] => {
  const base = Math.floor(MAX_PRODUCTS / CATALOG_CATEGORY_SLUGS.length);
  const remainder = MAX_PRODUCTS % CATALOG_CATEGORY_SLUGS.length;
  return CATALOG_CATEGORY_SLUGS.map((_, index) =>
    index < remainder ? base + 1 : base,
  );
};

const pickPrice = (slug: CatalogCategorySlug, index: number) => {
  const [min, max] = PRICE_BY_SLUG[slug];
  const span = max - min;
  const step = Math.max(1, Math.floor(span / 12));
  return min + (index % 12) * step;
};

type SeedAssignment = {
  sellerId: string;
  submittedByAdmin: boolean;
  approvalStatus: ProductApprovalStatus;
  isPublished: boolean;
  rejectionReason?: string;
};

async function ensureAdmin() {
  const hashedPassword = await hashPassword(ADMIN_PASSWORD);
  return prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: ADMIN_NAME,
      password: hashedPassword,
      role: Role.ADMIN,
      emailVerified: true,
    },
    create: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: Role.ADMIN,
      emailVerified: true,
    },
  });
}

async function ensureSeller() {
  const hashedPassword = await hashPassword(SELLER_PASSWORD);
  return prisma.user.upsert({
    where: { email: SELLER_EMAIL },
    update: {
      name: SELLER_NAME,
      password: hashedPassword,
      role: Role.SELLER,
      sellerReputation: SELLER_REPUTATION,
      emailVerified: true,
    },
    create: {
      name: SELLER_NAME,
      email: SELLER_EMAIL,
      password: hashedPassword,
      role: Role.SELLER,
      sellerReputation: SELLER_REPUTATION,
      emailVerified: true,
    },
  });
}

async function pruneLegacyCategories() {
  await prisma.category.deleteMany({
    where: {
      name: { notIn: [...CATALOG_CATEGORY_NAMES] },
      products: { none: {} },
    },
  });
}

async function ensureCategories() {
  const map = new Map<string, string>();
  for (const slug of CATALOG_CATEGORY_SLUGS) {
    const name = CATALOG_CATEGORY_LABELS[slug];
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    map.set(slug, category.id);
  }
  return map;
}

async function clearPreviousSeed() {
  await prisma.product.deleteMany({
    where: { description: { contains: SEED_MARKER } },
  });
}

const resolveAssignment = (
  globalIndex: number,
  adminId: string,
  sellerId: string,
): SeedAssignment => {
  // ~50% admin-owned (auto-approved), ~50% seller-owned with mixed moderation states
  if (globalIndex % 2 === 0) {
    return {
      sellerId: adminId,
      submittedByAdmin: true,
      approvalStatus: ProductApprovalStatus.APPROVED,
      isPublished: true,
    };
  }

  const sellerVariant = globalIndex % 10;
  if (sellerVariant <= 6) {
    return {
      sellerId,
      submittedByAdmin: false,
      approvalStatus: ProductApprovalStatus.APPROVED,
      isPublished: true,
    };
  }
  if (sellerVariant <= 8) {
    return {
      sellerId,
      submittedByAdmin: false,
      approvalStatus: ProductApprovalStatus.PENDING,
      isPublished: false,
    };
  }
  return {
    sellerId,
    submittedByAdmin: false,
    approvalStatus: ProductApprovalStatus.REJECTED,
    isPublished: false,
    rejectionReason: "Image or description needs clearer product details before listing.",
  };
};

async function seedProducts(
  adminId: string,
  sellerId: string,
  categoryIds: Map<string, string>,
) {
  const counts = productsPerCategory();
  let created = 0;
  let globalIndex = 0;

  for (let i = 0; i < CATALOG_CATEGORY_SLUGS.length; i++) {
    const slug = CATALOG_CATEGORY_SLUGS[i];
    const limit = counts[i];
    const label = CATALOG_CATEGORY_LABELS[slug];
    const categoryId = categoryIds.get(slug);
    if (!categoryId) continue;

    for (let j = 0; j < limit; j++) {
      const assignment = resolveAssignment(globalIndex, adminId, sellerId);
      globalIndex++;

      await prisma.product.create({
        data: {
          title: `${label} #${j + 1}`,
          description: `Curated ${label.toLowerCase()} item from the BoxInWheels catalog. ${SEED_MARKER}`,
          price: pickPrice(slug, j),
          stock: 20 + ((j * 7) % 80),
          categoryId,
          sellerId: assignment.sellerId,
          approvalStatus: assignment.approvalStatus,
          isPublished: assignment.isPublished,
          rejectionReason: assignment.rejectionReason,
        },
      });
      created++;
    }
  }

  return created;
}

async function main() {
  const admin = await ensureAdmin();
  const seller = await ensureSeller();
  await pruneLegacyCategories();
  const categoryIds = await ensureCategories();
  await clearPreviousSeed();
  const count = await seedProducts(admin.id, seller.id, categoryIds);

  console.log(`Admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log(`Seller: ${SELLER_EMAIL} / ${SELLER_PASSWORD} (reputation ${SELLER_REPUTATION})`);
  console.log(`Categories: ${CATALOG_CATEGORY_SLUGS.length}`);
  console.log(
    `Products seeded: ${count} (~half admin, ~half seller). Add images via admin/seller upload (Cloudinary).`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
