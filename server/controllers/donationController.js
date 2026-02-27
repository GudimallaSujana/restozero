import Sales from "../models/Sales.js";
import { isDbConnected } from "../config/db.js";
import { demoStore } from "../utils/demoStore.js";
import { getDonationSuggestion } from "../utils/donationEngine.js";

export async function getDonation(req, res) {
  try {
    const lastSales = isDbConnected()
      ? await Sales.find({ userId: req.user.id }).sort({ date: -1 }).limit(5)
      : demoStore.sales
          .filter((s) => s.userId === req.user.id)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
    const totalWaste = lastSales.reduce((acc, curr) => acc + Math.max(0, curr.prepared - curr.sold), 0);
    const suggestion = getDonationSuggestion(totalWaste, 20);

    return res.json({
      leftoverUnits: totalWaste,
      ...suggestion
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
