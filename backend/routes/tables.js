const express = require("express");
const router = express.Router();
const { connectDB } = require("../lib/mongodb");
const Table = require("../models/Table");

// Бүх tables авах
router.get("/", async (req, res) => {
  try {
    await connectDB();
    const tables = await Table.find().sort({ tableNumber: 1 });

    res.json({
      success: true,
      data: tables,
    });
  } catch (error) {
    console.error("Tables татахад алдаа:", error);
    res.status(500).json({
      success: false,
      message: "Tables татахад алдаа гарлаа",
    });
  }
});

// Table status өөрчлөх
router.patch("/", async (req, res) => {
  try {
    await connectDB();
    const { tableNumber, status } = req.body;

    const updatedTable = await Table.findOneAndUpdate(
      { tableNumber },
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedTable) {
      return res.status(404).json({
        success: false,
        message: "Table олдсонгүй",
      });
    }

    res.json({
      success: true,
      data: updatedTable,
    });
  } catch (error) {
    console.error("Table status өөрчлөхөд алдаа:", error);
    res.status(500).json({
      success: false,
      message: "Table status өөрчлөхөд алдаа гарлаа",
    });
  }
});

module.exports = router;
