import express, { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import Order from "../models/Order";
import Table from "../models/Table";
import { AppError } from "../middleware/errorHandler";

const router = express.Router();

// Бүх захиалгууд авах
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { status, table, limit = "50" } = req.query;

    let query: any = {};

    // Статусаар шүүх
    if (status) {
      query.status = status;
    }

    // Ширээгээр шүүх
    if (table) {
      query.tableNumber = parseInt(table as string);
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string));

    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  })
);

// Нэг захиалга авах
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AppError("Захиалга олдсонгүй", 404);
    }

    res.json({
      success: true,
      data: order,
    });
  })
);

// Шинэ захиалга үүсгэх
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { tableNumber, items, notes } = req.body;

    // Validation
    if (!tableNumber || !items || items.length === 0) {
      throw new AppError(
        "Ширээний дугаар болон хоолны жагсаалт заавал оруулна уу",
        400
      );
    }

    // Items validation
    for (const item of items) {
      if (!item.name || !item.quantity || !item.price) {
        throw new AppError("Хоолны мэдээлэл бүрэн бөглөгдөөгүй", 400);
      }
      if (item.quantity <= 0) {
        throw new AppError("Хоолны тоо 0-ээс их байх ёстой", 400);
      }
      if (item.price <= 0) {
        throw new AppError("Үнэ 0-ээс их байх ёстой", 400);
      }
    }

    // Нийт дүнг тооцоолох
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    // Захиалга үүсгэх
    const order = await Order.create({
      tableNumber,
      items,
      totalAmount,
      notes: notes || null,
      status: "pending",
    });

    // Ширээний статус өөрчлөх
    await Table.findOneAndUpdate(
      { number: tableNumber },
      {
        status: "occupied",
        currentOrder: order._id,
      }
    );

    res.status(201).json({
      success: true,
      data: order,
      message: "Захиалга амжилттай үүсгэгдлээ",
    });
  })
);

// Захиалгын статус өөрчлөх
router.patch(
  "/:id/status",
  asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;

    if (!status) {
      throw new AppError("Статус заавал оруулна уу", 400);
    }

    const validStatuses = ["pending", "preparing", "ready", "completed"];
    if (!validStatuses.includes(status)) {
      throw new AppError("Буруу статус", 400);
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AppError("Захиалга олдсонгүй", 404);
    }

    order.status = status;
    await order.save();

    // Хэрэв захиалга дууссан бол ширээг чөлөөлөх
    if (status === "completed") {
      await Table.findOneAndUpdate(
        { number: order.tableNumber },
        {
          status: "free",
          currentOrder: undefined,
        }
      );
    }

    res.json({
      success: true,
      data: order,
      message: "Захиалгын статус амжилттай шинэчлэгдлээ",
    });
  })
);

// Захиалга устгах
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AppError("Захиалга олдсонгүй", 404);
    }

    // Ширээг чөлөөлөх
    await Table.findOneAndUpdate(
      { number: order.tableNumber },
      {
        status: "free",
        currentOrder: undefined,
      }
    );

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Захиалга амжилттай устгагдлаа",
    });
  })
);

// Өнөөдрийн захиалгууд
router.get(
  "/today/orders",
  asyncHandler(async (req: Request, res: Response) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const orders = await Order.find({
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  })
);

// Идэвхтэй захиалгууд
router.get(
  "/active/orders",
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await Order.find({
      status: { $in: ["pending", "preparing", "ready"] },
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  })
);

// Ширээний захиалгууд
router.get(
  "/table/:tableNumber",
  asyncHandler(async (req: Request, res: Response) => {
    const { tableNumber } = req.params;

    const orders = await Order.find({
      tableNumber: parseInt(tableNumber),
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  })
);

// Статистик
router.get(
  "/stats/summary",
  asyncHandler(async (req: Request, res: Response) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Өнөөдрийн захиалгууд
    const todayOrders = await Order.find({
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    // Идэвхтэй захиалгууд
    const activeOrders = await Order.find({
      status: { $in: ["pending", "preparing", "ready"] },
    });

    // Нийт орлого
    const totalRevenue = todayOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // Дундаж захиалгын дүн
    const averageOrderValue =
      todayOrders.length > 0 ? totalRevenue / todayOrders.length : 0;

    res.json({
      success: true,
      data: {
        todayOrders: todayOrders.length,
        activeOrders: activeOrders.length,
        totalRevenue,
        averageOrderValue: Math.round(averageOrderValue),
      },
    });
  })
);

export default router;
