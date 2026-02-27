import { Router } from "express";
import { getDonation } from "../controllers/donationController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/donation", authMiddleware, getDonation);

export default router;
