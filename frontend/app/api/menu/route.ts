import { NextRequest, NextResponse } from "next/server";

// Static menu data
const menuItems = [
  {
    _id: "1",
    name: "Калифорни ролл",
    nameEn: "California Roll",
    nameJp: "カリフォルニアロール",
    description: "Авокадо, краб, огурцы",
    descriptionEn: "Avocado, crab, cucumber",
    descriptionJp: "アボカド、カニ、キュウリ",
    price: 15000,
    category: "sushi",
    isAvailable: true,
  },
  {
    _id: "2",
    name: "Филадельфия ролл",
    nameEn: "Philadelphia Roll",
    nameJp: "フィラデルフィアロール",
    description: "Лосось, сыр, авокадо",
    descriptionEn: "Salmon, cheese, avocado",
    descriptionJp: "サーモン、チーズ、アボカド",
    price: 18000,
    category: "sushi",
    isAvailable: true,
  },
  {
    _id: "3",
    name: "Тонкоцу рамен",
    nameEn: "Tonkotsu Ramen",
    nameJp: "とんこつラーメン",
    description: "Свиной бульон, яйцо, свинина",
    descriptionEn: "Pork broth, egg, pork",
    descriptionJp: "豚骨スープ、卵、豚肉",
    price: 12000,
    category: "ramen",
    isAvailable: true,
  },
  {
    _id: "4",
    name: "Тэрияки цыпленок",
    nameEn: "Teriyaki Chicken",
    nameJp: "照り焼きチキン",
    description: "Курица в соусе терияки",
    descriptionEn: "Chicken in teriyaki sauce",
    descriptionJp: "照り焼きソースのチキン",
    price: 14000,
    category: "main",
    isAvailable: true,
  },
  {
    _id: "5",
    name: "Зеленый чай",
    nameEn: "Green Tea",
    nameJp: "緑茶",
    description: "Традиционный японский чай",
    descriptionEn: "Traditional Japanese tea",
    descriptionJp: "伝統的な日本茶",
    price: 2000,
    category: "drink",
    isAvailable: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const available = searchParams.get("available");

    let filteredItems = menuItems;
    if (available === "true") {
      filteredItems = menuItems.filter((item) => item.isAvailable);
    }

    return NextResponse.json({
      success: true,
      data: filteredItems,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Menu мэдээлэл авахад алдаа гарлаа",
      },
      { status: 500 }
    );
  }
}

// Static export-д тохируулах
export const dynamic = "force-static";
