import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://anbar.restaurant'),
  title: "عنبر | مطعم ومقهى Anbar",
  description: "مطبخ عصري ومساحة هادئة لتناول الأطعمة الصحية والمشروبات الدافئة تحت شمس الطبيعة.",
  keywords: ["عنبر", "مطعم عنبر", "قائمة طعام عنبر", "Anbar Restaurant", "حلب", "طعام شرقي عصري"],
  openGraph: {
    title: "عنبر | مطعم ومقهى Anbar",
    description: "حيث يلتقي الدفء بالمذاق العصري. استكشف قائمة طعام عنبر الكاملة.",
    type: "website",
    locale: "ar_SY",
    images: [
      {
        url: "/anbar-interior.jpg",
        width: 1200,
        height: 630,
        alt: "مطعم ومقهى عنبر",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body className={`${cairo.variable} font-cairo bg-anbar-bg text-anbar-dark min-h-screen relative overflow-x-hidden selection:bg-anbar-amber selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
