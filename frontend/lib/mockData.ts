// Mock өгөгдлийг нэг газар хадгалах
export let mockOrders: any[] = [];
export let orderCounter = 1;

// Захиалга нэмэх
export function addOrder(order: any) {
  mockOrders.push(order);
  orderCounter++;
}

// Захиалгын статус өөрчлөх
export function updateOrderStatus(orderId: string, status: string) {
  const orderIndex = mockOrders.findIndex((order) => order._id === orderId);
  if (orderIndex !== -1) {
    mockOrders[orderIndex].status = status;
    mockOrders[orderIndex].updatedAt = new Date().toISOString();
    return mockOrders[orderIndex];
  }
  return null;
}

// Захиалга олох
export function findOrder(orderId: string) {
  return mockOrders.find((order) => order._id === orderId);
}

// Бүх захиалга авах
export function getAllOrders() {
  return mockOrders;
}
