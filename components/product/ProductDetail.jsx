"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Share2,
  Star,
  Loader2,
  Check,
  Copy,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// import { FacebookShareButton, WhatsappShareButton } from "react-share";
import Button from "../ui/Button.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { categoryLvl3Service } from "../../services/categoryLvl3Service.js";
import HorizontalProductScroll from "../ui/HorizontalProductScroll.jsx";
import { getAllProducts } from "../../services/productService.js";
import { toast } from "react-toastify";

// Helper function to extract YouTube video ID from various URL formats
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  let videoId = null;
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|)([^&\?#]+)/,
    /(?:https?:\/\/)?youtu\.be\/([^&\?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      videoId = match[1];
      break;
    }
  }
  return videoId;
};

const formatPrice = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(3) : "0.000";
};

const ProductDetail = ({ product }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem, isInCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0]);
  const filteredColors = (product.colors || []).filter(
    (c) => c && c.trim() !== "",
  );
  const [selectedColor, setSelectedColor] = useState(
    filteredColors.length > 0 ? filteredColors[0] : undefined,
  );
  const router = useRouter();
  const [hideFuel, setHideFuel] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

  const playerRef = useRef(null);
  const shareMenuRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [isPlayerReady, setPlayerReady] = useState(false);
  const videoId = getYouTubeVideoId(product?.video_link);

  // Share data
  const BACKEND_API = "https://backend-omar-5d89.onrender.com/api";
  const FRONTEND_BASE = "https://e-commerce-omar.vercel.app"; // frontend public site
  const frontendProductUrl = product?.slug
    ? `${FRONTEND_BASE}/p/${encodeURIComponent(product.slug)}`
    : `${FRONTEND_BASE}/products/${product?._id}`;
  const shareUrl = `${BACKEND_API}/products/share/${product?._id}?redirect=${encodeURIComponent(
    frontendProductUrl,
  )}`;
  const shareTitle = product?.name || "Smap Auto Pro";
  const shareDesc = product?.description || "";

  useEffect(() => {
    const loadLvl3 = async () => {
      try {
        const lvl3 = await categoryLvl3Service.getCategoriesLvl3();
        const prodLvl2 = (product?.categorieLvl2 || "").trim().toLowerCase();
        const accessoires = lvl3?.find(
          (c) => (c?.name || "").trim().toLowerCase() === "accessoires auto",
        );
        if (!accessoires || !Array.isArray(accessoires.categories_list)) {
          setHideFuel(false);
          return;
        }
        const existsInAccessoires = accessoires.categories_list.some((item) => {
          const nm = (item?.name || item?.label || "").trim().toLowerCase();
          return nm === prodLvl2;
        });
        setHideFuel(existsInAccessoires);
      } catch (e) {
        setHideFuel(false);
      }
    };
    loadLvl3();
  }, [product?.categorieLvl2]);

  useEffect(() => {
    if (product?.images?.[0]) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  // Fetch related products from the same category
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await getAllProducts();
        if (response?.products && product?.categorieLvl2) {
          // Group products by categorieLvl2
          const productsByCategory = {};

          response.products.forEach((p) => {
            // Exclude current product
            if (p._id === product._id) return;

            // Check if product has categorieLvl2
            if (p.categorieLvl2) {
              if (!productsByCategory[p.categorieLvl2]) {
                productsByCategory[p.categorieLvl2] = [];
              }
              productsByCategory[p.categorieLvl2].push(p);
            }
          });

          // Take 2 products from each categorieLvl2
          const filtered = [];
          Object.keys(productsByCategory).forEach((categoryLvl2) => {
            const productsInCategory = productsByCategory[categoryLvl2];
            // Add first 2 products from this category
            filtered.push(...productsInCategory.slice(0, 2));
          });

          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    if (product?._id) {
      fetchRelatedProducts();
    }
  }, [product?._id, product?.categorieLvl2]);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target)
      ) {
        setIsShareMenuOpen(false);
      }
    };

    if (isShareMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isShareMenuOpen]);

  useEffect(() => {
    if (!videoId || playerRef.current) return;

    const onPlayerReady = (event) => {
      setPlayerReady(true);
    };

    const onYouTubeIframeAPIReady = () => {
      if (videoContainerRef.current) {
        playerRef.current = new window.YT.Player(
          `youtube-player-${product._id}`,
          {
            videoId: videoId,
            playerVars: {
              autoplay: 0,
              controls: 1,
              rel: 0,
              modestbranding: 1,
            },
            events: {
              onReady: onPlayerReady,
            },
          },
        );
      }
    };

    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      window.onYouTubeIframeAPIReady = null;
      setPlayerReady(false);
    };
  }, [videoId, product._id]);

  useEffect(() => {
    if (!isPlayerReady) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          playerRef.current &&
          typeof playerRef.current.playVideo === "function"
        ) {
          if (entry.isIntersecting) {
            playerRef.current.playVideo();
          } else {
            playerRef.current.pauseVideo();
          }
        }
      },
      { threshold: 0.5 },
    );

    const currentRef = videoContainerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isPlayerReady]);

  const handleAddToCart = () => {
    if (!isInCart(product._id, selectedColor)) {
      setIsLoading(true);
      setTimeout(() => {
        const productWithColor = {
          ...product,
          selectedColor: selectedColor || null,
        };
        addItem(productWithColor);
        setIsLoading(false);
      }, 500);
    }
  };

  const handleAddAndGoToCart = () => {
    if (!isInCart(product._id, selectedColor)) {
      setIsLoading(true);
      setTimeout(() => {
        const productWithColor = {
          ...product,
          selectedColor: selectedColor || null,
        };
        addItem(productWithColor);
        setIsLoading(false);
        router.push("/cart");
      }, 500);
    } else {
      router.push("/cart");
    }
  };

  // Share functions
  const handleShareWhatsApp = () => {
    const text = `${product.name}\n${product.description}\n${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
    setIsShareMenuOpen(false);
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    // Using Facebook share dialog - works without App ID
    const facebookUrl = `https://www.facebook.com/sharer.php?u=${url}`;
    const width = 600;
    const height = 400;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      facebookUrl,
      "facebook-share-dialog",
      `width=${width},height=${height},top=${top},left=${left}`,
    );
    setIsShareMenuOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié!", {
        position: "bottom-right",
        autoClose: 2000,
      });
      setIsShareMenuOpen(false);
    } catch (err) {
      toast.error("Erreur lors de la copie du lien", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  const renderRatingStars = (ratingRaw) => {
    const rating = Number.isFinite(Number(ratingRaw)) ? Number(ratingRaw) : 0;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < Math.floor(rating)
                ? "text-yellow-400 fill-yellow-400"
                : i < rating
                  ? "text-yellow-400 fill-yellow-400 opacity-50"
                  : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
        <span className="ml-2 text-secondary-600 dark:text-gray-400 text-sm">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <>
      <div className="relative z-10 grid md:grid-cols-2 gap-10 ">
        {/* Product Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4"
        >
          <div className="bg-white dark:bg-secondary-800 rounded-xl p-4 flex items-center justify-center overflow-hidden aspect-square">
            <img
              src={selectedImage || ""}
              alt={product.name}
              className="w-full h-full object-contain transition-all duration-300"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === image
                      ? "border-primary-500"
                      : "border-gray-200 dark:border-secondary-700 hover:border-primary-400"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Aperçu ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            {product.category &&
              Array.isArray(product.category) &&
              product.category.map((cat, index) => (
                <React.Fragment key={cat._id}>
                  <Link
                    href={`/products?categoryId=${cat._id}`}
                    className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase hover:underline"
                  >
                    {cat.name}
                  </Link>
                  {index < product.category.length - 1 && (
                    <span className="text-gray-400">/</span>
                  )}
                </React.Fragment>
              ))}
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
            {product.name}
          </h1>

          <div className="mb-4">
            {product.rating && renderRatingStars(product.rating)}
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              {product.promoPrice && Number(product.promoPrice) > 0 ? (
                <>
                  <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {formatPrice(product.promoPrice)} DT
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.price)} DT
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-secondary-900 dark:text-white">
                  {formatPrice(product.price)} DT
                </span>
              )}
            </div>
            <span
              className={`ml-4 text-sm font-medium ${
                {
                  "En stock": "text-green-600",
                  "Rupture de stock": "text-red-600",
                  "sur commande": "text-orange-500",
                }[product.stockState] || "text-green-600"
              }`}
            >
              {product.stockState || "En stock"}
            </span>
          </div>

          <p className="text-secondary-700 dark:text-gray-300 mb-8">
            {product.description}
          </p>

          {/* Color Selection */}
          {filteredColors && filteredColors.length > 0 && (
            <div className="mb-8">
              <span className="block text-sm font-medium text-secondary-900 dark:text-white mb-3">
                Couleur : <span className="capitalize">{selectedColor}</span>
              </span>
              <div className="flex gap-3">
                {filteredColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === color
                        ? "border-primary-500 ring-2 ring-primary-500/30"
                        : "border-gray-300 dark:border-gray-600"
                    } transition-all`}
                    style={{
                      backgroundColor: getColorHex(color),
                      boxShadow:
                        selectedColor === color
                          ? "0 0 0 2px rgba(59, 130, 246, 0.3)"
                          : "none",
                    }}
                    aria-label={`Sélectionner la couleur ${color}`}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Button
              size="lg"
              variant={isInCart(product._id) ? "outline" : "primary"}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2"
              onClick={handleAddToCart}
              disabled={isLoading || isInCart(product._id)}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : isInCart(product._id) ? (
                <Check size={20} />
              ) : (
                <ShoppingCart size={20} />
              )}
              {isInCart(product._id)
                ? "Dans le panier"
                : isLoading
                  ? "Ajout en cours..."
                  : "Ajouter au panier"}
            </Button>

            <Button
              size="lg"
              variant={isInCart(product._id) ? "outline" : "primary"}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2"
              onClick={handleAddAndGoToCart}
              disabled={isLoading || isInCart(product._id)}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : isInCart(product._id) ? (
                <Check size={20} />
              ) : (
                <ShoppingCart size={20} />
              )}
              Commander maintenant
            </Button>

            {/* Share Button with Dropdown */}
            <div className="relative" ref={shareMenuRef}>
              <Button
                size="lg"
                variant="outline"
                className="p-3 sm:p-2"
                aria-label="Partager le produit"
                onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
              >
                <Share2
                  size={20}
                  className="text-secondary-700 dark:text-gray-300"
                />
                <span className="sr-only sm:not-sr-only sm:ml-2">Partager</span>
              </Button>

              <AnimatePresence>
                {isShareMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 sm:left-0 mt-2 w-48 bg-white dark:bg-secondary-800 rounded-lg shadow-xl border border-gray-200 dark:border-secondary-700 overflow-hidden z-50"
                  >
                    <div className="py-1">
                      <WhatsappShareButton
                        url={shareUrl}
                        title={`${shareTitle}\n${shareDesc}`}
                        onClick={() => setIsShareMenuOpen(false)}
                        className="w-full"
                      >
                        <div className="flex items-center w-full px-4 py-3 text-sm text-secondary-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-700 transition-colors">
                          <MessageCircle
                            size={18}
                            className="mr-3 text-green-600"
                          />
                          <span className="font-medium">WhatsApp</span>
                        </div>
                      </WhatsappShareButton>

                      <FacebookShareButton
                        url={shareUrl}
                        hashtag="#SmapAutoPro"
                        onClick={() => setIsShareMenuOpen(false)}
                        className="w-full"
                      >
                        <div className="flex items-center w-full px-4 py-3 text-sm text-secondary-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-700 transition-colors">
                          <svg
                            className="w-[18px] h-[18px] mr-3 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          <span className="font-medium">Facebook</span>
                        </div>
                      </FacebookShareButton>

                      <button
                        onClick={handleCopyLink}
                        className="flex items-center w-full px-4 py-3 text-sm text-secondary-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-700 transition-colors border-t border-gray-200 dark:border-secondary-700"
                      >
                        <Copy
                          size={18}
                          className="mr-3 text-gray-600 dark:text-gray-400"
                        />
                        <span className="font-medium">Copier le lien</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Specifications */}
          <div className="border-t border-b border-gray-200 dark:border-secondary-700 py-6">
            <h3 className="font-medium text-lg text-secondary-900 dark:text-white mb-4">
              Détails du produit
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {product.brand && (
                <div>
                  <dt className="text-sm font-medium text-secondary-500 dark:text-gray-400">
                    Marque
                  </dt>
                  <dd className="text-secondary-900 dark:text-white">
                    {product.brand}
                  </dd>
                </div>
              )}
              {product.reference && (
                <div>
                  <dt className="text-sm font-medium text-secondary-500 dark:text-gray-400">
                    Référence
                  </dt>
                  <dd className="text-secondary-900 dark:text-white">
                    {product.reference[0]}
                  </dd>
                </div>
              )}
              {product.quality && (
                <div>
                  <dt className="text-sm font-medium text-secondary-500 dark:text-gray-400">
                    Qualité
                  </dt>
                  <dd className="text-secondary-900 dark:text-white capitalize">
                    {product.quality}
                  </dd>
                </div>
              )}

              {!hideFuel && product.fuelType && (
                <div>
                  <dt className="text-sm font-medium text-secondary-500 dark:text-gray-400 mb-1">
                    Type de carburant
                  </dt>
                  <dd className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600"
                      style={{
                        backgroundColor:
                          product.fuelType?.toLowerCase() === "dizel"
                            ? "#FF0000"
                            : product.fuelType?.toLowerCase() === "essence"
                              ? "#0000FF"
                              : product.fuelType?.toLowerCase() === "both"
                                ? "#000000"
                                : "#CCCCCC",
                      }}
                      title={product.fuelType}
                    />
                    <span className="font-medium text-secondary-900 dark:text-white capitalize">
                      {product.fuelType?.toLowerCase() === "both"
                        ? "Essence / Diesel"
                        : product.fuelType?.toLowerCase() === "dizel"
                          ? "Diesel"
                          : product.fuelType}
                    </span>
                  </dd>
                </div>
              )}

              {product.startYearModel && (
                <div>
                  <dt className="text-sm font-medium text-secondary-500 dark:text-gray-400">
                    Année Modèle
                  </dt>
                  <dd className="text-secondary-900 dark:text-white">
                    {product.startYearModel} - {product.endYearModel}
                  </dd>
                </div>
              )}
              {product.specifications &&
                Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-sm font-medium text-secondary-500 dark:text-gray-400">
                      {key}
                    </dt>
                    <dd className="text-secondary-900 dark:text-white">
                      {value}
                    </dd>
                  </div>
                ))}
            </dl>
          </div>

          {/* YouTube Video Embed */}
          {videoId ? (
            <div className="mt-8" ref={videoContainerRef}>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Vidéo du produit
              </h3>
              <div
                className="relative w-full rounded-lg shadow-lg overflow-hidden"
                style={{ paddingBottom: "56.25%" }}
              >
                <div
                  id={`youtube-player-${product._id}`}
                  className="absolute top-0 left-0 w-full h-full"
                ></div>
              </div>
            </div>
          ) : product.video_link ? (
            <div className="mt-8">
              <a
                href={product.video_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Voir la vidéo du produit
              </a>
            </div>
          ) : null}
        </motion.div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 dark:text-white mb-8 text-center">
            Produits similaires
          </h2>
          <HorizontalProductScroll promo={false} products={relatedProducts} />
        </div>
      )}
    </>
  );
};

// Helper function to convert color names to hex
const getColorHex = (colorName) => {
  const colorMap = {
    black: "#000000",
    white: "#FFFFFF",
    silver: "#C0C0C0",
    gray: "#808080",
    red: "#FF0000",
    blue: "#0000FF",
    green: "#008000",
    yellow: "#FFFF00",
    purple: "#800080",
    pink: "#FFC0CB",
    gold: "#FFD700",
    "space gray": "#8C8C8C",
    "midnight blue": "#191970",
    midnight: "#2c3e50",
    starlight: "#F9F6EF",
  };

  return colorMap[colorName.toLowerCase()] || "#CCCCCC";
};

export default ProductDetail;
