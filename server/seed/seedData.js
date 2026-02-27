import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDb } from "../config/db.js";
import User from "../models/User.js";
import Sales from "../models/Sales.js";
import Gamification from "../models/Gamification.js";

dotenv.config();

const demoSales = [
  { item: "Pasta", sold: 65, prepared: 80, cost: 3.2 },
  { item: "Salad", sold: 42, prepared: 50, cost: 2.5 },
  { item: "Soup", sold: 55, prepared: 66, cost: 2.1 },
  { item: "Burger", sold: 70, prepared: 78, cost: 4.0 }
];

async function seed() {
  await connectDb();

  const usersSeed = [
    {
      name: "Demo Owner",
      email: "demo@restozero.com",
      password: "password123",
      restaurantName: "RestoZero Bistro",
      location: "Hyderabad"
    },
    {
      name: "Green Chef",
      email: "chef@restozero.com",
      password: "password123",
      restaurantName: "Green Table",
      location: "Hyderabad"
    }
  ];

  for (const userSeed of usersSeed) {
    let user = await User.findOne({ email: userSeed.email });
    if (!user) {
      const hashed = await bcrypt.hash(userSeed.password, 10);
      user = await User.create({
        name: userSeed.name,
        email: userSeed.email,
        password: hashed,
        restaurantName: userSeed.restaurantName,
        location: userSeed.location
      });
    }

    const salesCount = await Sales.countDocuments({ userId: user._id });
    if (salesCount === 0) {
      const today = new Date();
      const salesPayload = Array.from({ length: 7 }).flatMap((_, i) =>
        demoSales.map((s) => ({
          userId: user._id,
          date: new Date(today.getTime() - i * 86400000),
          item: s.item,
          sold: Math.max(15, s.sold - Math.floor(Math.random() * 20)),
          prepared: Math.max(20, s.prepared - Math.floor(Math.random() * 15)),
          cost: s.cost
        }))
      );
      await Sales.insertMany(salesPayload);
    }

    const game = await Gamification.findOne({ userId: user._id });
    if (!game) {
      await Gamification.create({ userId: user._id, points: 180, streak: 4, badges: ["Starter"] });
    }
  }

  console.log("Seed completed");
  process.exit(0);
}

seed();
