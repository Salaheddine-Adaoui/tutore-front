"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";       // 👈 le hook
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";

import QueryProvider from "@/lib/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Masquer le Header (et le Footer si nécessaire) sur /signinadmin
  const hideHeader = pathname === "/signinadmin";      // ou pathname.startsWith("/signinadmin")

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <QueryProvider>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

          {!hideHeader && <Header />}

          {children}

          {/* Masquer aussi le footer si tu veux */}
        <Footer />

          <ScrollToTop />
        </QueryProvider>
      </body>
    </html>
  );
}
