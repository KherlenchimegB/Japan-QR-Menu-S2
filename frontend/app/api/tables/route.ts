import { NextRequest, NextResponse } from "next/server";

// Static tables data
const tables = Array.from({ length: 20 }, (_, i) => ({
  _id: `table_${i + 1}`,
  tableNumber: i + 1,
  qrCode: `https://kherlenchimegb.github.io/Japan-QR-Menu-S2?table=${i + 1}`,
  status: "available",
  currentOrder: null,
  capacity: 4,
  location: `Floor 1 - Table ${i + 1}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: tables,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Ширээ татахад алдаа гарлаа",
      },
      { status: 500 }
    );
  }
}

// Static export-д тохируулах
export const dynamic = "force-static"; 