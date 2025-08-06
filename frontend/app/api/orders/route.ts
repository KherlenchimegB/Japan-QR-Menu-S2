import { NextResponse } from "next/server";
import {
  mockOrders,
  orderCounter,
  addOrder,
  getAllOrders,
} from "@/lib/mockData";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: getAllOrders(),
      message: "Захиалгын жагсаалт амжилттай илгээгдлээ",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Захиалгын жагсаалт авахад алдаа гарлаа",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tableNumber, items, totalAmount } = body;

    // Validation
    if (!tableNumber || !items || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Захиалгын мэдээлэл дутуу байна",
        },
        { status: 400 }
      );
    }

    // Шинэ захиалга үүсгэх
    const newOrder = {
      _id: `order_${Date.now()}`,
      orderNumber: `ORD${String(orderCounter).padStart(4, "0")}`,
      tableNumber,
      items,
      totalAmount,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addOrder(newOrder);

    return NextResponse.json({
      success: true,
      data: newOrder,
      message: "Захиалга амжилттай үүсгэгдлээ",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Захиалга үүсгэхэд алдаа гарлаа",
      },
      { status: 500 }
    );
  }
}
