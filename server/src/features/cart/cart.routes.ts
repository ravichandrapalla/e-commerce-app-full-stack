import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { getCart, addItem, updateItem, removeItem } from "./cart.controller";

const router = Router();

router.use(protect);

router.get("/", getCart);
router.post("/add", addItem);
router.patch("/update", updateItem);
router.delete("/remove", removeItem);

export default router;
