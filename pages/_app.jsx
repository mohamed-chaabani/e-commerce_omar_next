"use client";

import { CartProvider } from "../context/CartContext";
import { ThemeProvider } from "../context/ThemeContext";
import { SearchProvider } from "../context/SearchContext";
import "../app/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <CartProvider>
        <SearchProvider>
          <Component {...pageProps} />
        </SearchProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
