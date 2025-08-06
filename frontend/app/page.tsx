"use client";

import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChefHat,
  Fish,
  Soup,
  Beef,
  Coffee,
  Clock,
  Calendar,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Globe,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { MenuItem, CartItem } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

function QRMenuContent() {
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState("sushi");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get("table") || "1";

  // QR кодоос ирж буй ширээний дугаар
  const currentTable = parseInt(tableNumber);

  // Menu items авах
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("/api/menu?available=true");
        const data = await response.json();
        if (data.success) {
          setMenuItems(data.data);
        }
      } catch (error) {
        console.error("Menu мэдээлэл авахад алдаа гарлаа:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Cart-д item нэмэх
  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem._id === item._id
      );
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  // Cart-аас item хасах
  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((item) =>
          item._id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prevCart.filter((item) => item._id !== itemId);
    });
  };

  // Cart-аас item устгах
  const deleteFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
  };

  // Нийт дүн тооцоолох
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Хэлний дагуу нэр авах
  const getItemName = (item: MenuItem) => {
    switch (language) {
      case "en":
        return item.nameEn;
      case "jp":
        return item.nameJp;
      default:
        return item.name;
    }
  };

  // Хэлний дагуу тайлбар авах
  const getItemDescription = (item: MenuItem) => {
    switch (language) {
      case "en":
        return item.descriptionEn;
      case "jp":
        return item.descriptionJp;
      default:
        return item.description;
    }
  };

  // Захиалга өгөх
  const placeOrder = async () => {
    if (cart.length === 0) return;

    const orderData = {
      tableNumber: currentTable,
      items: cart.map((item) => ({
        menuItemId: item._id,
        name: getItemName(item),
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: totalAmount,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Order placed successfully:", result.data);
        // Cart цэвэрлэх
        setCart([]);

        // Амжилттай мессеж харуулах
        toast({
          title: t("orderSuccess"),
          description: result.data.orderNumber,
          variant: "default",
        });
      } else {
        toast({
          title: t("orderError"),
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Захиалга илгээхэд алдаа гарлаа:", error);
      toast({
        title: t("orderErrorGeneral"),
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Хэлний сонголт */}
      <div className="max-w-4xl mx-auto mb-4">
        <div className="flex justify-end">
          <div className="flex items-center gap-2 bg-purple-50 rounded-lg p-2 border border-purple-200">
            <Globe className="w-4 h-4 text-purple-600" />
            <Button
              variant={language === "mn" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("mn")}
              className="text-xs"
            >
              МН
            </Button>
            <Button
              variant={language === "en" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("en")}
              className="text-xs"
            >
              EN
            </Button>
            <Button
              variant={language === "jp" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("jp")}
              className="text-xs"
            >
              日本語
            </Button>
          </div>
        </div>
      </div>

      {/* Толгой хэсэг */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {t("restaurantName")}
          </h1>
          <p className="text-gray-600 mb-4">{t("qrMenuSystem")}</p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>
                {t("table")} {currentTable}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString("mn-MN")}</span>
            </div>
          </div>
        </div>

        {/* Cart хэсэг */}
        {cart.length > 0 && (
          <Card className="mb-6 bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                {t("orderList")} ({totalItems} {t("pieces")})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-3 bg-purple-100 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{getItemName(item)}</h4>
                      <p className="text-sm text-gray-600">
                        {item.price.toLocaleString()}₮
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromCart(item._id)}
                        className="w-8 h-8 p-0"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addToCart(item)}
                        className="w-8 h-8 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteFromCart(item._id)}
                        className="w-8 h-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-semibold">
                      {t("totalAmount")}:
                    </span>
                    <span className="text-xl font-bold text-purple-600">
                      {totalAmount.toLocaleString()}₮
                    </span>
                  </div>
                  <Button
                    onClick={placeOrder}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    size="lg"
                  >
                    {t("placeOrder")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Menu хэсэг */}
      <div className="max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-purple-50 border-purple-200">
            <TabsTrigger value="sushi" className="flex items-center gap-2">
              <Fish className="w-4 h-4" />
              {t("sushi")}
            </TabsTrigger>
            <TabsTrigger value="ramen" className="flex items-center gap-2">
              <Soup className="w-4 h-4" />
              {t("ramen")}
            </TabsTrigger>
            <TabsTrigger value="main" className="flex items-center gap-2">
              <Beef className="w-4 h-4" />
              {t("mainDish")}
            </TabsTrigger>
            <TabsTrigger value="drink" className="flex items-center gap-2">
              <Coffee className="w-4 h-4" />
              {t("drinks")}
            </TabsTrigger>
          </TabsList>

          {["sushi", "ramen", "main", "drink"].map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <Card
                      key={item._id}
                      className="bg-purple-50 border-purple-200 hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                          <ChefHat className="w-12 h-12 text-gray-400" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">
                            {getItemName(item)}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {getItemDescription(item)}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-purple-600">
                              {item.price.toLocaleString()}₮
                            </span>
                            <Button
                              onClick={() => addToCart(item)}
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700"
                              disabled={!item.isAvailable}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              {item.isAvailable
                                ? t("addToCart")
                                : t("notAvailable")}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default function QRMenu() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Уншиж байна...</p>
          </div>
        </div>
      }
    >
      <QRMenuContent />
    </Suspense>
  );
}
