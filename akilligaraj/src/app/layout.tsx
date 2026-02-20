import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AkılliGaraj - Nakliyecinin Dijital Asistanı",
  description: "Türkiye'nin en büyük nakliyeci platformu. Sefer maliyetini hesapla, web siteni oluştur, müşterilerine ulaş. Ücretsiz başla!",
  keywords: ["nakliye", "nakliyat", "kamyon", "tır", "maliyet hesaplama", "nakliye fiyatı"],
  authors: [{ name: "AkılliGaraj" }],
  openGraph: {
    title: "AkılliGaraj - Nakliyecinin Dijital Asistanı",
    description: "Sefer maliyetini hesapla, web siteni oluştur, müşterilerine ulaş.",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
