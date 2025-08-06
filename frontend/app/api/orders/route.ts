import { NextRequest, NextResponse } from "next/server";

// Static orders data
let orders: any[] = [];
let orderCounter = 1;

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Захиалга татахад алдаа гарлаа",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tableNumber, items, totalAmount } = body;

    const newOrder = {
      _id: `order_${Date.now()}`,
      orderNumber: `ORD-${orderCounter.toString().padStart(4, "0")}`,
      tableNumber,
      items,
      totalAmount,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    orderCounter++;

    return NextResponse.json({
      success: true,
      data: newOrder,
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

// Static export-д тохируулах
export const dynamic = "force-static";
