import mongoose from "mongoose";

export async function dbConnect() {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:");
  }
}
