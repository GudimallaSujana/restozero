import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Gamification from "../models/Gamification.js";
import { isDbConnected } from "../config/db.js";
import { demoStore } from "../utils/demoStore.js";

export async function register(req, res) {
  try {
    const { name, email, password, restaurantName, location } = req.body;

    if (!isDbConnected()) {
      demoStore.user = {
        ...demoStore.user,
        name: name || demoStore.user.name,
        email: email || demoStore.user.email,
        password: password || demoStore.user.password,
        restaurantName: restaurantName || demoStore.user.restaurantName,
        location: location || demoStore.user.location
      };
      return res.status(201).json({ message: "Registered successfully (demo mode)" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      restaurantName,
      location
    });

    await Gamification.create({ userId: user._id, points: 0, streak: 0, badges: [] });

    return res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!isDbConnected()) {
      if (email !== demoStore.user.email || password !== demoStore.user.password) {
        return res.status(401).json({ message: "Invalid demo credentials" });
      }

      const token = jwt.sign(
        { id: demoStore.user.id, restaurantName: demoStore.user.restaurantName, location: demoStore.user.location },
        process.env.JWT_SECRET || "restozero-secret",
        { expiresIn: "7d" }
      );

      return res.json({
        token,
        user: {
          id: demoStore.user.id,
          name: demoStore.user.name,
          email: demoStore.user.email,
          restaurantName: demoStore.user.restaurantName,
          location: demoStore.user.location
        }
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, restaurantName: user.restaurantName, location: user.location },
      process.env.JWT_SECRET || "restozero-secret",
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        restaurantName: user.restaurantName,
        location: user.location
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
