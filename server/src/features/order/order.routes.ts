import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import {
  checkout,
  completeDemoCheckout,
  getOrder,
  getOrders,
} from "./order.controller";

const router = Router();

router.use(protect);

router.post("/checkout", checkout);
router.post("/checkout/demo-complete", completeDemoCheckout);
router.get("/", getOrders);
router.get("/:id", getOrder);

export default router;
