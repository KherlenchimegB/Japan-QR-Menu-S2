import express, { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import MenuItem from "../models/MenuItem";
import { AppError } from "../middleware/errorHandler";

const router = express.Router();

// Бүх menu items авах
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { category, available } = req.query;

    let query: any = {};

    // Ангилалаар шүүх
    if (category) {
      query.category = category;
    }

    // Зөвхөн боломжтой хоолнууд
    if (available === "true") {
      query.isAvailable = true;
    }

    const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });

    res.json({
      success: true,
      data: menuItems,
      count: menuItems.length,
    });
  })
);

// Нэг menu item авах
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      throw new AppError("Menu item олдсонгүй", 404);
    }

    res.json({
      success: true,
      data: menuItem,
    });
  })
);

// Шинэ menu item үүсгэх
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { name, description, price, category, image } = req.body;

    // Validation
    if (!name || !description || !price || !category) {
      throw new AppError("Бүх талбаруудыг бөглөнө үү", 400);
    }

    // Үнэ шалгах
    if (price <= 0) {
      throw new AppError("Үнэ 0-ээс их байх ёстой", 400);
    }

    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      category,
      image: image || null,
      isAvailable: true,
    });

    res.status(201).json({
      success: true,
      data: menuItem,
      message: "Menu item амжилттай үүсгэгдлээ",
    });
  })
);

// Menu item шинэчлэх
router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { name, description, price, category, image, isAvailable } = req.body;

    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      throw new AppError("Menu item олдсонгүй", 404);
    }

    // Шинэчлэх талбарууд
    if (name) menuItem.name = name;
    if (description) menuItem.description = description;
    if (price !== undefined) {
      if (price <= 0) {
        throw new AppError("Үнэ 0-ээс их байх ёстой", 400);
      }
      menuItem.price = price;
    }
    if (category) menuItem.category = category;
    if (image !== undefined) menuItem.image = image;
    if (isAvailable !== undefined) menuItem.isAvailable = isAvailable;

    await menuItem.save();

    res.json({
      success: true,
      data: menuItem,
      message: "Menu item амжилттай шинэчлэгдлээ",
    });
  })
);

// Menu item устгах
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      throw new AppError("Menu item олдсонгүй", 404);
    }

    res.json({
      success: true,
      message: "Menu item амжилттай устгагдлаа",
    });
  })
);

// Menu item-ийн статус өөрчлөх
router.patch(
  "/:id/status",
  asyncHandler(async (req: Request, res: Response) => {
    const { isAvailable } = req.body;

    if (typeof isAvailable !== "boolean") {
      throw new AppError("isAvailable boolean утга байх ёстой", 400);
    }

    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      throw new AppError("Menu item олдсонгүй", 404);
    }

    menuItem.isAvailable = isAvailable;
    await menuItem.save();

    res.json({
      success: true,
      data: menuItem,
      message: `Menu item ${isAvailable ? "боломжтой" : "боломжгүй"} болгосон`,
    });
  })
);

// Ангилалаар menu items авах
router.get(
  "/category/:category",
  asyncHandler(async (req: Request, res: Response) => {
    const { category } = req.params;
    const { available } = req.query;

    let query: any = { category };

    if (available === "true") {
      query.isAvailable = true;
    }

    const menuItems = await MenuItem.find(query).sort({ name: 1 });

    res.json({
      success: true,
      data: menuItems,
      count: menuItems.length,
    });
  })
);

// Хайлтын функц
router.get(
  "/search/:query",
  asyncHandler(async (req: Request, res: Response) => {
    const { query } = req.params;
    const { available } = req.query;

    let searchQuery: any = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    };

    if (available === "true") {
      searchQuery.isAvailable = true;
    }

    const menuItems = await MenuItem.find(searchQuery).sort({ name: 1 });

    res.json({
      success: true,
      data: menuItems,
      count: menuItems.length,
    });
  })
);

export default router;
