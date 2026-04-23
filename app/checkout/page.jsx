"use client";

import { Suspense } from "react";
import CheckoutPage from "@/pages/CheckoutPage";

export default function CheckoutRoute() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <CheckoutPage />
    </Suspense>
  );
}
