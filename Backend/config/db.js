import mongoose from "mongoose";
import { config } from "dotenv";
config();

async function dbConnection() {
  try {
    const mongoURI = process.env.MONGO_URI;
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1); 
  }
}

export default dbConnection;
