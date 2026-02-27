import dayjs from "dayjs";
import Sales from "../models/Sales.js";
import Prediction from "../models/Prediction.js";
import { isDbConnected } from "../config/db.js";
import { demoStore } from "../utils/demoStore.js";
import { predictDemand } from "../utils/predictionEngine.js";
import { buildWasteExplanation } from "../utils/explanationEngine.js";
import { getCurrentWeather } from "../utils/weather.js";
import { getHolidayInfo } from "../utils/holiday.js";

function buildSeedRows(userId, baseDate) {
  const rows = [];
  const defaults = [
    { item: "Pasta", sold: 60, prepared: 72, cost: 3.2 },
    { item: "Salad", sold: 44, prepared: 52, cost: 2.2 },
    { item: "Soup", sold: 38, prepared: 46, cost: 1.9 },
    { item: "Burger", sold: 52, prepared: 62, cost: 4.1 }
  ];

  for (let i = 0; i < 7; i += 1) {
    for (const dish of defaults) {
      rows.push({
        userId,
        item: dish.item,
        sold: Math.max(8, dish.sold - Math.floor(Math.random() * 10)),
        prepared: Math.max(10, dish.prepared - Math.floor(Math.random() * 8)),
        cost: dish.cost,
        date: dayjs(baseDate).subtract(i, "day").toDate()
      });
    }
  }
  return rows;
}

async function ensureSalesForPredictions(userId, baseDate) {
  if (isDbConnected()) {
    const existing = await Sales.countDocuments({ userId });
    if (existing > 0) return;
    await Sales.insertMany(buildSeedRows(userId, baseDate));
    return;
  }

  const existing = demoStore.sales.filter((s) => s.userId === userId).length;
  if (existing > 0) return;
  const seeded = buildSeedRows(userId, baseDate).map((row, index) => ({ ...row, id: `seed-${index}` }));
  demoStore.sales.unshift(...seeded);
}

export async function runPrediction(req, res) {
  try {
    const { date, weather: weatherFromBody } = req.body;
    const effectiveDate = dayjs(date || new Date());
    const dayName = effectiveDate.format("dddd");
    const isWeekend = ["Saturday", "Sunday"].includes(dayName);

    await ensureSalesForPredictions(req.user.id, effectiveDate.toDate());

    const fromDate = effectiveDate.subtract(6, "day").startOf("day").toDate();
    const toDate = effectiveDate.endOf("day").toDate();

    const salesSource = isDbConnected()
      ? await Sales.find({
          userId: req.user.id,
          date: { $gte: fromDate, $lte: toDate }
        }).sort({ date: -1 })
      : demoStore.sales
          .filter((s) => s.userId === req.user.id && new Date(s.date) >= fromDate && new Date(s.date) <= toDate)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (!salesSource.length) {
      return res.status(200).json({
        predictions: [],
        message: "No data available. Add sales data to see predictions."
      });
    }

    const weatherPayload = weatherFromBody
      ? { condition: String(weatherFromBody).toLowerCase(), temperature: 0, weathercode: 0 }
      : await getCurrentWeather();
    const holidayInfo = await getHolidayInfo(effectiveDate.toDate());
    const eventFactor = holidayInfo.isHoliday ? 1.3 : 1;

    const groupedByItem = salesSource.reduce((acc, sale) => {
      if (!acc[sale.item]) acc[sale.item] = [];
      acc[sale.item].push(sale);
      return acc;
    }, {});

    const predictions = Object.entries(groupedByItem).map(([item, records]) => {
      const totalSold = records.reduce((sum, row) => sum + Number(row.sold || 0), 0);
      const avgDemand = totalSold / 7;
      const predicted = predictDemand(avgDemand, weatherPayload.condition, dayName, eventFactor);
      const latest = records[0];
      const prepared = Number(latest?.prepared || predicted);
      const cost = Number(latest?.cost || 0);
      const waste = Math.max(0, prepared - predicted);
      const loss = Number((waste * cost).toFixed(2));
      const explanation = buildWasteExplanation({
        weather: weatherPayload.condition,
        dayName,
        isHoliday: holidayInfo.isHoliday,
        waste
      });

      return {
        item,
        avgDemand: Number(avgDemand.toFixed(2)),
        predicted,
        prepared,
        sold: Number(latest?.sold || 0),
        cost,
        waste,
        loss,
        explanation
      };
    });

    const payload = predictions.map((row) => ({
      userId: req.user.id,
      date: effectiveDate.toDate(),
      item: row.item,
      predicted: row.predicted,
      weather: weatherPayload.condition,
      event: holidayInfo.isHoliday ? holidayInfo.name || "Holiday" : "Normal",
      explanation: row.explanation
    }));

    if (isDbConnected()) {
      await Prediction.insertMany(payload);
    } else {
      demoStore.predictions.unshift(...payload);
    }

    const totalWaste = predictions.reduce((sum, row) => sum + row.waste, 0);
    const totalLoss = Number(predictions.reduce((sum, row) => sum + row.loss, 0).toFixed(2));

    return res.json({
      date: effectiveDate.format("YYYY-MM-DD"),
      dayName,
      weather: weatherPayload.condition,
      temperature: weatherPayload.temperature,
      isHoliday: holidayInfo.isHoliday,
      holidayName: holidayInfo.name,
      predictions,
      totals: {
        totalWaste,
        totalLoss
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
