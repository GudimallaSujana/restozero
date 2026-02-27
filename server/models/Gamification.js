import mongoose from "mongoose";

const gamificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    points: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    badges: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("Gamification", gamificationSchema);
