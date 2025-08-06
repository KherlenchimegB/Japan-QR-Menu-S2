import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

// Routes импортлох
import menuRoutes from "./routes/menu";
import orderRoutes from "./routes/orders";
import tableRoutes from "./routes/tables";
import authRoutes from "./routes/auth";

// Middleware импортлох
import { errorHandler } from "./middleware/errorHandler";
import { connectDB } from "./config/database";

// Environment variables ачааллах
dotenv.config();

const app = express();
const PORT = process.env["PORT"] || 5000;

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env["FRONTEND_URL"] || "http://localhost:3000",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // IP хаягаас 100 хүсэлт
  message: "Хэт их хүсэлт илгээгдлээ. Дахин оролдоно уу.",
});
app.use("/api/", limiter);

// Logging middleware
app.use(morgan("combined"));

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/auth", authRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "QR Menu API ажиллаж байна",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint олдсонгүй",
  });
});

// Server эхлүүлэх
const startServer = async () => {
  try {
    // MongoDB холболт (түр хаасан)
    // await connectDB();
    // console.log("✅ MongoDB холбогдлоо");

    // Server эхлүүлэх
    app.listen(PORT, () => {
      console.log(`🚀 Server ${PORT} порт дээр ажиллаж байна`);
      console.log(
        `📱 Frontend: ${process.env["FRONTEND_URL"] || "http://localhost:3000"}`
      );
      console.log(`🔗 API: http://localhost:${PORT}/api`);
      console.log("⚠️  MongoDB холболт түр хаасан");
    });
  } catch (error) {
    console.error("❌ Server эхлүүлэхэд алдаа гарлаа:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Server унтраж байна...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Server унтраж байна...");
  process.exit(0);
});

startServer();
