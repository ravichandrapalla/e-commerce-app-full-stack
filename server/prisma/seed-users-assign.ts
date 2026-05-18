import "dotenv/config";
import { PrismaClient, ProductApprovalStatus, Role } from "@prisma/client";
import { hashPassword } from "../src/utils/hash";

const prisma = new PrismaClient();
const SEED_MARKER = "[catalog-seed]";

async function main() {
  const adminHash = await hashPassword("admin@1234");
  const sellerHash = await hashPassword("seller@1234");

  const admin = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: { name: "admin", password: adminHash, role: Role.ADMIN },
    create: {
      name: "admin",
      email: "admin@gmail.com",
      password: adminHash,
      role: Role.ADMIN,
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: "seller@gmail.com" },
    update: {
      name: "seller",
      password: sellerHash,
      role: Role.SELLER,
      sellerReputation: 78,
    },
    create: {
      name: "seller",
      email: "seller@gmail.com",
      password: sellerHash,
      role: Role.SELLER,
      sellerReputation: 78,
    },
  });

  const products = await prisma.product.findMany({
    where: { description: { contains: SEED_MARKER } },
    orderBy: { createdAt: "asc" },
  });

  for (let i = 0; i < products.length; i++) {
    const isAdminOwned = i % 2 === 0;
    const sellerVariant = i % 10;

    let approvalStatus = ProductApprovalStatus.APPROVED;
    let isPublished = true;
    let rejectionReason: string | null = null;

    if (!isAdminOwned) {
      if (sellerVariant <= 6) {
        approvalStatus = ProductApprovalStatus.APPROVED;
        isPublished = true;
      } else if (sellerVariant <= 8) {
        approvalStatus = ProductApprovalStatus.PENDING;
        isPublished = false;
      } else {
        approvalStatus = ProductApprovalStatus.REJECTED;
        isPublished = false;
        rejectionReason =
          "Image or description needs clearer product details before listing.";
      }
    }

    await prisma.product.update({
      where: { id: products[i].id },
      data: {
        sellerId: isAdminOwned ? admin.id : seller.id,
        approvalStatus,
        isPublished,
        rejectionReason,
      },
    });
  }

  console.log("Admin: admin@gmail.com / admin@1234");
  console.log("Seller: seller@gmail.com / seller@1234 (reputation 78)");
  console.log(`Reassigned ${products.length} catalog products`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
