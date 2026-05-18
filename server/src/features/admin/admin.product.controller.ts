import { Response } from "express";
import { z } from "zod";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  approveProduct,
  bulkApproveTrustedSellers,
  getAdminCatalogProducts,
  getPendingProductApprovals,
  rejectProduct,
} from "./admin.product.service";

const rejectSchema = z.object({
  reason: z.string().max(500).optional(),
});

export const listPendingApprovals = async (_req: AuthRequest, res: Response) => {
  const data = await getPendingProductApprovals();
  res.json(data);
};

export const listCatalogProducts = async (req: AuthRequest, res: Response) => {
  const data = await getAdminCatalogProducts(req.query);
  res.json(data);
};

export const approve = async (req: AuthRequest, res: Response) => {
  try {
    const product = await approveProduct(
      String(req.params.productId),
      req.user!.id,
    );
    res.json({ product, message: "Product approved" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Approval failed";
    res.status(400).json({ message });
  }
};

export const reject = async (req: AuthRequest, res: Response) => {
  try {
    const { reason } = rejectSchema.parse(req.body);
    const product = await rejectProduct(
      String(req.params.productId),
      req.user!.id,
      reason,
    );
    res.json({ product, message: "Product rejected" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Rejection failed";
    res.status(400).json({ message });
  }
};

export const bulkApprove = async (req: AuthRequest, res: Response) => {
  try {
    const result = await bulkApproveTrustedSellers(req.user!.id);
    res.json({
      ...result,
      message:
        result.approvedCount > 0
          ? `Approved ${result.approvedCount} listing(s) from trusted sellers`
          : "No pending listings from trusted sellers",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Bulk approval failed";
    res.status(400).json({ message });
  }
};
