"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Order, MenuItem } from "@/types";

// Админ хэсгийн үндсэн хуудас
export default function AdminPage() {
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Захиалгуудыг татах
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchOrders(), fetchMenuItems()]);
    };

    // 5 секундын дараа loading-ийг дуусгах (хэрэв API удаж байвал)
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    loadData().finally(() => {
      clearTimeout(timeout);
    });
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const result = await response.json();
      console.log("Orders API response:", result); // Debug
      // API-аас ирж буй өгөгдлийн бүтцийг шалгах
      const orders = result.data || result || [];
      setOrders(Array.isArray(orders) ? orders : []);
    } catch (error) {
      console.error("Захиалга татахад алдаа:", error);
      setOrders([]); // Алдаа гарвал хоосон массив
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch("/api/menu");
      const result = await response.json();
      console.log("Menu API response:", result); // Debug
      // API-аас ирж буй өгөгдлийн бүтцийг шалгах
      const menuItems = result.data || result || [];
      setMenuItems(Array.isArray(menuItems) ? menuItems : []);
    } catch (error) {
      console.error("Меню татахад алдаа:", error);
      setMenuItems([]); // Алдаа гарвал хоосон массив
    } finally {
      setLoading(false);
    }
  };

  // Захиалгын статус өөрчлөх
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast({
          title: t("success"),
          description: t("orderStatusUpdated"),
        });
        fetchOrders(); // Захиалгуудыг дахин татах
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: t("updateFailed"),
        variant: "destructive",
      });
    }
  };

  // Статусын өнгө
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Статусын нэр
  const getStatusName = (status: string) => {
    switch (status) {
      case "pending":
        return t("pending");
      case "preparing":
        return t("preparing");
      case "ready":
        return t("ready");
      case "completed":
        return t("completed");
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <div className="text-lg">{t("loading")}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Хэл сонгох */}
        <div className="flex justify-end mb-6">
          <div className="flex space-x-2 bg-purple-50 border border-purple-200 rounded-lg p-1">
            <Button
              variant={language === "mn" ? "default" : "ghost"}
              size="sm"
              onClick={() => setLanguage("mn")}
              className={language === "mn" ? "bg-purple-600 text-white" : ""}
            >
              MN
            </Button>
            <Button
              variant={language === "en" ? "default" : "ghost"}
              size="sm"
              onClick={() => setLanguage("en")}
              className={language === "en" ? "bg-purple-600 text-white" : ""}
            >
              EN
            </Button>
            <Button
              variant={language === "jp" ? "default" : "ghost"}
              size="sm"
              onClick={() => setLanguage("jp")}
              className={language === "jp" ? "bg-purple-600 text-white" : ""}
            >
              JP
            </Button>
          </div>
        </div>

        {/* Гарчиг */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("adminPanel")}
          </h1>
          <p className="text-gray-600">{t("adminDescription")}</p>
        </div>

        {/* Тabs */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-purple-50 border-purple-200">
            <TabsTrigger value="orders">{t("orders")}</TabsTrigger>
            <TabsTrigger value="menu">{t("menu")}</TabsTrigger>
            <TabsTrigger value="tables">{t("tables")}</TabsTrigger>
          </TabsList>

          {/* Захиалгууд */}
          <TabsContent value="orders" className="mt-6">
            <div className="grid gap-6">
              {orders.length === 0 ? (
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-600">{t("noOrders")}</p>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card
                    key={order._id}
                    className="bg-purple-50 border-purple-200"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {t("order")} #{order.orderNumber}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {t("table")}: {order.tableNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusName(order.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center bg-purple-100 p-3 rounded"
                          >
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                {t("quantity")}: {item.quantity}
                              </p>
                            </div>
                            <p className="font-medium">
                              {item.price.toLocaleString()}₮
                            </p>
                          </div>
                        ))}
                        <div className="border-t pt-3">
                          <div className="flex justify-between items-center">
                            <p className="font-bold text-lg">{t("total")}:</p>
                            <p className="font-bold text-lg text-purple-600">
                              {order.totalAmount.toLocaleString()}₮
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button
                            size="sm"
                            onClick={() =>
                              updateOrderStatus(order._id, "preparing")
                            }
                            disabled={
                              order.status === "preparing" ||
                              order.status === "ready" ||
                              order.status === "completed"
                            }
                          >
                            {t("startPreparing")}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              updateOrderStatus(order._id, "ready")
                            }
                            disabled={
                              order.status === "ready" ||
                              order.status === "completed"
                            }
                          >
                            {t("markReady")}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              updateOrderStatus(order._id, "completed")
                            }
                            disabled={order.status === "completed"}
                          >
                            {t("complete")}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Меню */}
          <TabsContent value="menu" className="mt-6">
            <div className="grid gap-6">
              {menuItems.map((item) => (
                <Card key={item._id} className="bg-purple-50 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-gray-600">{item.description}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-purple-600">
                          {item.price.toLocaleString()}₮
                        </p>
                        <Badge
                          variant={item.isAvailable ? "default" : "secondary"}
                        >
                          {item.isAvailable
                            ? t("available")
                            : t("notAvailable")}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Ширээнүүд */}
          <TabsContent value="tables" className="mt-6">
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6">
                <p className="text-center text-gray-600">
                  {t("tablesComingSoon")}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
