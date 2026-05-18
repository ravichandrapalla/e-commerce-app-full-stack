import type { ProductApprovalStatus } from "../types/ecommerce";

export const approvalStatusLabel: Record<ProductApprovalStatus, string> = {
  PENDING: "Pending review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const approvalStatusClass: Record<ProductApprovalStatus, string> = {
  PENDING: "bg-amber-50 text-amber-800 ring-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  REJECTED: "bg-red-50 text-red-800 ring-red-200",
};
