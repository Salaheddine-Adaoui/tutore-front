"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import QueryProvider from "@/lib/QueryProvider";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";

const inter = Inter({ subsets: ["latin"] });

// 🔥 chemins pour lesquels on veut masquer Header / Footer
const HIDE_LAYOUT_PATHS = ["/signin", "/signup", "/formulaire"];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  /** true si on est sur /admin* OU sur l’un des chemins à cacher */
  const hideLayout = useMemo(
    () =>
      pathname.startsWith("/admin") ||
      HIDE_LAYOUT_PATHS.some((p) => pathname.startsWith(p)),
    [pathname]
  );

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <QueryProvider>
          {!hideLayout && <Header />}
          {children}
          {!hideLayout && <Footer />}

          {/* utilitaires */}
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          <ScrollToTop />
        </QueryProvider>
      </body>
    </html>
  );
}
