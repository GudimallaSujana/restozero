import { Router } from "express";
import { getPoints, updatePoints } from "../controllers/gamificationController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/points", authMiddleware, getPoints);
router.post("/updatePoints", authMiddleware, updatePoints);

export default router;
