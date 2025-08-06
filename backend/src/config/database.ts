import mongoose from "mongoose";

// MongoDB холболтын тохиргоо
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/qr-menu";

// MongoDB холболтын функц
export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      // Mongoose тохиргоонууд
      maxPoolSize: 10, // Хамгийн их холболтын тоо
      serverSelectionTimeoutMS: 5000, // Server сонгох хугацаа
      socketTimeoutMS: 45000, // Socket timeout
      bufferMaxEntries: 0, // Buffer-ийн хамгийн их утга
    });

    console.log(`✅ MongoDB холбогдлоо: ${conn.connection.host}`);

    // MongoDB холболтын алдааны event listener
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB холболтын алдаа:", err);
    });

    // MongoDB холболт тасарсан үеийн event listener
    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB холболт тасарлаа");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🛑 MongoDB холболт хаагдлаа");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ MongoDB холболтод алдаа гарлаа:", error);
    process.exit(1);
  }
};

// MongoDB холболтын статус шалгах
export const isConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

// MongoDB холболтын мэдээлэл
export const getConnectionInfo = () => {
  return {
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name,
    readyState: mongoose.connection.readyState,
  };
};
