import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  decrementItem,
} from "./cart.controller";

const router = Router();

router.use(protect);

router.get("/", getCart);
router.post("/add", addItem);
router.post("/decrement", decrementItem);
router.patch("/update", updateItem);
router.delete("/remove", removeItem);

export default router;
