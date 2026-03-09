import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

// Helper function to get color info
const getColorInfo = (colorName) => {
  const colorMap = {
    red: { hex: "#FF0000", label: "Rouge" },
    black: { hex: "#000000", label: "Noir" },
    white: { hex: "#FFFFFF", label: "Blanc" },
    blue: { hex: "#0000FF", label: "Bleu" },
    silver: { hex: "#C0C0C0", label: "Argenté" },
    gray: { hex: "#808080", label: "Gris" },
    green: { hex: "#008000", label: "Vert" },
    yellow: { hex: "#FFFF00", label: "Jaune" },
    orange: { hex: "#FFA500", label: "Orange" },
    brown: { hex: "#A52A2A", label: "Marron" },
  };

  return colorMap[colorName?.toLowerCase()] || { hex: "#CCCCCC", label: colorName || "Non spécifié" };
};

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  const incrementQuantity = () => {
    updateQuantity(item.cartItemId, item.quantity + 1);
  };

  const decrementQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.cartItemId, item.quantity - 1);
    } else {
      return false;
    }
  };

  return (
    <div className="flex items-start py-5 border-b border-gray-200 dark:border-secondary-700">
      {/* Product image */}
      <Link to={`/products/${item._id}`} className="shrink-0">
        <img
          src={item.images?.[0] || ""}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-md"
        />
      </Link>

      {/* Product details */}
      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <Link
            to={`/products/${item._id}`}
            className="text-lg font-medium text-secondary-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {item.name}
          </Link>

          <button
            onClick={() => removeItem(item.cartItemId)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Supprimer l'article"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex items-center gap-4 mt-1">
          <p className="text-secondary-500 dark:text-gray-400 text-sm">
            {item.category?.name}
          </p>
          
          {/* Color Display */}
          {item.selectedColor && (
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: getColorInfo(item.selectedColor).hex }}
                title={getColorInfo(item.selectedColor).label}
              ></div>
              <span className="text-sm text-secondary-600 dark:text-gray-400">
                {getColorInfo(item.selectedColor).label}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center border border-gray-300 dark:border-secondary-700 rounded-md">
            <button
              onClick={decrementQuantity}
              className="p-1.5 text-gray-500 hover:text-secondary-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              aria-label="Diminuer la quantité"
            >
              <Minus size={16} />
            </button>

            <span className="w-8 text-center font-medium text-secondary-900 dark:text-white">
              {item.quantity}
            </span>

            <button
              onClick={incrementQuantity}
              className="p-1.5 text-gray-500 hover:text-secondary-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              aria-label="Augmenter la quantité"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-medium text-secondary-900 dark:text-white">
              {(
                (item.promoPrice && item.promoPrice > 0
                  ? item.promoPrice
                  : item.price) * item.quantity
              ).toFixed(3)}{" "}
              DT
            </span>
            {item.promoPrice && item.promoPrice > 0 && (
              <span className="text-sm text-gray-500 line-through">
                {(item.price * item.quantity).toFixed(3)} DT
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
