import { Router } from "express";
import { create, getOne, list, remove, update } from "./product.controller";
import { protect } from "../../middlewares/auth.middleware";
import { restrictTo } from "../../middlewares/role.middleware";
import { upload } from "../../middlewares/upload.middleware";
import { ROLES } from "../../constants/roles";

const router = Router();

router.get("/", list);
router.get("/:id", getOne);

router.post(
  "/",
  protect,
  restrictTo(ROLES.ADMIN, ROLES.SELLER),
  upload.single("image"),
  create,
);
router.patch(
  "/:id",
  protect,
  restrictTo(ROLES.ADMIN, ROLES.SELLER),
  update,
);
router.delete(
  "/:id",
  protect,
  restrictTo(ROLES.ADMIN, ROLES.SELLER),
  remove,
);

export default router;
