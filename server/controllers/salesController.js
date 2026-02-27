import Sales from "../models/Sales.js";
import { isDbConnected } from "../config/db.js";
import { demoStore } from "../utils/demoStore.js";

export async function addSale(req, res) {
  try {
    const { date, item, sold, prepared, cost } = req.body;
    if (!item || sold === undefined || prepared === undefined || cost === undefined || !date) {
      return res.status(400).json({ message: "item, prepared, sold, cost and date are required." });
    }

    const payload = {
      userId: req.user.id,
      date: new Date(date),
      item: String(item).trim(),
      sold: Number(sold),
      prepared: Number(prepared),
      cost: Number(cost)
    };

    if (!Number.isFinite(payload.sold) || !Number.isFinite(payload.prepared) || !Number.isFinite(payload.cost)) {
      return res.status(400).json({ message: "prepared, sold and cost must be numeric values." });
    }

    if (!isDbConnected()) {
      const sale = {
        id: `${payload.item}-${Date.now()}`,
        ...payload
      };
      demoStore.sales.unshift(sale);
      return res.status(201).json(sale);
    }

    const sale = await Sales.create(payload);
    return res.status(201).json(sale);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getSales(req, res) {
  try {
    if (!isDbConnected()) {
      const sales = demoStore.sales
        .filter((s) => s.userId === req.user.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return res.json(sales);
    }

    const sales = await Sales.find({ userId: req.user.id }).sort({ date: -1 });
    return res.json(sales);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
