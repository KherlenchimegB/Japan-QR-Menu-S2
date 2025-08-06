// Mock өгөгдлийг нэг газар хадгалах
export let mockOrders: any[] = [];
export let orderCounter = 1;

// Ширээнүүдийн өгөгдөл
export let mockTables: any[] = [];

// Ширээнүүдийг эхлүүлэх
export function initializeTables() {
  if (mockTables.length === 0) {
    for (let i = 1; i <= 20; i++) {
      mockTables.push({
        _id: `table_${i}`,
        tableNumber: i,
        qrCode: generateTableQRUrl(i),
        status: "available", // available, occupied, reserved
        currentOrder: null,
        capacity: 4, // Хүний тоо
        location: `Floor 1 - Table ${i}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }
}

// Захиалга нэмэх
export function addOrder(order: any) {
  console.log("addOrder: Adding new order:", order);
  mockOrders.push(order);
  orderCounter++;

  // Ширээний статус өөрчлөх
  const table = mockTables.find((t) => t.tableNumber === order.tableNumber);
  if (table) {
    console.log(
      "addOrder: Updating table",
      table.tableNumber,
      "with orderId:",
      order._id
    );
    table.status = "occupied";
    table.currentOrder = order._id; // orderId хадгалах
    table.updatedAt = new Date().toISOString();
  } else {
    console.log(
      "addOrder: Table not found for tableNumber:",
      order.tableNumber
    );
  }
}

// Захиалгын статус өөрчлөх
export function updateOrderStatus(orderId: string, status: string) {
  const orderIndex = mockOrders.findIndex((order) => order._id === orderId);
  if (orderIndex !== -1) {
    mockOrders[orderIndex].status = status;
    mockOrders[orderIndex].updatedAt = new Date().toISOString();

    // Хэрэв захиалга дууссан бол ширээг чөлөөлөх
    if (status === "completed") {
      const order = mockOrders[orderIndex];
      const table = mockTables.find((t) => t.tableNumber === order.tableNumber);
      if (table) {
        table.status = "available";
        table.currentOrder = null;
        table.updatedAt = new Date().toISOString();
      }
    }

    return mockOrders[orderIndex];
  }
  return null;
}

// Захиалга олох
export function findOrder(orderId: string) {
  console.log("findOrder: Looking for orderId:", orderId);
  console.log(
    "findOrder: Available orders:",
    mockOrders.map((o) => ({ id: o._id, number: o.orderNumber }))
  );
  const order = mockOrders.find((order) => order._id === orderId);
  console.log("findOrder: Found order:", order);
  return order;
}

// Бүх захиалга авах
export function getAllOrders() {
  return mockOrders;
}

// Бүх ширээ авах
export function getAllTables() {
  return mockTables;
}

// Ширээ олох
export function findTable(tableNumber: number) {
  return mockTables.find((table) => table.tableNumber === tableNumber);
}

// Ширээний статус өөрчлөх
export function updateTableStatus(tableNumber: number, status: string) {
  const tableIndex = mockTables.findIndex(
    (table) => table.tableNumber === tableNumber
  );
  if (tableIndex !== -1) {
    mockTables[tableIndex].status = status;
    mockTables[tableIndex].updatedAt = new Date().toISOString();
    return mockTables[tableIndex];
  }
  return null;
}

// QR код үүсгэх
export function generateQRCode(tableNumber: number) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return `${baseUrl}?table=${tableNumber}`;
}

// QR код URL үүсгэх (ширээний дугаартай)
export function generateTableQRUrl(tableNumber: number) {
  // GitHub Pages URL (production дээр)
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://kherlenchimegb.github.io/QR-menu"
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return `${baseUrl}?table=${tableNumber}`;
}

// Ширээнүүдийг эхлүүлэх
initializeTables();
