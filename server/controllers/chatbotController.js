import Prediction from "../models/Prediction.js";
import { isDbConnected } from "../config/db.js";
import { demoStore } from "../utils/demoStore.js";
import { chatbotReply } from "../utils/chatbotEngine.js";

export async function chat(req, res) {
  try {
    const { message } = req.body;

    const lastPrediction = isDbConnected()
      ? await Prediction.findOne({ userId: req.user.id }).sort({ date: -1 })
      : demoStore.predictions.find((p) => p.userId === req.user.id);
    const reply = chatbotReply(message, {
      predicted: lastPrediction?.predicted,
      explanation: lastPrediction?.explanation
    });

    return res.json({ reply });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
