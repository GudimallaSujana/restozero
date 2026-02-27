import mongoose from "mongoose";

let dbConnected = false;

export function isDbConnected() {
  return dbConnected && mongoose.connection.readyState === 1;
}

export async function connectDb() {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/restozero";
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    dbConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    dbConnected = false;
    console.error("MongoDB connection failed", error.message);
    console.log("Running in offline demo mode (in-memory data).");
  }
}
