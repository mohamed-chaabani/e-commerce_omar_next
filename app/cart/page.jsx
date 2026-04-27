"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/cart/CartItem";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart } = useCart();

  // Update document title dynamically
  useEffect(() => {
    if (typeof document !== "undefined") {
      const title =
        items.length === 0
          ? "Panier vide | Smap Auto Pro"
          : `Panier (${totalItems} article${totalItems > 1 ? "s" : ""}) | Smap Auto Pro`;
      document.title = title;
    }
  }, [items.length, totalItems]);

  if (items.length === 0) {
    return (
      <div className="relative z-10 min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
        <ShoppingCart
          size={64}
          className="text-gray-300 dark:text-secondary-700 mb-4"
        />
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
          Votre panier est vide
        </h1>
        <p className="text-secondary-600 dark:text-gray-400 mb-8 text-center">
          Il semble que vous n&apos;avez pas encore ajouté de produits à votre
          panier.
        </p>
        <Link href="/products">
          <Button variant="primary" size="lg">
            Commencer les achats
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-12 max-w-6xl mt-12"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 dark:text-white">
          Votre Panier
        </h1>
        <span className="text-secondary-600 dark:text-gray-400">
          {totalItems} {totalItems === 1 ? "article" : "articles"}
        </span>
      </div>

      <div className="relative z-10 grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6">
            {items.map((item) => (
              <CartItem key={item.cartItemId || item._id} item={item} />
            ))}

            <div className="mt-6 flex justify-between">
              <Link
                href="/products"
                className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                <ArrowLeft size={16} className="mr-2" />
                Continuer les achats
              </Link>

              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Vider le panier
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Résumé de la commande
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-secondary-600 dark:text-gray-400">
                  Sous-total
                </span>
                <span className="font-medium text-secondary-900 dark:text-white">
                  {totalPrice.toFixed(3)} DT
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600 dark:text-gray-400">
                  Taxe
                </span>
                <span className="font-medium text-secondary-900 dark:text-white">
                  Calculé au checkout
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-secondary-700 pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-secondary-900 dark:text-white">
                    Total
                  </span>
                  <span className="font-bold text-xl text-secondary-900 dark:text-white">
                    {totalPrice.toFixed(3)} DT
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="mb-4"
              onClick={() => router.push("/checkout")}
            >
              Passer au checkout
            </Button>

            <div className="text-xs text-center text-secondary-600 dark:text-gray-400">
              Paiement sécurisé
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
