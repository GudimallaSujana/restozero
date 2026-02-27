import { Router } from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/analytics", authMiddleware, getAnalytics);

export default router;
