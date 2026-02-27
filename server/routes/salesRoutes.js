import { Router } from "express";
import { addSale, getSales } from "../controllers/salesController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/sales", authMiddleware, addSale);
router.get("/sales", authMiddleware, getSales);

export default router;
