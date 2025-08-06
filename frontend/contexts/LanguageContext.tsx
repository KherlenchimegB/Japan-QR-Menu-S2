"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Хэлний төрлүүд
export type Language = "mn" | "en" | "jp";

// Хэлний context interface
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string; // Translation function
}

// Хэлний context үүсгэх
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Translation data
const translations = {
  mn: {
    // Header
    restaurantName: "🍣 Япон Ресторан",
    qrMenuSystem: "QR кодоор захиалга өгөх систем",
    table: "Ширээ",
    date: "Огноо",

    // Cart
    orderList: "Захиалгын жагсаалт",
    pieces: "ширхэг",
    totalAmount: "Нийт дүн",
    placeOrder: "Захиалга өгөх",
    addToCart: "Нэмэх",
    notAvailable: "Боломжгүй",

    // Categories
    sushi: "Суши",
    ramen: "Рамэн",
    mainDish: "Үндсэн хоол",
    drinks: "Ундаа",

    // Messages
    loading: "Уншиж байна...",
    orderSuccess: "Захиалга амжилттай илгээгдлээ! Захиалгын дугаар:",
    orderError: "Захиалга илгээхэд алдаа гарлаа:",
    orderErrorGeneral: "Захиалга илгээхэд алдаа гарлаа",

    // Админ хэсгийн текстууд
    adminPanel: "Админ Хэсэг",
    adminDescription: "Захиалгуудыг удирдах, меню засварлах",
    orders: "Захиалгууд",
    menu: "Меню",
    tables: "Ширээнүүд",
    noOrders: "Захиалга байхгүй байна",
    order: "Захиалга",
    quantity: "Тоо ширхэг",
    total: "Нийт",
    pending: "Хүлээгдэж буй",
    preparing: "Бэлтгэж буй",
    ready: "Бэлэн",
    completed: "Дууссан",
    startPreparing: "Бэлтгэж эхлэх",
    markReady: "Бэлэн болгох",
    complete: "Дуусгах",
    orderStatusUpdated: "Захиалгын статус шинэчлэгдлээ",
    updateFailed: "Шинэчлэхэд алдаа гарлаа",
    available: "Боломжтой",
    tablesComingSoon: "Ширээнүүдийн удирдлага удахгүй нэмэгдэх болно",
    noTables: "Ширээ байхгүй байна",
    occupied: "Занимат",
    reserved: "Захиалгатай",
    capacity: "Хүчин чадал",
    people: "хүн",
    qrCode: "QR код",
    hasOrder: "Захиалгатай",
    setAvailable: "Чөлөөтэй болгох",
    setReserved: "Захиалгатай болгох",
    tableStatusUpdated: "Ширээний статус шинэчлэгдлээ",
    orderNotFound: "Захиалга олдсонгүй",
  },
  en: {
    // Header
    restaurantName: "🍣 Japanese Restaurant",
    qrMenuSystem: "QR Code Ordering System",
    table: "Table",
    date: "Date",

    // Cart
    orderList: "Order List",
    pieces: "pieces",
    totalAmount: "Total Amount",
    placeOrder: "Place Order",
    addToCart: "Add",
    notAvailable: "Not Available",

    // Categories
    sushi: "Sushi",
    ramen: "Ramen",
    mainDish: "Main Dish",
    drinks: "Drinks",

    // Messages
    loading: "Loading...",
    orderSuccess: "Order sent successfully! Order number:",
    orderError: "Error sending order:",
    orderErrorGeneral: "Error sending order",

    // Admin panel texts
    adminPanel: "Admin Panel",
    adminDescription: "Manage orders, edit menu",
    orders: "Orders",
    menu: "Menu",
    tables: "Tables",
    noOrders: "No orders",
    order: "Order",
    quantity: "Quantity",
    total: "Total",
    pending: "Pending",
    preparing: "Preparing",
    ready: "Ready",
    completed: "Completed",
    startPreparing: "Start Preparing",
    markReady: "Mark Ready",
    complete: "Complete",
    orderStatusUpdated: "Order status updated",
    updateFailed: "Update failed",
    available: "Available",
    tablesComingSoon: "Table management coming soon",
    noTables: "No tables",
    occupied: "Occupied",
    reserved: "Reserved",
    capacity: "Capacity",
    people: "people",
    qrCode: "QR Code",
    hasOrder: "Has Order",
    setAvailable: "Set Available",
    setReserved: "Set Reserved",
    tableStatusUpdated: "Table status updated",
    orderNotFound: "Order not found",
  },
  jp: {
    // Header
    restaurantName: "🍣 日本レストラン",
    qrMenuSystem: "QRコード注文システム",
    table: "テーブル",
    date: "日付",

    // Cart
    orderList: "注文リスト",
    pieces: "個",
    totalAmount: "合計金額",
    placeOrder: "注文する",
    addToCart: "追加",
    notAvailable: "利用不可",

    // Categories
    sushi: "寿司",
    ramen: "ラーメン",
    mainDish: "メインディッシュ",
    drinks: "ドリンク",

    // Messages
    loading: "読み込み中...",
    orderSuccess: "注文が正常に送信されました！注文番号:",
    orderError: "注文送信エラー:",

    // アドミンパネルのテキスト
    adminPanel: "管理パネル",
    adminDescription: "注文管理、メニュー編集",
    orders: "注文",
    menu: "メニュー",
    tables: "テーブル",
    noOrders: "注文がありません",
    order: "注文",
    quantity: "数量",
    total: "合計",
    pending: "保留中",
    preparing: "準備中",
    ready: "準備完了",
    completed: "完了",
    startPreparing: "準備開始",
    markReady: "準備完了にする",
    complete: "完了",
    orderStatusUpdated: "注文ステータスが更新されました",
    updateFailed: "更新に失敗しました",
    available: "利用可能",
    tablesComingSoon: "テーブル管理は近日公開予定",
    noTables: "テーブルがありません",
    occupied: "使用中",
    reserved: "予約済み",
    capacity: "定員",
    people: "人",
    qrCode: "QRコード",
    hasOrder: "注文あり",
    setAvailable: "利用可能にする",
    setReserved: "予約済みにする",
    tableStatusUpdated: "テーブルステータスが更新されました",
    orderNotFound: "注文が見つかりません",
    orderErrorGeneral: "注文送信エラー",
  },
};

// Language provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("mn");

  // Translation function
  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
