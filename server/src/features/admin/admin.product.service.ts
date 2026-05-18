import { ProductApprovalStatus, Role } from "@prisma/client";
import { sendProductApprovalEmail } from "../email/email.service";
import { prisma } from "../../config/db";
import {
  SELLER_REPUTATION_BULK_APPROVE_THRESHOLD,
  SELLER_REPUTATION_ON_APPROVE,
  SELLER_REPUTATION_ON_REJECT,
  clampReputation,
} from "../../constants/sellerReputation";

const pendingInclude = {
  category: true,
  seller: {
    select: {
      id: true,
      name: true,
      email: true,
      sellerReputation: true,
    },
  },
};

export const getPendingProductApprovals = async () => {
  const [products, sellersEligibleForBulk] = await Promise.all([
    prisma.product.findMany({
      where: { approvalStatus: ProductApprovalStatus.PENDING },
      include: pendingInclude,
      orderBy: { createdAt: "asc" },
    }),
    prisma.user.findMany({
      where: {
        role: Role.SELLER,
        sellerReputation: { gte: SELLER_REPUTATION_BULK_APPROVE_THRESHOLD },
        products: {
          some: { approvalStatus: ProductApprovalStatus.PENDING },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        sellerReputation: true,
        _count: {
          select: {
            products: {
              where: { approvalStatus: ProductApprovalStatus.PENDING },
            },
          },
        },
      },
      orderBy: { sellerReputation: "desc" },
    }),
  ]);

  return { products, sellersEligibleForBulk };
};

const adjustSellerReputation = async (sellerId: string, delta: number) => {
  const seller = await prisma.user.findUnique({
    where: { id: sellerId },
    select: { sellerReputation: true, role: true },
  });
  if (!seller || seller.role !== Role.SELLER) return;

  await prisma.user.update({
    where: { id: sellerId },
    data: {
      sellerReputation: clampReputation(seller.sellerReputation + delta),
    },
  });
};

export const approveProduct = async (productId: string, adminId: string) => {
  const existing = await prisma.product.findUnique({
    where: { id: productId },
    select: { sellerId: true, approvalStatus: true },
  });
  if (!existing) {
    throw new Error("Product not found");
  }
  if (existing.approvalStatus !== ProductApprovalStatus.PENDING) {
    throw new Error("Only pending products can be approved");
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      approvalStatus: ProductApprovalStatus.APPROVED,
      isPublished: true,
      rejectionReason: null,
      reviewedAt: new Date(),
      reviewedById: adminId,
    },
    include: pendingInclude,
  });

  await adjustSellerReputation(existing.sellerId, SELLER_REPUTATION_ON_APPROVE);

  if (product.seller.email) {
    sendProductApprovalEmail({
      to: product.seller.email,
      sellerName: product.seller.name,
      productTitle: product.title,
      status: "APPROVED",
    }).catch((error) => console.error("Product approval email failed", error));
  }

  return product;
};

export const rejectProduct = async (
  productId: string,
  adminId: string,
  reason?: string,
) => {
  const existing = await prisma.product.findUnique({
    where: { id: productId },
    select: { sellerId: true, approvalStatus: true },
  });
  if (!existing) {
    throw new Error("Product not found");
  }
  if (existing.approvalStatus !== ProductApprovalStatus.PENDING) {
    throw new Error("Only pending products can be rejected");
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      approvalStatus: ProductApprovalStatus.REJECTED,
      isPublished: false,
      rejectionReason: reason?.trim() || "Listing did not meet marketplace guidelines.",
      reviewedAt: new Date(),
      reviewedById: adminId,
    },
    include: pendingInclude,
  });

  await adjustSellerReputation(existing.sellerId, SELLER_REPUTATION_ON_REJECT);

  if (product.seller.email) {
    sendProductApprovalEmail({
      to: product.seller.email,
      sellerName: product.seller.name,
      productTitle: product.title,
      status: "REJECTED",
      rejectionReason: product.rejectionReason,
    }).catch((error) => console.error("Product rejection email failed", error));
  }

  return product;
};

export const bulkApproveTrustedSellers = async (adminId: string) => {
  const trustedSellers = await prisma.user.findMany({
    where: {
      role: Role.SELLER,
      sellerReputation: { gte: SELLER_REPUTATION_BULK_APPROVE_THRESHOLD },
    },
    select: { id: true },
  });

  const sellerIds = trustedSellers.map((s) => s.id);
  if (sellerIds.length === 0) {
    return { approvedCount: 0 };
  }

  const pending = await prisma.product.findMany({
    where: {
      sellerId: { in: sellerIds },
      approvalStatus: ProductApprovalStatus.PENDING,
    },
    select: { id: true, sellerId: true },
  });

  if (pending.length === 0) {
    return { approvedCount: 0 };
  }

  await prisma.product.updateMany({
    where: {
      id: { in: pending.map((p) => p.id) },
    },
    data: {
      approvalStatus: ProductApprovalStatus.APPROVED,
      isPublished: true,
      rejectionReason: null,
      reviewedAt: new Date(),
      reviewedById: adminId,
    },
  });

  const uniqueSellerIds = [...new Set(pending.map((p) => p.sellerId))];
  await Promise.all(
    uniqueSellerIds.map((sellerId) =>
      adjustSellerReputation(sellerId, SELLER_REPUTATION_ON_APPROVE),
    ),
  );

  return { approvedCount: pending.length };
};

export const getAdminCatalogProducts = async (query: Record<string, unknown>) => {
  const page = Number(query.page || 1);
  const limit = Math.min(Number(query.limit || 50), 100);
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (query.approvalStatus) {
    where.approvalStatus = String(query.approvalStatus);
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            sellerReputation: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};
