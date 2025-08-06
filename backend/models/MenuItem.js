const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  nameEn: {
    type: String,
    required: true,
  },
  nameJp: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  descriptionEn: {
    type: String,
    required: true,
  },
  descriptionJp: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['sushi', 'ramen', 'main', 'drink'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema); 