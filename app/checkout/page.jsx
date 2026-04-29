"use client";

import { Suspense } from "react";
import CheckoutPage from "@/pages/CheckoutPage";

export default function CheckoutRoute() {
  return (
    <div className="bg-white dark:bg-secondary-900 min-h-screen">
      <Suspense fallback={<div>Chargement...</div>}>
        <CheckoutPage />
      </Suspense>
    </div>
  );
}
