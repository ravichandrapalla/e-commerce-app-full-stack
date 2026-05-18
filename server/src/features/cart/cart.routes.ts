import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { requireEmailVerified } from "../../middlewares/requireEmailVerified.middleware";
import { restrictTo } from "../../middlewares/role.middleware";
import { ROLES } from "../../constants/roles";
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  decrementItem,
} from "./cart.controller";

const router = Router();

router.use(protect, requireEmailVerified, restrictTo(ROLES.BUYER));

router.get("/", getCart);
router.post("/add", addItem);
router.post("/decrement", decrementItem);
router.patch("/update", updateItem);
router.delete("/remove", removeItem);

export default router;
