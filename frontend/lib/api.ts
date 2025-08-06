const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// Захиалга авах
export async function fetchOrders() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/orders`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Захиалга татахад алдаа:", error);
    return { success: false, data: [] };
  }
}

// Шинэ захиалга үүсгэх
export async function createOrder(orderData: any) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Захиалга үүсгэхэд алдаа:", error);
    return { success: false, message: "Захиалга үүсгэхэд алдаа гарлаа" };
  }
}

// Захиалгын статус өөрчлөх
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Захиалгын статус өөрчлөхөд алдаа:", error);
    return {
      success: false,
      message: "Захиалгын статус өөрчлөхөд алдаа гарлаа",
    };
  }
}
