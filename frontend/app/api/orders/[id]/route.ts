import { NextResponse } from "next/server";
import { findOrder, updateOrderStatus } from "@/lib/mockData";

// Захиалгын статус өөрчлөх
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // Захиалгын статус шинэчлэх
    const updatedOrder = updateOrderStatus(id, status);

    if (!updatedOrder) {
      return NextResponse.json(
        {
          success: false,
          message: "Захиалга олдсонгүй",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: "Захиалгын статус амжилттай шинэчлэгдлээ",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Захиалгын статус шинэчлэхэд алдаа гарлаа",
      },
      { status: 500 }
    );
  }
}

// Захиалгын дэлгэрэнгүй мэдээлэл авах
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Захиалгыг олох
    const order = findOrder(id);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Захиалга олдсонгүй",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: "Захиалгын мэдээлэл амжилттай илгээгдлээ",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Захиалгын мэдээлэл авахад алдаа гарлаа",
      },
      { status: 500 }
    );
  }
}
