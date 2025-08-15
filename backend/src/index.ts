import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

// Routes импортлох
import productRoutes from "./routes/products";
import categoryRoutes from "./routes/categories";
import mediaRoutes from "./routes/media";

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
  max: 200, // IP хаягаас 200 хүсэлт (increased for pharmaceutical site)
  message: "Хэт их хүсэлт илгээгдлээ. Дахин оролдоно уу.",
});
app.use("/api/", limiter);

// Logging middleware
app.use(morgan("combined"));

// Body parser middleware
app.use(express.json({ limit: "50mb" })); // Increased for media uploads
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// API routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/media", mediaRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "MonoPharma API ажиллаж байна",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    features: [
      "3-хэлний дэмжлэг",
      "100+ бүтээгдэхүүн",
      "emonos.mn холбоос",
      "Видео болон 3D дэмжлэг"
    ]
  });
});

// API documentation endpoint
app.get("/api", (req, res) => {
  res.json({
    name: "MonoPharma API",
    version: "1.0.0",
    description: "Монгол фармацевтийн компанийн API",
    endpoints: {
      products: {
        "GET /api/products": "Бүх бүтээгдэхүүн",
        "GET /api/products/:id": "Тодорхой бүтээгдэхүүн",
        "GET /api/products/slug/:slug": "Slug-аар бүтээгдэхүүн хайх",
        "GET /api/products/featured": "Онцлох бүтээгдэхүүн",
        "GET /api/products/search": "Бүтээгдэхүүн хайх",
        "GET /api/products/:id/emonos-redirect": "emonos.mn руу шилжих"
      },
      categories: {
        "GET /api/categories": "Бүх ангилал",
        "GET /api/categories/roots": "Үндсэн ангилал",
        "GET /api/categories/:id": "Тодорхой ангилал",
        "GET /api/categories/slug/:slug": "Slug-аар ангилал хайх",
        "GET /api/categories/:id/children": "Дэд ангилал"
      },
      media: {
        "POST /api/media/upload": "Медиа файл оруулах",
        "GET /api/media/:id": "Медиа файл авах"
      }
    },
    languages: ["mn", "en", "zh"],
    features: [
      "Олон хэлний дэмжлэг",
      "emonos.mn интеграци", 
      "Видео болон 3D дэмжлэг",
      "SEO оптимизаци",
      "Responsive дизайн"
    ]
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint олдсонгүй",
    availableEndpoints: [
      "/api/products",
      "/api/categories", 
      "/api/media",
      "/api/health"
    ]
  });
});

// Server эхлүүлэх
const startServer = async () => {
  try {
    // MongoDB холболт
    await connectDB();
    console.log("✅ MongoDB холбогдлоо");

    // Server эхлүүлэх
    app.listen(PORT, () => {
      console.log(`🚀 MonoPharma API ${PORT} порт дээр ажиллаж байна`);
      console.log(
        `📱 Frontend: ${process.env["FRONTEND_URL"] || "http://localhost:3000"}`
      );
      console.log(`🔗 API: http://localhost:${PORT}/api`);
      console.log(`📋 API Docs: http://localhost:${PORT}/api`);
      console.log(`💊 MonoPharma - Монгол Фармацевтийн API`);
    });
  } catch (error) {
    console.error("❌ Server эхлүүлэхэд алдаа гарлаа:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 MonoPharma API унтраж байна...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 MonoPharma API унтраж байна...");
  process.exit(0);
});

startServer();
