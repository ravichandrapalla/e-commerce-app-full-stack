import { Router, raw } from "express";
import { stripeWebhook } from "./payment.controller";

const router = Router();

router.post("/stripe/webhook", raw({ type: "application/json" }), stripeWebhook);

export default router;

