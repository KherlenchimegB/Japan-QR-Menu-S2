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
