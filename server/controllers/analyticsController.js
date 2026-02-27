import dayjs from "dayjs";
import axios from "axios";
import Sales from "../models/Sales.js";
import { isDbConnected } from "../config/db.js";
import { demoStore } from "../utils/demoStore.js";

export async function getAnalytics(req, res) {
  try {
    const rawSales = isDbConnected()
      ? await Sales.find({ userId: req.user.id }).sort({ date: 1 })
      : demoStore.sales
          .filter((s) => s.userId === req.user.id)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const byDate = rawSales.reduce((acc, sale) => {
      const key = dayjs(sale.date).format("YYYY-MM-DD");
      if (!acc[key]) acc[key] = { date: key, totalWaste: 0, loss: 0, sold: 0, prepared: 0 };
      const waste = Math.max(0, Number(sale.prepared) - Number(sale.sold));
      acc[key].totalWaste += waste;
      acc[key].loss += waste * Number(sale.cost || 0);
      acc[key].sold += Number(sale.sold || 0);
      acc[key].prepared += Number(sale.prepared || 0);
      return acc;
    }, {});

    const analytics = Object.values(byDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((row) => ({
        date: dayjs(row.date).format("DD MMM"),
        totalWaste: Number(row.totalWaste.toFixed(2)),
        loss: Number(row.loss.toFixed(2))
      }));

    const totalPrepared = rawSales.reduce((acc, s) => acc + Number(s.prepared || 0), 0);
    const totalSold = rawSales.reduce((acc, s) => acc + Number(s.sold || 0), 0);
    const sustainabilityScore = totalPrepared ? Number(((totalSold / totalPrepared) * 100).toFixed(1)) : 0;

    let holiday = null;
    try {
      const year = dayjs().year();
      const publicHolidayApi = process.env.PUBLIC_HOLIDAY_API || `https://date.nager.at/api/v3/publicholidays/${year}/AT`;
      const holidayRes = await axios.get(publicHolidayApi);
      const today = dayjs().format("YYYY-MM-DD");
      holiday = holidayRes.data.find((h) => h.date === today) || null;
    } catch (_error) {
      holiday = null;
    }

    return res.json({
      analytics,
      sustainabilityScore,
      holiday,
      message: analytics.length ? "" : "No data available. Add sales data to see predictions."
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
