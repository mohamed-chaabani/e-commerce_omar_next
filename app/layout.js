import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import Providers from "./providers";

import AnimatedBackground from "@/components/ui/AnimatedBackground";

import TopBar from "@/components/layout/TopBar";

import Footer from "@/components/layout/Footer";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";

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
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
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
          {/* WhatsApp Fixed Button */}
          <a
            href="https://wa.me/55515331"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
            aria-label="Contact us on WhatsApp"
          >
            <i
              className="fa-brands fa-whatsapp text-white text-2xl"
              aria-hidden="true"
              title="WhatsApp"
            ></i>
          </a>
          <ScrollToTopButton />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
