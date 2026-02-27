import { Router } from "express";
import { getLeaderboard } from "../controllers/leaderboardController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/leaderboard", authMiddleware, getLeaderboard);

export default router;
