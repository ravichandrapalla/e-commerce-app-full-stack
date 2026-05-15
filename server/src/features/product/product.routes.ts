import { Router } from "express";
import { create, getOne, list, remove, update } from "./product.controller";
import { protect } from "../../middlewares/auth.middleware";
import { restrictTo } from "../../middlewares/role.middleware";
import { upload } from "../../middlewares/upload.middleware";

const router = Router();

// public
router.get("/", list);

router.get("/:id", getOne);

// admin only
router.post("/", protect, restrictTo("ADMIN"), upload.single("image"), create);

export default router;
router.patch("/:id", protect, restrictTo("ADMIN"), update);

router.delete("/:id", protect, restrictTo("ADMIN"), remove);
