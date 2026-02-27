import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    item: { type: String, required: true },
    sold: { type: Number, required: true },
    prepared: { type: Number, required: true },
    cost: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Sales", salesSchema);
