import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { restrictTo } from "../../middlewares/role.middleware";
import { ROLES } from "../../constants/roles";
import {
  getAdminOrders,
  getDashboardStats,
  updateAdminOrderStatus,
} from "./admin.controller";

const router = Router();

router.use(protect, restrictTo(ROLES.ADMIN));

router.get("/stats", getDashboardStats);
router.get("/orders", getAdminOrders);
router.patch("/orders/:orderId/status", updateAdminOrderStatus);

export default router;
