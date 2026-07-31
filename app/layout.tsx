import type { Metadata } from "next";
import "./globals.css";
import Pixels from "@/components/Pixels";

// Системный шрифт — без Google Fonts (латентность в Индонезии).
export const metadata: Metadata = {
  title: "Pilar Qurany",
  description: "Analisis model amal — 7 pertanyaan.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-full">
        {children}
        <Pixels />
      </body>
    </html>
  );
}
