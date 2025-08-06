// Menu item интерфейс - олон хэлний дэмжлэгтэй
export interface MenuItem {
  _id: string;
  name: string; // Монгол хэл
  nameEn: string; // Англи хэл
  nameJp: string; // Япон хэл
  description: string; // Монгол хэл
  descriptionEn: string; // Англи хэл
  descriptionJp: string; // Япон хэл
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

// Cart item интерфейс
export interface CartItem extends MenuItem {
  quantity: number;
}

// Order item интерфейс
export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

// Order интерфейс
export interface Order {
  _id: string;
  orderNumber: string;
  tableNumber: number;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Table интерфейс
export interface Table {
  _id: string;
  tableNumber: number;
  qrCode: string;
  status: "available" | "occupied" | "reserved";
  currentOrder?: string | null;
  capacity: number;
  location: string;
  createdAt: string;
  updatedAt: string;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Статистик
export interface Stats {
  todayOrders: number;
  activeOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}
