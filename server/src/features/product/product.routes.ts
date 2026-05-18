import { Router } from "express";
import { create, getOne, list, remove, update } from "./product.controller";
import { protect } from "../../middlewares/auth.middleware";
import { requireEmailVerified } from "../../middlewares/requireEmailVerified.middleware";
import { restrictTo } from "../../middlewares/role.middleware";
import { runProductImageUpload } from "../../middlewares/runImageUpload.middleware";
import { ROLES } from "../../constants/roles";

const router = Router();

router.get("/", list);
router.get("/:id", getOne);

router.post(
  "/",
  protect,
  requireEmailVerified,
  restrictTo(ROLES.ADMIN, ROLES.SELLER),
  runProductImageUpload,
  create,
);
router.patch(
  "/:id",
  protect,
  requireEmailVerified,
  restrictTo(ROLES.ADMIN, ROLES.SELLER),
  runProductImageUpload,
  update,
);
router.delete(
  "/:id",
  protect,
  requireEmailVerified,
  restrictTo(ROLES.ADMIN, ROLES.SELLER),
  remove,
);

export default router;
