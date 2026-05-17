import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { PrismaClient, Role } from "@prisma/client";
import {
  CATALOG_CATEGORY_LABELS,
  CATALOG_CATEGORY_NAMES,
  CATALOG_CATEGORY_SLUGS,
  type CatalogCategorySlug,
} from "../src/constants/catalogCategories";
import {
  PRODUCT_IMAGES_ROOT,
  productImagePublicPath,
} from "../src/config/productImages";
import { hashPassword } from "../src/utils/hash";

const prisma = new PrismaClient();

const SEED_MARKER = "[catalog-seed]";
const MAX_PRODUCTS = 60;
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin@1234";
const ADMIN_NAME = "admin";

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

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

const parseTitle = (filename: string, categoryLabel: string) => {
  const stem = filename.replace(IMAGE_EXT, "");
  const id = stem.split("_")[0] ?? stem;
  return `${categoryLabel} #${id}`;
};

const listImages = async (slug: CatalogCategorySlug) => {
  const dir = path.join(PRODUCT_IMAGES_ROOT, slug);
  const entries = await fs.readdir(dir);
  return entries
    .filter((name) => IMAGE_EXT.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
};

const pickPrice = (slug: CatalogCategorySlug, index: number) => {
  const [min, max] = PRICE_BY_SLUG[slug];
  const span = max - min;
  const step = Math.max(1, Math.floor(span / 12));
  return min + (index % 12) * step;
};

async function ensureAdmin() {
  const hashedPassword = await hashPassword(ADMIN_PASSWORD);
  return prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: ADMIN_NAME,
      password: hashedPassword,
      role: Role.ADMIN,
    },
    create: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: Role.ADMIN,
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

async function clearPreviousSeed(adminId: string) {
  await prisma.product.deleteMany({
    where: {
      sellerId: adminId,
      description: { contains: SEED_MARKER },
    },
  });
}

async function seedProducts(
  adminId: string,
  categoryIds: Map<string, string>,
) {
  const counts = productsPerCategory();
  let created = 0;

  for (let i = 0; i < CATALOG_CATEGORY_SLUGS.length; i++) {
    const slug = CATALOG_CATEGORY_SLUGS[i];
    const limit = counts[i];
    const label = CATALOG_CATEGORY_LABELS[slug];
    const categoryId = categoryIds.get(slug);
    if (!categoryId) continue;

    const images = await listImages(slug);
    const selected = images.slice(0, limit);

    for (let j = 0; j < selected.length; j++) {
      const filename = selected[j];
      const title = parseTitle(filename, label);
      const price = pickPrice(slug, j);
      const stock = 20 + ((j * 7) % 80);

      await prisma.product.create({
        data: {
          title,
          description: `Curated ${label.toLowerCase()} item from the RaviCommerce catalog. ${SEED_MARKER}`,
          price,
          stock,
          imageUrl: productImagePublicPath(slug, filename),
          categoryId,
          sellerId: adminId,
          isPublished: true,
        },
      });
      created++;
    }
  }

  return created;
}

async function main() {
  try {
    await fs.access(PRODUCT_IMAGES_ROOT);
  } catch {
    throw new Error(
      `Product images not found at ${PRODUCT_IMAGES_ROOT}. Ensure ECOMMERCE_PRODUCT_IMAGES/train exists.`,
    );
  }

  const admin = await ensureAdmin();
  await pruneLegacyCategories();
  const categoryIds = await ensureCategories();
  await clearPreviousSeed(admin.id);
  const count = await seedProducts(admin.id, categoryIds);

  console.log(`Admin ready: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log(`Categories: ${CATALOG_CATEGORY_SLUGS.length}`);
  console.log(`Products seeded: ${count}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
