import { Router } from "express";
import { chat } from "../controllers/chatbotController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/chat", authMiddleware, chat);

export default router;
