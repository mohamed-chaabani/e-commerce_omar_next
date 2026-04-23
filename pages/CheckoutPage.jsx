"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { post } from "../functions/restApi";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";

const tunisianGovernorates = [
  "Ariana",
  "Béja",
  "Ben Arous",
  "Bizerte",
  "Gabès",
  "Gafsa",
  "Jendouba",
  "Kairouan",
  "Kasserine",
  "Kébili",
  "Le Kef",
  "Mahdia",
  "La Manouba",
  "Médenine",
  "Monastir",
  "Nabeul",
  "Sfax",
  "Sidi Bouzid",
  "Siliana",
  "Sousse",
  "Tataouine",
  "Tozeur",
  "Tunis",
  "Zaghouan",
].sort();

// Tunisian mobile prefixes by operator
const tunisianMobilePrefixes = [
  // Ooredoo
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  // Orange
  "50",
  "51",
  "52",
  "53",
  "54",
  "55",
  "56",
  "57",
  "58",
  "59",
  // Tunisie Telecom
  "90",
  "91",
  "92",
  "93",
  "94",
  "95",
  "96",
  "97",
  "98",
  "99",
];

const getOperatorFromPrefix = (prefix) => {
  if (
    ["20", "21", "22", "23", "24", "25", "26", "27", "28", "29"].includes(
      prefix,
    )
  )
    return "Ooredoo";
  if (
    ["50", "51", "52", "53", "54", "55", "56", "57", "58", "59"].includes(
      prefix,
    )
  )
    return "Orange";
  if (
    ["90", "91", "92", "93", "94", "95", "96", "97", "98", "99"].includes(
      prefix,
    )
  )
    return "Tunisie Telecom";
  return null;
};

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

  return (
    colorMap[colorName?.toLowerCase()] || {
      hex: "#CCCCCC",
      label: colorName || "Non spécifié",
    }
  );
};

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();

  const router = useRouter();
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [phoneOperator, setPhoneOperator] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    fullName: "",
    address: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      // Keep digits only, max 8 digits
      const digits = value.replace(/\D/g, "").slice(0, 8);
      const prefix = digits.slice(0, 2);
      setShippingInfo((prev) => ({ ...prev, phone: digits }));
      // Infer operator and validate prefix
      if (digits.length >= 2) {
        const op = getOperatorFromPrefix(prefix);
        setPhoneOperator(op || "");
        if (!op) {
          setPhoneError(
            "Préfixe non reconnu (TT: 2x, Ooredoo: 5x, Orange: 9x)",
          );
        } else if (digits.length > 0 && digits.length < 8) {
          setPhoneError("Numéro incomplet (8 chiffres requis)");
        } else {
          setPhoneError("");
        }
      } else {
        setPhoneOperator("");
        setPhoneError("");
      }
      return;
    }

    if (name === "fullName" || name === "address") {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: value.trim() ? "" : prev[name],
      }));
    }
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {
      fullName: shippingInfo.fullName.trim() ? "" : "Champ obligatoire",
      address: shippingInfo.address.trim() ? "" : "Champ obligatoire",
    };
    setFieldErrors(nextErrors);
    if (nextErrors.fullName || nextErrors.address) {
      return;
    }

    const normalizedShippingInfo = {
      ...shippingInfo,
      fullName: shippingInfo.fullName.trim(),
      address: shippingInfo.address.trim(),
    };

    const orderData = {
      shippingInfo: normalizedShippingInfo,
      orderItems: items.map((item) => ({
        _id: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.images[0],
        product: item._id,
        selectedColor: item.selectedColor || null,
      })),
      totalPrice,
    };

    try {
      // Final phone validation before submit
      if (!shippingInfo.phone || shippingInfo.phone.length !== 8) {
        setPhoneError("Numéro invalide: 8 chiffres requis");
        return;
      }
      if (!getOperatorFromPrefix(shippingInfo.phone.slice(0, 2))) {
        setPhoneError("Préfixe non reconnu (TT: 2x, Ooredoo: 5x, Orange: 9x)");
        return;
      }

      const response = await post(
        // `https://backend-omar-90dc.onrender.com/api/order`,
        // `http://localhost:5000/api/order`,
        `https://backend-omar-5d89.onrender.com/api/order`,
        orderData,
      );

      if (response && response.data) {
        clearCart();
        // TODO: Create an Order Confirmation Page
        router.push(`/`); // Redirect to home for now
        toast.success("Votre commande a été passée avec succès!");
      } else {
        throw new Error("Une erreur inattendue est survenue.");
      }
    } catch (error) {
      console.error("Erreur lors de la commande:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Impossible de passer la commande";
      toast.error(`Erreur: ${errorMessage}`);
    }
  };

  return (
    <div className="relative z-10 container mx-auto px-4 py-8 mt-12 ">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Page de Paiement
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulaire d'informations client */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Informations de livraison
          </h2>
          <form
            id="checkout-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nom complet
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={shippingInfo.fullName}
                onChange={handleInputChange}
                required
                className={`mt-1 block w-full bg-white dark:bg-gray-700 border rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  fieldErrors.fullName
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {fieldErrors.fullName && (
                <div className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {fieldErrors.fullName}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Adresse
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                required
                className={`mt-1 block w-full bg-white dark:bg-gray-700 border rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  fieldErrors.address
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {fieldErrors.address && (
                <div className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {fieldErrors.address}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Gouvernorat
              </label>
              <select
                id="city"
                name="city"
                value={shippingInfo.city}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="" disabled>
                  Sélectionnez un gouvernorat
                </option>
                {tunisianGovernorates.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={shippingInfo.phone}
                onChange={handleInputChange}
                required
                inputMode="numeric"
                maxLength={8}
                placeholder="ex: 58XXXXXX"
                className={`mt-1 block w-full bg-white dark:bg-gray-700 border rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  phoneError
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              <div className="mt-1 flex items-center justify-between text-xs">
                <span
                  className={`text-gray-500 dark:text-gray-400 ${
                    phoneOperator ? "" : "invisible"
                  }`}
                >
                  Opérateur:{" "}
                  <span className="font-medium">{phoneOperator || "-"}</span>
                </span>
                {phoneError && (
                  <span className="text-red-600 dark:text-red-400">
                    {phoneError}
                  </span>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Résumé de la commande */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Résumé de la commande
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {item.name}
                      </p>
                      {item.selectedColor && (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                            style={{
                              backgroundColor: getColorInfo(item.selectedColor)
                                .hex,
                            }}
                            title={getColorInfo(item.selectedColor).label}
                          ></div>
                          <span className="text-sm text-secondary-600 dark:text-gray-400">
                            {getColorInfo(item.selectedColor).label}
                          </span>
                        </div>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Qté: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {(item.price * item.quantity).toFixed(3)} DT
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Sous-total
                </span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {totalPrice.toFixed(3)} DT
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Livraison
                </span>
                {/*  */}
                {["Ariana", "Ben Arous", "La Manouba", "Tunis"].includes(
                  shippingInfo.city,
                ) ? (
                  <span className="font-medium text-green-400">Gratuite</span>
                ) : (
                  <span className="font-medium text-gray-800 dark:text-white">
                    7.000 DT
                  </span>
                )}
                {/* <span className="font-medium text-green-400">Gratuite</span> */}
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                <span className="text-gray-800 dark:text-white">Total</span>
                <span className="text-gray-800 dark:text-white">
                  {totalPrice.toFixed(3)} DT
                </span>
              </div>
            </div>
            <Button
              type="submit"
              form="checkout-form"
              variant="primary"
              size="lg"
              fullWidth
              className="mt-4 bg-green-600 hover:bg-green-700 focus:ring-green-500 dark:bg-green-600 dark:hover:bg-green-700"
            >
              Procéder au paiement
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
