const express = require('express');
const router = express.Router();
const { connectDB } = require('../lib/mongodb');
const Order = require('../models/Order');

// Бүх захиалга авах
router.get('/', async (req, res) => {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Захиалга татахад алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Захиалга татахад алдаа гарлаа',
    });
  }
});

// Шинэ захиалга үүсгэх
router.post('/', async (req, res) => {
  try {
    await connectDB();
    const { tableNumber, items, totalAmount } = req.body;

    // Захиалгын дугаар үүсгэх
    const lastOrder = await Order.findOne().sort({ orderNumber: -1 });
    let orderNumber = 'ORD-0001';
    
    if (lastOrder) {
      const lastNumber = parseInt(lastOrder.orderNumber.split('-')[1]);
      orderNumber = `ORD-${(lastNumber + 1).toString().padStart(4, '0')}`;
    }

    const newOrder = new Order({
      orderNumber,
      tableNumber,
      items,
      totalAmount,
      status: 'pending',
    });

    const savedOrder = await newOrder.save();

    res.json({
      success: true,
      data: savedOrder,
    });
  } catch (error) {
    console.error('Захиалга үүсгэхэд алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Захиалга үүсгэхэд алдаа гарлаа',
    });
  }
});

// Захиалгын статус өөрчлөх
router.patch('/:id', async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Захиалга олдсонгүй',
      });
    }

    res.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Захиалгын статус өөрчлөхөд алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Захиалгын статус өөрчлөхөд алдаа гарлаа',
    });
  }
});

module.exports = router; 