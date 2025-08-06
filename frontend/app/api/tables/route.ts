import { NextResponse } from "next/server";
import {
  getAllTables,
  findTable,
  updateTableStatus,
  generateQRCode,
} from "@/lib/mockData";

// Бүх ширээ авах
export async function GET() {
  try {
    const tables = getAllTables();
    return NextResponse.json({
      success: true,
      data: tables,
      message: "Ширээнүүдийн жагсаалт амжилттай илгээгдлээ",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Ширээнүүдийн жагсаалт авахад алдаа гарлаа",
      },
      { status: 500 }
    );
  }
}

// Ширээний статус өөрчлөх
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { tableNumber, status } = body;

    // Validation
    if (!tableNumber || !status) {
      return NextResponse.json(
        {
          success: false,
          message: "Ширээний дугаар болон статус заавал байх ёстой",
        },
        { status: 400 }
      );
    }

    // Ширээний статус шинэчлэх
    const updatedTable = updateTableStatus(tableNumber, status);

    if (!updatedTable) {
      return NextResponse.json(
        {
          success: false,
          message: "Ширээ олдсонгүй",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedTable,
      message: "Ширээний статус амжилттай шинэчлэгдлээ",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Ширээний статус шинэчлэхэд алдаа гарлаа",
      },
      { status: 500 }
    );
  }
}
