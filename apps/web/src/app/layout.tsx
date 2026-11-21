import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Przewodnik Rodzica | Zakład Ubezpieczeń Społecznych",
  description:
    "Oficjalny serwis Zakładu Ubezpieczeń Społecznych dla rodziców: kalkulator zasiłków 81,5% vs 100/70%, prawa rodzicielskie, terminy i generator wniosku ZAM.",
  keywords: [
    "ZUS",
    "Przewodnik Rodzica",
    "zasiłek macierzyński",
    "urlop rodzicielski",
    "kalkulator zasiłków 2026",
    "urlop ojcowski",
    "wcześniaki art 180 KP",
    "wniosek ZAM",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 antialiased selection:bg-[#00823C] selection:text-white">
        <Header />
        <main id="main-content" className="flex-1 flex flex-col focus:outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
