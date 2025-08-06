require("dotenv").config();
const mongoose = require("mongoose");
const MenuItem = require("./models/MenuItem");
const Table = require("./models/Table");

const MONGODB_URI =
  "mongodb+srv://kherlenchimeg:db1234dv@cluster0.lukncma.mongodb.net/qr-menu";

// Menu items data
const menuItems = [
  {
    name: "Салмон Сүши",
    nameEn: "Salmon Sushi",
    nameJp: "サーモン寿司",
    description: "Шинэ салмон загас, будаа, нори",
    descriptionEn: "Fresh salmon, rice, nori",
    descriptionJp: "新鮮なサーモン、米、海苔",
    price: 15000,
    category: "sushi",
    isAvailable: true,
  },
  {
    name: "Туна Сүши",
    nameEn: "Tuna Sushi",
    nameJp: "マグロ寿司",
    description: "Туна загас, будаа, нори",
    descriptionEn: "Fresh tuna, rice, nori",
    descriptionJp: "新鮮なマグロ、米、海苔",
    price: 18000,
    category: "sushi",
    isAvailable: true,
  },
  {
    name: "Калифорниа Ролл",
    nameEn: "California Roll",
    nameJp: "カリフォルニアロール",
    description: "Авокадо, огурц, краб, будаа",
    descriptionEn: "Avocado, cucumber, crab, rice",
    descriptionJp: "アボカド、キュウリ、カニ、米",
    price: 12000,
    category: "sushi",
    isAvailable: true,
  },
  {
    name: "Тонкоцу Рамен",
    nameEn: "Tonkotsu Ramen",
    nameJp: "とんこつラーメン",
    description: "Гахайн махтай шөл, лапша, өндөг",
    descriptionEn: "Pork broth, noodles, egg",
    descriptionJp: "豚骨スープ、麺、卵",
    price: 25000,
    category: "ramen",
    isAvailable: true,
  },
  {
    name: "Мисо Рамен",
    nameEn: "Miso Ramen",
    nameJp: "味噌ラーメン",
    description: "Мисо шөл, лапша, овощ",
    descriptionEn: "Miso broth, noodles, vegetables",
    descriptionJp: "味噌スープ、麺、野菜",
    price: 22000,
    category: "ramen",
    isAvailable: true,
  },
  {
    name: "Шою Рамен",
    nameEn: "Shoyu Ramen",
    nameJp: "醤油ラーメン",
    description: "Шою шөл, лапша, гахайн мах",
    descriptionEn: "Soy sauce broth, noodles, pork",
    descriptionJp: "醤油スープ、麺、豚肉",
    price: 23000,
    category: "ramen",
    isAvailable: true,
  },
  {
    name: "Тэрияки Тамаго",
    nameEn: "Teriyaki Tamago",
    nameJp: "照り焼き玉子",
    description: "Тэрияки өндөг, будаа, овощ",
    descriptionEn: "Teriyaki egg, rice, vegetables",
    descriptionJp: "照り焼き卵、米、野菜",
    price: 18000,
    category: "main",
    isAvailable: true,
  },
  {
    name: "Карааге Дон",
    nameEn: "Karaage Don",
    nameJp: "唐揚げ丼",
    description: "Шарсан тахиа, будаа, овощ",
    descriptionEn: "Fried chicken, rice, vegetables",
    descriptionJp: "揚げ鶏、米、野菜",
    price: 20000,
    category: "main",
    isAvailable: true,
  },
  {
    name: "Гюдон",
    nameEn: "Gyudon",
    nameJp: "牛丼",
    description: "Гахайн мах, будаа, лук",
    descriptionEn: "Beef, rice, onion",
    descriptionJp: "牛肉、米、玉ねぎ",
    price: 22000,
    category: "main",
    isAvailable: true,
  },
  {
    name: "Нүдэн Чай",
    nameEn: "Green Tea",
    nameJp: "緑茶",
    description: "Япон нүдэн цай",
    descriptionEn: "Japanese green tea",
    descriptionJp: "日本緑茶",
    price: 5000,
    category: "drink",
    isAvailable: true,
  },
  {
    name: "Матча Латте",
    nameEn: "Matcha Latte",
    nameJp: "抹茶ラテ",
    description: "Матча, сүү, элсэн чихэр",
    descriptionEn: "Matcha, milk, sugar",
    descriptionJp: "抹茶、牛乳、砂糖",
    price: 8000,
    category: "drink",
    isAvailable: true,
  },
  {
    name: "Сакура Сода",
    nameEn: "Sakura Soda",
    nameJp: "桜ソーダ",
    description: "Сакура амттай сода",
    descriptionEn: "Sakura flavored soda",
    descriptionJp: "桜味ソーダ",
    price: 6000,
    category: "drink",
    isAvailable: true,
  },
];

// Tables data
const tables = Array.from({ length: 20 }, (_, i) => ({
  tableNumber: i + 1,
  qrCode: `https://frontend-bl0s6x4id-kherlenchimegs-projects.vercel.app?table=${
    i + 1
  }`,
  status: "available",
  currentOrder: null,
  capacity: 4,
  location: `Floor 1 - Table ${i + 1}`,
}));

async function seedData() {
  try {
    console.log("MongoDB холбогдож байна...");
    await mongoose.connect(MONGODB_URI);

    console.log("Өмнөх өгөгдлийг цэвэрлэж байна...");
    await MenuItem.deleteMany({});
    await Table.deleteMany({});

    console.log("Menu items оруулж байна...");
    const createdMenuItems = await MenuItem.insertMany(menuItems);
    console.log(`${createdMenuItems.length} menu items орууллаа`);

    console.log("Tables оруулж байна...");
    const createdTables = await Table.insertMany(tables);
    console.log(`${createdTables.length} tables орууллаа`);

    console.log("✅ Seed data амжилттай орууллаа!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed data оруулахад алдаа:", error);
    process.exit(1);
  }
}

seedData();
