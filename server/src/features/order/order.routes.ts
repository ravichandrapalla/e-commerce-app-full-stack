import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { checkout, getOrders } from "./order.controller";

const router = Router();

router.use(protect);

router.post("/checkout", checkout);
router.get("/", getOrders);

export default router;
