import { NextResponse } from "next/server";

// Mock menu data - Монгол хэлээр
const menuItems = [
  {
    _id: "1",
    name: "Калифорниа ролл",
    nameEn: "California Roll",
    nameJp: "カリフォルニアロール",
    description: "Авокадо, өргөст хэмх, краб мах, будаа",
    descriptionEn: "Avocado, cucumber, crab meat, rice",
    descriptionJp: "アボカド、キュウリ、カニ肉、米",
    price: 15000,
    category: "sushi",
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "Филадельфия ролл",
    nameEn: "Philadelphia Roll",
    nameJp: "フィラデルフィアロール",
    description: "Лосось, бяслаг, өргөст хэмх, будаа",
    descriptionEn: "Salmon, cheese, cucumber, rice",
    descriptionJp: "サーモン、チーズ、キュウリ、米",
    price: 18000,
    category: "sushi",
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    name: "Туна ролл",
    nameEn: "Tuna Roll",
    nameJp: "マグロロール",
    description: "Туна загас, өргөст хэмх, будаа",
    descriptionEn: "Tuna fish, cucumber, rice",
    descriptionJp: "マグロ、キュウリ、米",
    price: 16000,
    category: "sushi",
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "4",
    name: "Тонкоцу рамэн",
    nameEn: "Tonkotsu Ramen",
    nameJp: "豚骨ラーメン",
    description: "Гахайн мах, өндөг, хүнсний ногоо, гоймон",
    descriptionEn: "Pork meat, egg, vegetables, noodles",
    descriptionJp: "豚肉、卵、野菜、麺",
    price: 12000,
    category: "ramen",
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "5",
    name: "Мисо рамэн",
    nameEn: "Miso Ramen",
    nameJp: "味噌ラーメン",
    description: "Мисо шөл, гахайн мах, хүнсний ногоо",
    descriptionEn: "Miso broth, pork meat, vegetables",
    descriptionJp: "味噌スープ、豚肉、野菜",
    price: 11000,
    category: "ramen",
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "6",
    name: "Тэрияки тахиа",
    nameEn: "Teriyaki Chicken",
    nameJp: "照り焼きチキン",
    description: "Тэрияки соустай тахианы мах, будаатай",
    descriptionEn: "Chicken with teriyaki sauce and rice",
    descriptionJp: "照り焼きソースの鶏肉とご飯",
    price: 14000,
    category: "main",
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "7",
    name: "Гёза",
    nameEn: "Gyoza",
    nameJp: "餃子",
    description: "Гахайн мах, хүнсний ногоотой бөглөө",
    descriptionEn: "Dumplings with pork and vegetables",
    descriptionJp: "豚肉と野菜の餃子",
    price: 8000,
    category: "main",
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "8",
    name: "Ногоон цай",
    nameEn: "Green Tea",
    nameJp: "緑茶",
    description: "Уламжлалт япон ногоон цай",
    descriptionEn: "Traditional Japanese green tea",
    descriptionJp: "伝統的な日本緑茶",
    price: 2000,
    category: "drink",
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "9",
    name: "Саке",
    nameEn: "Sake",
    nameJp: "日本酒",
    description: "Япон будааны дарс",
    descriptionEn: "Japanese rice wine",
    descriptionJp: "日本米酒",
    price: 5000,
    category: "drink",
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const available = searchParams.get("available");
    const category = searchParams.get("category");

    let filteredItems = menuItems;

    // Available items filter
    if (available === "true") {
      filteredItems = filteredItems.filter((item) => item.isAvailable);
    }

    // Category filter
    if (category) {
      filteredItems = filteredItems.filter(
        (item) => item.category === category
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredItems,
      message: "Menu мэдээлэл амжилттай илгээгдлээ",
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
