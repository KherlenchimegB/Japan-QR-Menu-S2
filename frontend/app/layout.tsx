import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
  title: "MonoPharma - Монгол Фармацевтийн Шийдэл",
  description: "100+ бүтээгдэхүүн, 3 хэлний дэмжлэг, emonos.mn холбоостой",
  keywords: ["монопharma", "pharma", "pharmaceutical", "mongolia", "эм", "бүтээгдэхүүн", "emonos"],
  authors: [{ name: "MonoPharma Team" }],
  openGraph: {
    title: "MonoPharma - Монгол Фармацевтийн Шийдэл",
    description: "100+ бүтээгдэхүүн, 3 хэлний дэмжлэг, emonos.mn холбоостой",
    type: "website",
    locale: "mn_MN",
    alternateLocale: ["en_US", "zh_CN"],
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  generator: "Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <div className="flex flex-col min-h-screen">
              {children}
            </div>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
