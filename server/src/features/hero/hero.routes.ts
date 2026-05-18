import { Router } from "express";
import { listPublic } from "./hero.controller";

const router = Router();

router.get("/", listPublic);

export default router;
