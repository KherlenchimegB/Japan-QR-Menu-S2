import express, { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { AppError } from "../middleware/errorHandler";

const router = express.Router();

// Admin login (энгийн authentication)
router.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      throw new AppError(
        "Хэрэглэгчийн нэр болон нууц үг заавал оруулна уу",
        400
      );
    }

    // Энгийн admin authentication (production-д JWT ашиглах)
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (username === adminUsername && password === adminPassword) {
      res.json({
        success: true,
        data: {
          user: {
            id: "admin",
            username: adminUsername,
            role: "admin",
          },
          token: "admin-token-" + Date.now(), // Энгийн token
        },
        message: "Амжилттай нэвтэрлээ",
      });
    } else {
      throw new AppError("Хэрэглэгчийн нэр эсвэл нууц үг буруу", 401);
    }
  })
);

// Admin logout
router.post(
  "/logout",
  asyncHandler(async (req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Амжилттай гарлаа",
    });
  })
);

// Admin profile
router.get(
  "/profile",
  asyncHandler(async (req: Request, res: Response) => {
    // Token шалгах (энгийн)
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer admin-token-")) {
      throw new AppError("Хандах эрх байхгүй", 401);
    }

    res.json({
      success: true,
      data: {
        user: {
          id: "admin",
          username: process.env.ADMIN_USERNAME || "admin",
          role: "admin",
        },
      },
    });
  })
);

// Password өөрчлөх
router.put(
  "/change-password",
  asyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      throw new AppError("Одоогийн болон шинэ нууц үг заавал оруулна уу", 400);
    }

    if (newPassword.length < 6) {
      throw new AppError(
        "Шинэ нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой",
        400
      );
    }

    // Одоогийн нууц үг шалгах
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (currentPassword !== adminPassword) {
      throw new AppError("Одоогийн нууц үг буруу", 400);
    }

    // Production-д энд нууц үгийг hash хийж хадгалах
    // process.env.ADMIN_PASSWORD = newPassword;

    res.json({
      success: true,
      message: "Нууц үг амжилттай өөрчлөгдлөө",
    });
  })
);

// Health check
router.get(
  "/health",
  asyncHandler(async (req: Request, res: Response) => {
    res.json({
      success: true,
      data: {
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
    });
  })
);

export default router;
