import mongoose from "mongoose";
import config from "./env";

const connectDB = async (uri: string): Promise<void> => {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(
      `MongoDB connected: ${mongoose.connection.db?.databaseName} @ ${mongoose.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB runtime error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected. Attempting reconnect...");
});

export default connectDB;
