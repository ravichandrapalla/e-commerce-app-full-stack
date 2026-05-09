import { Router } from "express";
import { create, getOne, list } from "./product.controller";
import { protect } from "../../middlewares/auth.middleware";
import { restrictTo } from "../../middlewares/role.middleware";

const router = Router();

// public
router.get("/", list);

router.get("/:id", getOne);

// admin only
router.post("/", protect, restrictTo("ADMIN"), create);

export default router;
