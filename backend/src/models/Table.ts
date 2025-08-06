import mongoose, { Document, Schema } from "mongoose";

// Table interface
export interface ITable extends Document {
  number: number;
  status: "free" | "occupied" | "reserved";
  currentOrder?: mongoose.Types.ObjectId;
  qrCode?: string;
  capacity: number;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Table schema
const tableSchema = new Schema<ITable>(
  {
    number: {
      type: Number,
      required: [true, "Ширээний дугаар заавал оруулна уу"],
      unique: true,
      min: [1, "Ширээний дугаар 1-ээс бага байж болохгүй"],
    },
    status: {
      type: String,
      enum: {
        values: ["free", "occupied", "reserved"],
        message: "Статус нь: free, occupied, reserved байх ёстой",
      },
      default: "free",
    },
    currentOrder: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    qrCode: {
      type: String,
      default: null,
    },
    capacity: {
      type: Number,
      required: [true, "Хүчин чадал заавал оруулна уу"],
      min: [1, "Хүчин чадал 1-ээс бага байж болохгүй"],
      max: [20, "Хүчин чадал 20-оос их байж болохгүй"],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, "Байршил 100 тэмдэгтээс бага байх ёстой"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index үүсгэх
tableSchema.index({ number: 1 });
tableSchema.index({ status: 1 });
tableSchema.index({ currentOrder: 1 });

// Virtual field - статусын нэр
tableSchema.virtual("statusName").get(function () {
  const statusNames: { [key: string]: string } = {
    free: "Чөлөө",
    occupied: "Эзлэгдсэн",
    reserved: "Захиалсан",
  };
  return statusNames[this.status] || this.status;
});

// Virtual field - QR код URL
tableSchema.virtual("qrCodeUrl").get(function () {
  if (this.qrCode) {
    return `${process.env.FRONTEND_URL || "http://localhost:3000"}?table=${
      this.number
    }`;
  }
  return null;
});

// Pre-save middleware
tableSchema.pre("save", function (next) {
  // QR код үүсгэх
  if (!this.qrCode) {
    this.qrCode = `table-${this.number}-${Date.now()}`;
  }
  next();
});

// Static method - чөлөө ширээнүүд
tableSchema.statics.getFreeTables = function () {
  return this.find({ status: "free" }).sort({ number: 1 });
};

// Static method - эзлэгдсэн ширээнүүд
tableSchema.statics.getOccupiedTables = function () {
  return this.find({ status: "occupied" })
    .populate("currentOrder")
    .sort({ number: 1 });
};

// Static method - захиалсан ширээнүүд
tableSchema.statics.getReservedTables = function () {
  return this.find({ status: "reserved" }).sort({ number: 1 });
};

// Instance method - эзлэх
tableSchema.methods.occupy = function (orderId: mongoose.Types.ObjectId) {
  this.status = "occupied";
  this.currentOrder = orderId;
  return this.save();
};

// Instance method - чөлөөлөх
tableSchema.methods.free = function () {
  this.status = "free";
  this.currentOrder = null;
  return this.save();
};

// Instance method - захиалах
tableSchema.methods.reserve = function () {
  this.status = "reserved";
  return this.save();
};

// Instance method - QR код шинэчлэх
tableSchema.methods.updateQRCode = function () {
  this.qrCode = `table-${this.number}-${Date.now()}`;
  return this.save();
};

export default mongoose.model<ITable>("Table", tableSchema);
