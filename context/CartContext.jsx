"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const calculateCartTotals = (items) => {
  return {
    totalItems: items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: items.reduce(
      (total, item) =>
        total +
        (item.promoPrice && item.promoPrice > 0 ? item.promoPrice : item.price) *
          item.quantity,
      0,
    ),
  };
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const getItemKey = (item) => `${item._id}-${item.selectedColor || "no-color"}`;

      const existingItemIndex = state.items.findIndex(
        (item) => getItemKey(item) === getItemKey(action.payload),
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };

        return {
          ...state,
          items: updatedItems,
          ...calculateCartTotals(updatedItems),
        };
      }

      const newItem = {
        ...action.payload,
        quantity: 1,
        cartItemId: getItemKey(action.payload),
      };

      const updatedItems = [...state.items, newItem];

      return {
        ...state,
        items: updatedItems,
        ...calculateCartTotals(updatedItems),
      };
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.cartItemId !== action.payload,
      );

      return {
        ...state,
        items: updatedItems,
        ...calculateCartTotals(updatedItems),
      };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: id });
      }

      const updatedItems = state.items.map((item) =>
        item.cartItemId === id ? { ...item, quantity } : item,
      );

      return {
        ...state,
        items: updatedItems,
        ...calculateCartTotals(updatedItems),
      };
    }

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
};

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, (initial) => {
    if (typeof window === "undefined") return initial;
    try {
      const storedCart = window.localStorage?.getItem("cart");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart.items)) {
          return parsedCart;
        }
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
    }
    return initial;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage?.setItem("cart", JSON.stringify(state));
    }
  }, [state]);

  const addItem = (product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  };

  const removeItem = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const isInCart = (id, selectedColor = null) => {
    const getItemKey = (item) => `${item._id}-${item.selectedColor || "no-color"}`;
    const searchKey = `${id}-${selectedColor || "no-color"}`;
    return state.items.some((item) => getItemKey(item) === searchKey);
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
