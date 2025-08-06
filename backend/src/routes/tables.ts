import express, { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import Table from "../models/Table";
import Order from "../models/Order";
import { AppError } from "../middleware/errorHandler";

const router = express.Router();

// Бүх ширээнүүд авах
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.query;

    let query: any = {};

    // Статусаар шүүх
    if (status) {
      query.status = status;
    }

    const tables = await Table.find(query).sort({ number: 1 });

    res.json({
      success: true,
      data: tables,
      count: tables.length,
    });
  })
);

// Нэг ширээ авах
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const table = await Table.findById(req.params.id).populate("currentOrder");

    if (!table) {
      throw new AppError("Ширээ олдсонгүй", 404);
    }

    res.json({
      success: true,
      data: table,
    });
  })
);

// Шинэ ширээ үүсгэх
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { number, capacity, location } = req.body;

    // Validation
    if (!number || !capacity) {
      throw new AppError(
        "Ширээний дугаар болон хүчин чадал заавал оруулна уу",
        400
      );
    }

    if (number <= 0) {
      throw new AppError("Ширээний дугаар 0-ээс их байх ёстой", 400);
    }

    if (capacity <= 0 || capacity > 20) {
      throw new AppError("Хүчин чадал 1-20 хооронд байх ёстой", 400);
    }

    // Ширээний дугаар давхцаж байгаа эсэхийг шалгах
    const existingTable = await Table.findOne({ number });
    if (existingTable) {
      throw new AppError("Энэ дугаартай ширээ аль хэдийн байна", 400);
    }

    const table = await Table.create({
      number,
      capacity,
      location: location || null,
      status: "free",
    });

    res.status(201).json({
      success: true,
      data: table,
      message: "Ширээ амжилттай үүсгэгдлээ",
    });
  })
);

// Ширээ шинэчлэх
router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { number, capacity, location } = req.body;

    const table = await Table.findById(req.params.id);

    if (!table) {
      throw new AppError("Ширээ олдсонгүй", 404);
    }

    // Шинэчлэх талбарууд
    if (number !== undefined) {
      if (number <= 0) {
        throw new AppError("Ширээний дугаар 0-ээс их байх ёстой", 400);
      }

      // Ширээний дугаар давхцаж байгаа эсэхийг шалгах
      const existingTable = await Table.findOne({
        number,
        _id: { $ne: req.params.id },
      });
      if (existingTable) {
        throw new AppError("Энэ дугаартай ширээ аль хэдийн байна", 400);
      }

      table.number = number;
    }

    if (capacity !== undefined) {
      if (capacity <= 0 || capacity > 20) {
        throw new AppError("Хүчин чадал 1-20 хооронд байх ёстой", 400);
      }
      table.capacity = capacity;
    }

    if (location !== undefined) {
      table.location = location;
    }

    await table.save();

    res.json({
      success: true,
      data: table,
      message: "Ширээ амжилттай шинэчлэгдлээ",
    });
  })
);

// Ширээ устгах
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const table = await Table.findById(req.params.id);

    if (!table) {
      throw new AppError("Ширээ олдсонгүй", 404);
    }

    // Ширээ эзлэгдсэн эсэхийг шалгах
    if (table.status === "occupied") {
      throw new AppError("Эзлэгдсэн ширээг устгах боломжгүй", 400);
    }

    await Table.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Ширээ амжилттай устгагдлаа",
    });
  })
);

// Ширээний статус өөрчлөх
router.patch(
  "/:id/status",
  asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;

    if (!status) {
      throw new AppError("Статус заавал оруулна уу", 400);
    }

    const validStatuses = ["free", "occupied", "reserved"];
    if (!validStatuses.includes(status)) {
      throw new AppError("Буруу статус", 400);
    }

    const table = await Table.findById(req.params.id);

    if (!table) {
      throw new AppError("Ширээ олдсонгүй", 404);
    }

    table.status = status;

    // Хэрэв чөлөө болгож байгаа бол currentOrder-ийг цэвэрлэх
    if (status === "free") {
      table.currentOrder = undefined;
    }

    await table.save();

    res.json({
      success: true,
      data: table,
      message: "Ширээний статус амжилттай шинэчлэгдлээ",
    });
  })
);

// Чөлөө ширээнүүд
router.get(
  "/free/tables",
  asyncHandler(async (req: Request, res: Response) => {
    const tables = await Table.find({ status: "free" }).sort({ number: 1 });

    res.json({
      success: true,
      data: tables,
      count: tables.length,
    });
  })
);

// Эзлэгдсэн ширээнүүд
router.get(
  "/occupied/tables",
  asyncHandler(async (req: Request, res: Response) => {
    const tables = await Table.find({ status: "occupied" }).sort({ number: 1 });

    res.json({
      success: true,
      data: tables,
      count: tables.length,
    });
  })
);

// Захиалсан ширээнүүд
router.get(
  "/reserved/tables",
  asyncHandler(async (req: Request, res: Response) => {
    const tables = await Table.find({ status: "reserved" }).sort({ number: 1 });

    res.json({
      success: true,
      data: tables,
      count: tables.length,
    });
  })
);

// Ширээний QR код шинэчлэх
router.patch(
  "/:id/qr-code",
  asyncHandler(async (req: Request, res: Response) => {
    const table = await Table.findById(req.params.id);

    if (!table) {
      throw new AppError("Ширээ олдсонгүй", 404);
    }

    // QR код шинэчлэх (энгийн)
    table.qrCode = `table-${table.number}-${Date.now()}`;
    await table.save();

    res.json({
      success: true,
      data: table,
      message: "QR код амжилттай шинэчлэгдлээ",
    });
  })
);

// Ширээний захиалгууд
router.get(
  "/:id/orders",
  asyncHandler(async (req: Request, res: Response) => {
    const table = await Table.findById(req.params.id);

    if (!table) {
      throw new AppError("Ширээ олдсонгүй", 404);
    }

    const orders = await Order.find({ tableNumber: table.number }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  })
);

export default router;
