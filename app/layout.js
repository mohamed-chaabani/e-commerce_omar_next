import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import Providers from "./providers";

import AnimatedBackground from "@/components/ui/AnimatedBackground";

import TopBar from "@/components/layout/TopBar";

import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",

  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",

  subsets: ["latin"],
});

export const metadata = {
  title: "smap",

  description:
    "Société spécialisée dans la vente et la distribution de pièces détachées automobiles, proposant également un service de vente en ligne. ",

  icons: {
    icon: "/images/icon%20blanc.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}

        // className={`bg-gray-50 dark:bg-secondary-950`}
      >
        <Providers>
          <AnimatedBackground />
          <Suspense fallback={null}>
            <TopBar />
          </Suspense>
          <div className="pt-12">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
