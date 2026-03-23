import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
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
  description: "smap",
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
          <TopBar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
