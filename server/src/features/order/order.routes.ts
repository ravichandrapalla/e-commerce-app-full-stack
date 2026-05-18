import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { requireEmailVerified } from "../../middlewares/requireEmailVerified.middleware";
import { restrictTo } from "../../middlewares/role.middleware";
import { ROLES } from "../../constants/roles";
import {
  checkout,
  completeDemoCheckout,
  getOrder,
  getOrders,
} from "./order.controller";

const router = Router();

router.use(protect, requireEmailVerified, restrictTo(ROLES.BUYER));

router.post("/checkout", checkout);
router.post("/checkout/demo-complete", completeDemoCheckout);
router.get("/", getOrders);
router.get("/:id", getOrder);

export default router;
