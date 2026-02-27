import { Router } from "express";
import { runPrediction } from "../controllers/predictionController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/predict", authMiddleware, runPrediction);

export default router;
