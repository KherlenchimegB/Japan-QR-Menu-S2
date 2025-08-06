import mongoose, { Document, Schema } from "mongoose";

// OrderItem interface
export interface IOrderItem {
  menuItemId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}

// Order interface
export interface IOrder extends Document {
  orderNumber: string;
  tableNumber: number;
  items: IOrderItem[];
  totalAmount: number;
  status: "pending" | "preparing" | "ready" | "completed";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// OrderItem schema
const orderItemSchema = new Schema<IOrderItem>({
  menuItemId: {
    type: Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Тоо хамгийн багадаа 1 байх ёстой"],
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Үнэ 0-ээс бага байж болохгүй"],
  },
});

// Order schema
const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        // ORD-YYYYMMDD-XXXX формат
        const date = new Date();
        const dateStr =
          date.getFullYear().toString() +
          (date.getMonth() + 1).toString().padStart(2, "0") +
          date.getDate().toString().padStart(2, "0");
        const random = Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0");
        return `ORD-${dateStr}-${random}`;
      },
    },
    tableNumber: {
      type: Number,
      required: [true, "Ширээний дугаар заавал оруулна уу"],
      min: [1, "Ширээний дугаар 1-ээс бага байж болохгүй"],
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Нийт дүн 0-ээс бага байж болохгүй"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "preparing", "ready", "completed"],
        message: "Статус нь: pending, preparing, ready, completed байх ёстой",
      },
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Тайлбар 500 тэмдэгтээс бага байх ёстой"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index үүсгэх
orderSchema.index({ tableNumber: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });

// Virtual field - статусын нэр
orderSchema.virtual("statusName").get(function () {
  const statusNames: { [key: string]: string } = {
    pending: "Хүлээгдэж байна",
    preparing: "Бэлтгэж байна",
    ready: "Бэлэн",
    completed: "Дууссан",
  };
  return statusNames[this.status] || this.status;
});

// Virtual field - нийт item тоо
orderSchema.virtual("totalItems").get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Pre-save middleware
orderSchema.pre("save", function (next) {
  // Нийт дүнг тооцоолох
  if (this.items && this.items.length > 0) {
    this.totalAmount = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }
  next();
});

// Static method - өнөөдрийн захиалгууд
orderSchema.statics.getTodayOrders = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return this.find({
    createdAt: {
      $gte: today,
      $lt: tomorrow,
    },
  }).sort({ createdAt: -1 });
};

// Static method - идэвхтэй захиалгууд
orderSchema.statics.getActiveOrders = function () {
  return this.find({
    status: { $in: ["pending", "preparing", "ready"] },
  }).sort({ createdAt: -1 });
};

// Static method - ширээний захиалгууд
orderSchema.statics.getByTable = function (tableNumber: number) {
  return this.find({ tableNumber }).sort({ createdAt: -1 });
};

// Instance method - статус өөрчлөх
orderSchema.methods.updateStatus = function (newStatus: string) {
  this.status = newStatus;
  return this.save();
};

// Instance method - захиалга дуусгах
orderSchema.methods.complete = function () {
  this.status = "completed";
  return this.save();
};

export default mongoose.model<IOrder>("Order", orderSchema);
