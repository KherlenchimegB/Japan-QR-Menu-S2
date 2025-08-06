import mongoose, { Document, Schema } from 'mongoose';

// MenuItem interface
export interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// MenuItem schema
const menuItemSchema = new Schema<IMenuItem>({
  name: {
    type: String,
    required: [true, 'Хоолны нэр заавал оруулна уу'],
    trim: true,
    maxlength: [100, 'Хоолны нэр 100 тэмдэгтээс бага байх ёстой']
  },
  description: {
    type: String,
    required: [true, 'Хоолны тайлбар заавал оруулна уу'],
    trim: true,
    maxlength: [500, 'Тайлбар 500 тэмдэгтээс бага байх ёстой']
  },
  price: {
    type: Number,
    required: [true, 'Үнэ заавал оруулна уу'],
    min: [0, 'Үнэ 0-ээс бага байж болохгүй']
  },
  image: {
    type: String,
    default: null
  },
  category: {
    type: String,
    required: [true, 'Ангилал заавал оруулна уу'],
    enum: {
      values: ['sushi', 'ramen', 'main', 'drink'],
      message: 'Ангилал нь: sushi, ramen, main, drink байх ёстой'
    }
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true, // createdAt, updatedAt автоматаар нэмэх
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index үүсгэх (хурдны хувьд)
menuItemSchema.index({ category: 1, isAvailable: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });

// Virtual field - category name
menuItemSchema.virtual('categoryName').get(function() {
  const categoryNames: { [key: string]: string } = {
    sushi: 'Суши',
    ramen: 'Рамэн',
    main: 'Үндсэн хоол',
    drink: 'Ундаа'
  };
  return categoryNames[this.category] || this.category;
});

// Pre-save middleware
menuItemSchema.pre('save', function(next) {
  // Үнэгүй хоолыг боломжгүй болгох
  if (this.price === 0) {
    this.isAvailable = false;
  }
  next();
});

// Static method - боломжтой хоолнуудыг авах
menuItemSchema.statics.getAvailableItems = function() {
  return this.find({ isAvailable: true }).sort({ category: 1, name: 1 });
};

// Static method - ангилалаар авах
menuItemSchema.statics.getByCategory = function(category: string) {
  return this.find({ category, isAvailable: true }).sort({ name: 1 });
};

// Instance method - боломжгүй болгох
menuItemSchema.methods.setUnavailable = function() {
  this.isAvailable = false;
  return this.save();
};

// Instance method - боломжтой болгох
menuItemSchema.methods.setAvailable = function() {
  this.isAvailable = true;
  return this.save();
};

export default mongoose.model<IMenuItem>('MenuItem', menuItemSchema); 