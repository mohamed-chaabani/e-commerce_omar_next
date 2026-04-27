"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import {
  getProductById,
  getProductBySlug,
} from "../services/productService.js";
import ProductDetail from "../components/product/ProductDetail.jsx";
import ProductGrid from "../components/ui/ProductGrid.jsx";
import ProductDetailSkeletonLoader from "../components/ui/ProductDetailSkeletonLoader.jsx";
import { useInitialData } from "../context/InitialDataContext.jsx";

const ProductDetailPage = () => {
  const params = useParams();
  const id = params?.id;
  const slug = params?.slug;
  const router = useRouter();
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
          router.replace(`/p/${encodeURIComponent(data.slug)}`);
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
  }, [id, slug, initialProduct, router]);

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
          href="/products"
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
      <div className="mb-8">
        <Link
          href="/products"
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
