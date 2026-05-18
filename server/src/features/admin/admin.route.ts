import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { requireEmailVerified } from "../../middlewares/requireEmailVerified.middleware";
import { restrictTo } from "../../middlewares/role.middleware";
import { ROLES } from "../../constants/roles";
import {
  getAdminOrders,
  getDashboardStats,
  updateAdminOrderStatus,
} from "./admin.controller";
import {
  approve,
  bulkApprove,
  listCatalogProducts,
  listPendingApprovals,
  reject,
} from "./admin.product.controller";
import {
  createHeroSlideHandler,
  createHeroSlidesBatch,
  deleteHeroSlideHandler,
  listHeroSlides,
  reorderHeroSlidesHandler,
  updateHeroSlideHandler,
} from "./admin.hero.controller";
import {
  runHeroImageUpload,
  runHeroImagesUpload,
} from "../../middlewares/runImageUpload.middleware";

const router = Router();

router.use(protect, requireEmailVerified, restrictTo(ROLES.ADMIN));

router.get("/stats", getDashboardStats);
router.get("/orders", getAdminOrders);
router.patch("/orders/:orderId/status", updateAdminOrderStatus);

router.get("/products/pending", listPendingApprovals);
router.get("/products/catalog", listCatalogProducts);
router.patch("/products/:productId/approve", approve);
router.patch("/products/:productId/reject", reject);
router.post("/products/bulk-approve", bulkApprove);

router.get("/hero-slides", listHeroSlides);
router.post("/hero-slides", runHeroImageUpload, createHeroSlideHandler);
router.post("/hero-slides/batch", runHeroImagesUpload, createHeroSlidesBatch);
router.patch("/hero-slides/reorder", reorderHeroSlidesHandler);
router.patch("/hero-slides/:id", runHeroImageUpload, updateHeroSlideHandler);
router.delete("/hero-slides/:id", deleteHeroSlideHandler);

export default router;
