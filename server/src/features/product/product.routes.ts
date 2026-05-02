import { Router } from "express";
import { create, list } from "./product.controller";
import { protect } from "../../middlewares/auth.middleware";
import { restrictTo } from "../../middlewares/role.middleware";

const router = Router();

// public
router.get("/", list);

// admin only
router.post("/", protect, restrictTo("ADMIN"), create);

export default router;
