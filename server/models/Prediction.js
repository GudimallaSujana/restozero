import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    item: { type: String, required: true },
    predicted: { type: Number, required: true },
    weather: { type: String, default: "clear" },
    event: { type: String, default: "none" },
    explanation: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Prediction", predictionSchema);
