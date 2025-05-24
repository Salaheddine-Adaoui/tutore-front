"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
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
  const [showLayout, setShowLayout] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(pathname.startsWith("/admin"));
    setShowLayout(true);
  }, [pathname]);

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <QueryProvider>
          {showLayout && !isAdmin && <Header />}
          {children}
          {showLayout && !isAdmin && <Footer />}
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          <ScrollToTop />
        </QueryProvider>
      </body>
    </html>
  );
}
