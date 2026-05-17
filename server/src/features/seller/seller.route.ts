import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { restrictTo } from "../../middlewares/role.middleware";
import { ROLES } from "../../constants/roles";
import {
  getOrders,
  getStats,
  listProducts,
  updateOrderStatus,
} from "./seller.controller";

const router = Router();

router.use(protect, restrictTo(ROLES.SELLER));

router.get("/stats", getStats);
router.get("/products", listProducts);
router.get("/orders", getOrders);
router.patch("/orders/:orderId/status", updateOrderStatus);

export default router;
