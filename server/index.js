import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import gamificationRoutes from "./routes/gamificationRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "RestoZero API" });
});

app.use("/api", authRoutes);
app.use("/api", salesRoutes);
app.use("/api", predictionRoutes);
app.use("/api", gamificationRoutes);
app.use("/api", leaderboardRoutes);
app.use("/api", chatbotRoutes);
app.use("/api", donationRoutes);
app.use("/api", analyticsRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

connectDb().finally(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
