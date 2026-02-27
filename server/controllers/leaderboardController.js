import Sales from "../models/Sales.js";
import { isDbConnected } from "../config/db.js";
import { demoStore } from "../utils/demoStore.js";

export async function getLeaderboard(_req, res) {
  try {
    if (!isDbConnected()) {
      const totals = demoStore.sales.reduce((acc, sale) => {
        const key = sale.userId;
        if (!acc[key]) acc[key] = { totalSold: 0, totalPrepared: 0 };
        acc[key].totalSold += sale.sold;
        acc[key].totalPrepared += sale.prepared;
        return acc;
      }, {});

      const result = Object.entries(totals)
        .map(([userId, t]) => ({
          userId,
          restaurant: userId === "demo-user" ? demoStore.user.restaurantName : `Restaurant-${String(userId).slice(-4)}`,
          totalSold: t.totalSold,
          totalPrepared: t.totalPrepared,
          efficiency: t.totalPrepared ? Number(((t.totalSold / t.totalPrepared) * 100).toFixed(2)) : 0
        }))
        .sort((a, b) => b.efficiency - a.efficiency)
        .slice(0, 10)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      return res.json(result);
    }

    const grouped = await Sales.aggregate([
      {
        $group: {
          _id: "$userId",
          totalSold: { $sum: "$sold" },
          totalPrepared: { $sum: "$prepared" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $project: {
          userId: "$_id",
          user: { $arrayElemAt: ["$user", 0] },
          efficiency: {
            $cond: [{ $eq: ["$totalPrepared", 0] }, 0, { $multiply: [{ $divide: ["$totalSold", "$totalPrepared"] }, 100] }]
          },
          totalSold: 1,
          totalPrepared: 1
        }
      },
      { $sort: { efficiency: -1 } },
      { $limit: 10 }
    ]);

    const result = grouped.map((entry, index) => ({
      rank: index + 1,
      restaurant: entry.user?.restaurantName || `Restaurant-${String(entry.userId).slice(-4)}`,
      efficiency: Number(entry.efficiency.toFixed(2)),
      totalSold: entry.totalSold,
      totalPrepared: entry.totalPrepared
    }));

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
