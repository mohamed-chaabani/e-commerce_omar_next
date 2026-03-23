import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";
import Button from "./Button.jsx";
import { useCart } from "../../context/CartContext.jsx";

const formatPrice = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(3) : "0.000";
};

const ProductCard = ({ promo, nouveau, product }) => {
  const { addItem, isInCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const alreadyInCart = isInCart(product._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      className="group relative bg-white dark:bg-secondary-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
    >
      {/* Badge indicators */}
      <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-2">
        {promo && product.promoPrice && product.promoPrice > 0 && (
          <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded">
            PROMO
          </span>
        )}
        {nouveau && product.isProduit && (
          <span className="bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded">
            NOUVEAU
          </span>
        )}
        {product.featured && !product.newArrival && (
          <span className="bg-primary-500 text-white text-xs font-semibold px-2.5 py-1 rounded">
            EN VEDETTE
          </span>
        )}
      </div>

      {/* Product Image */}
      <Link
        href={product?.slug ? `/p/${product.slug}` : `/products/${product._id}`}
        // className="block relative aspect-square"
        className="block relative h-48 md:h60 lg:h-64 overflow-hidden"
      >
        <img
          src={product?.images?.[0] || ""}
          alt={product.name}
          // className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          className="w-full h-full object-contain bg-white transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
              {product.category && Array.isArray(product.category)
                ? product.category.map((cat) => cat.name).join(" / ")
                : ""}
            </span>
          </div>

          <Link
            href={
              product?.slug ? `/p/${product.slug}` : `/products/${product._id}`
            }
            className="block"
          >
            <h3 className="font-bebas text-xl tracking-wide text-secondary-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex flex-col items-stretch gap-3 mt-auto">
          <div className="flex items-baseline gap-2">
            {product.promoPrice && Number(product.promoPrice) > 0 ? (
              <>
                <span className="font-bebas font-semibold text-2xl text-primary-600 dark:text-primary-400">
                  {formatPrice(product.promoPrice)} TND
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price)} TND
                </span>
              </>
            ) : (
              <span className="font-bebas font-semibold text-2xl text-secondary-900 dark:text-white">
                {formatPrice(product.price)} TND
              </span>
            )}
          </div>

          <Button
            size="sm"
            variant={alreadyInCart ? "outline" : "primary"}
            onClick={() => {
              if (!alreadyInCart) {
                setIsLoading(true);
                setTimeout(() => {
                  addItem(product);
                  setIsLoading(false);
                }, 500);
              }
            }}
            disabled={isLoading || alreadyInCart}
            aria-label={
              alreadyInCart
                ? "Produit déjà dans le panier"
                : "Ajouter au panier"
            }
            className="flex items-center justify-center gap-1"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : alreadyInCart ? (
              <Check size={16} />
            ) : (
              <ShoppingCart size={16} />
            )}
            <span>
              {alreadyInCart
                ? "Dans le panier"
                : isLoading
                  ? "Ajout..."
                  : "Ajouter"}
            </span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
