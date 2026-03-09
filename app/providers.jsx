"use client";

import React from "react";
import { ThemeProvider } from "../context/ThemeContext";
import { CartProvider } from "../context/CartContext";
import { SearchProvider } from "../context/SearchContext";

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <CartProvider>
        <SearchProvider>{children}</SearchProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
