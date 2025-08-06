"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export default function QRCodeComponent({
  value,
  size = 200,
  className = "",
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      }).catch((err) => {
        console.error("QR код үүсгэхэд алдаа:", err);
      });
    }
  }, [value, size]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <canvas ref={canvasRef} className="border border-gray-200 rounded-lg" />
      <p className="text-xs text-gray-500 mt-2 text-center break-all max-w-[200px]">
        {value}
      </p>
    </div>
  );
}
