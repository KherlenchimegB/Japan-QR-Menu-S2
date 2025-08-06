"use client";

import { useState, useEffect } from "react";
import { Order } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface OrderDetailsProps {
  orderId: string;
}

export default function OrderDetails({ orderId }: OrderDetailsProps) {
  const { t } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        console.log("OrderDetails: Fetching order with ID:", orderId);
        const response = await fetch(`/api/orders/${orderId}`);
        const result = await response.json();
        console.log("OrderDetails: API response:", result);
        if (result.success) {
          setOrder(result.data);
        }
      } catch (error) {
        console.error("Захиалгын дэлгэрэнгүй мэдээлэл авахад алдаа:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="text-center py-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-2">
        <p className="text-xs text-gray-500">{t("orderNotFound")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-purple-200 rounded-lg p-3 mb-3">
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium text-purple-700">
            {t("order")} #{order.orderNumber}
          </span>
          <span className="text-gray-500">
            {new Date(order.createdAt).toLocaleTimeString("mn-MN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Захиалгын жагсаалт */}
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center text-xs"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {item.name}
                </p>
                <p className="text-gray-500">
                  {item.quantity} {t("pieces")} × {item.price.toLocaleString()}₮
                </p>
              </div>
              <div className="text-right ml-2">
                <p className="font-medium text-purple-600">
                  {(item.quantity * item.price).toLocaleString()}₮
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Нийт дүн */}
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-800">
              {t("total")}:
            </span>
            <span className="text-sm font-bold text-purple-600">
              {order.totalAmount.toLocaleString()}₮
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
