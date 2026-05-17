import { Router } from "express";
import {
  getSelf,
  login,
  logout,
  register,
  updateProfile,
} from "./auth.controller";
import { protect } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/self", protect, getSelf);
router.patch("/profile", protect, upload.single("avatar"), updateProfile);

export default router;
