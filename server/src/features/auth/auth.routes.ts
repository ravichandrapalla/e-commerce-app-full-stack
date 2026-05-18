import { Router } from "express";
import {
  getSelf,
  login,
  logout,
  register,
  resendVerification,
  updateProfile,
  verifyEmailHandler,
} from "./auth.controller";
import { protect } from "../../middlewares/auth.middleware";
import { runAvatarUpload } from "../../middlewares/runImageUpload.middleware";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify-email", verifyEmailHandler);
router.post("/resend-verification", resendVerification);
router.get("/self", protect, getSelf);
router.patch("/profile", protect, runAvatarUpload, updateProfile);

export default router;
