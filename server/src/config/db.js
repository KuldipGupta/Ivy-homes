import mongoose from 'mongoose';
import { config } from './env.js';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB (${err.message}). In-memory fallback will be used if needed.`);
  }
}

export function isDbConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}
