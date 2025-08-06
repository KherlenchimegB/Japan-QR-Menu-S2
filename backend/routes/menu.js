const express = require('express');
const router = express.Router();
const { connectDB } = require('../lib/mongodb');
const MenuItem = require('../models/MenuItem');

// Бүх menu items авах
router.get('/', async (req, res) => {
  try {
    await connectDB();
    const { available } = req.query;
    
    let query = {};
    if (available === 'true') {
      query.isAvailable = true;
    }
    
    const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });
    
    res.json({
      success: true,
      data: menuItems,
    });
  } catch (error) {
    console.error('Menu татахад алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Menu татахад алдаа гарлаа',
    });
  }
});

// Шинэ menu item үүсгэх
router.post('/', async (req, res) => {
  try {
    await connectDB();
    const menuItemData = req.body;

    const newMenuItem = new MenuItem(menuItemData);
    const savedMenuItem = await newMenuItem.save();

    res.json({
      success: true,
      data: savedMenuItem,
    });
  } catch (error) {
    console.error('Menu item үүсгэхэд алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Menu item үүсгэхэд алдаа гарлаа',
    });
  }
});

module.exports = router; 