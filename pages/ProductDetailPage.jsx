import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import {
  getProductById,
  getProductBySlug,
} from "../services/productService.js";
import ProductDetail from "../components/product/ProductDetail.jsx";
import ProductGrid from "../components/ui/ProductGrid.jsx";
import ProductDetailSkeletonLoader from "../components/ui/ProductDetailSkeletonLoader.jsx";
import { Helmet } from "react-helmet-async";
import { useInitialData } from "../context/InitialDataContext.jsx";

const ProductDetailPage = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const { initialProduct } = useInitialData();
  const [product, setProduct] = useState(initialProduct || null);
  const [relatedProducts, setRelatedProducts] = useState([]); // We will handle this later
  const [loading, setLoading] = useState(!initialProduct);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      // If we have SSR-provided product matching the route, use it and skip fetch
      if (
        initialProduct &&
        ((id && initialProduct._id === id) ||
          (slug && initialProduct.slug === slug))
      ) {
        setProduct(initialProduct);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let data = null;
        if (slug) {
          data = await getProductBySlug(slug);
        } else if (id) {
          data = await getProductById(id);
        }
        setProduct(data);
        // If we came via /products/:id and product has a slug, redirect to canonical /p/:slug
        if (!slug && id && data && data.slug) {
          navigate(`/p/${encodeURIComponent(data.slug)}`, { replace: true });
          return;
        }
      } catch (err) {
        console.error("Échec de la récupération du produit:", err);
        setError("Le produit n'a pas pu être chargé.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, slug, initialProduct, navigate]);

  if (loading) {
    return <ProductDetailSkeletonLoader />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center min-h-[60vh]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
          Produit non trouvé
        </h1>
        <p className="text-secondary-700 dark:text-gray-300 mb-8">
          Le produit que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
        >
          <ArrowLeft size={16} className="mr-2" />
          Retour aux produits
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 mt-12 ">
      {product && (
        <Helmet>
          <title>
            {product.name ? `${product.name} | Smap Auto Pro` : "Smap Auto Pro"}
          </title>
          {product.description && (
            <meta
              name="description"
              content={String(product.description).slice(0, 200)}
            />
          )}
          {Array.isArray(product.reference) && product.reference.length > 0 && (
            <meta
              name="product:reference"
              content={product.reference.filter(Boolean).join(", ")}
            />
          )}
          {typeof product.referenceAdaptable === "string" &&
            product.referenceAdaptable.trim() !== "" && (
              <meta
                name="product:referenceAdaptable"
                content={product.referenceAdaptable}
              />
            )}
          {/* Canonical URL prefers slug route */}
          <link
            rel="canonical"
            href={`${
              typeof window !== "undefined" ? window.location.origin : ""
            }${
              product?.slug
                ? `/p/${encodeURIComponent(product.slug)}`
                : `/products/${product?._id || ""}`
            }`}
            data-rh="true"
          />
          {/* Basic OG/Twitter fallbacks on client, SSR already sets canonical tags */}
          {product.name && <meta property="og:title" content={product.name} />}
          {product.description && (
            <meta
              property="og:description"
              content={String(product.description).slice(0, 200)}
            />
          )}
          {Array.isArray(product.images) && product.images[0] && (
            <meta property="og:image" content={product.images[0]} />
          )}
          {/* JSON-LD: Product and Breadcrumbs with category slugs when available */}
          {(() => {
            const origin =
              typeof window !== "undefined" ? window.location.origin : "";
            const url = product?.slug
              ? `${origin}/p/${encodeURIComponent(product.slug)}`
              : `${origin}/products/${product?._id || ""}`;
            const price =
              Number(product?.promoPrice) > 0
                ? Number(product.promoPrice)
                : Number(product?.price) || 0;
            const availability = (product?.stockState || "in_stock")
              .toLowerCase()
              .includes("rupture")
              ? "https://schema.org/OutOfStock"
              : "https://schema.org/InStock";
            const productLd = {
              "@context": "https://schema.org",
              "@type": "Product",
              name: product?.name || "",
              image: Array.isArray(product?.images) ? product.images : [],
              description: product?.description || "",
              sku: Array.isArray(product?.reference)
                ? product.reference[0]
                : product?.reference || "",
              brand: product?.brand
                ? { "@type": "Brand", name: product.brand }
                : undefined,
              aggregateRating: Number.isFinite(Number(product?.rating))
                ? {
                    "@type": "AggregateRating",
                    ratingValue: Number(product.rating),
                    reviewCount: 1,
                  }
                : undefined,
              offers: {
                "@type": "Offer",
                priceCurrency: "TND",
                price: price.toFixed(3),
                availability,
                url,
              },
              url,
            };
            // Build breadcrumb chain with category (if any) and category level 4 (if available)
            const items = [];
            items.push({
              "@type": "ListItem",
              position: 1,
              name: "Accueil",
              item: `${origin}/`,
            });
            items.push({
              "@type": "ListItem",
              position: 2,
              name: "Produits",
              item: `${origin}/products`,
            });

            // Main category (first) if has slug
            const mainCategory = Array.isArray(product?.category)
              ? product.category.find(
                  (c) => typeof c?.slug === "string" && c.slug,
                )
              : null;
            if (mainCategory?.slug) {
              items.push({
                "@type": "ListItem",
                position: items.length + 1,
                name: mainCategory.name || "Catégorie",
                item: `${origin}/category/${encodeURIComponent(mainCategory.slug)}`,
              });
            }

            // Category level 4 if has slug
            if (product?.categoryLvl4?.slug) {
              items.push({
                "@type": "ListItem",
                position: items.length + 1,
                name: product.categoryLvl4.name || "Catégorie Lvl4",
                item: `${origin}/categories-lvl4/${encodeURIComponent(product.categoryLvl4.slug)}`,
              });
            }

            // Product page
            items.push({
              "@type": "ListItem",
              position: items.length + 1,
              name: product?.name || "Produit",
              item: url,
            });

            const breadcrumbsLd = {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: items,
            };
            return (
              <script type="application/ld+json">
                {JSON.stringify([productLd, breadcrumbsLd])}
              </script>
            );
          })()}
        </Helmet>
      )}
      <div className="mb-8">
        <Link
          to="/products"
          className="inline-flex items-center text-secondary-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Retour aux produits
        </Link>
      </div>

      <ProductDetail product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
              Vous pouvez aussi aimer
            </h2>
            <p className="text-secondary-600 dark:text-gray-400">
              Découvrez plus de produits dans la collection {product.category}
            </p>
          </div>

          <ProductGrid products={relatedProducts} />
        </motion.section>
      )}
    </div>
  );
};

export default ProductDetailPage;
