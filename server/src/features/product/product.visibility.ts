import { ProductApprovalStatus } from "@prisma/client";

/** Visible on the public storefront and purchasable by buyers */
export const storefrontProductWhere = {
  approvalStatus: ProductApprovalStatus.APPROVED,
  isPublished: true,
} as const;

export const isStorefrontVisible = (product: {
  approvalStatus: ProductApprovalStatus;
  isPublished: boolean;
}) =>
  product.approvalStatus === ProductApprovalStatus.APPROVED &&
  product.isPublished;
