import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { restrictTo } from "../../middlewares/role.middleware";
import { getDashboardStats } from "./admin.controller";

const router = Router();

router.use(protect);
router.use(restrictTo("ADMIN"));

router.get("/stats", getDashboardStats);

export default router;
