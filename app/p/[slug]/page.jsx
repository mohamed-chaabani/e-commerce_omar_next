import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  getProductBySlugFetch,
  getProductByIdFetch,
} from "@/services/productService";
import ProductDetail from "@/components/product/ProductDetail";
import ProductDetailSkeletonLoader from "@/components/ui/ProductDetailSkeletonLoader";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  let product = null;
  try {
    const isObjectId = /^[a-f\d]{24}$/i.test(slug);
    product = isObjectId
      ? await getProductByIdFetch(slug)
      : await getProductBySlugFetch(slug);
  } catch (e) {
    // Silent fail
  }

  const productName = product?.name || slug;
  const productRef = product?.reference || "";
  // Handle category as object or string
  const categoryName =
    typeof product?.category === "object"
      ? product?.category?.name || ""
      : product?.category || "";

  return {
    title: `${productName} ${productRef ? `(${productRef})` : ""} | Smap Auto Pro`,
    description: product?.name
      ? `Achetez ${product.name} ${productRef} au meilleur prix. ${product.description?.substring(0, 100) || ""} Livraison rapide en Tunisie.`
      : "Découvrez nos produits de qualité avec livraison rapide.",
    keywords: [productName, productRef, categoryName, "pièces auto", "Tunisie"]
      .filter(Boolean)
      .join(", "),
    openGraph: product?.images?.[0]
      ? {
          images: [{ url: product.images[0] }],
        }
      : undefined,
  };
}

async function ProductDetailData({ slug }) {
  let product = null;
  let error = null;

  try {
    const isObjectId = /^[a-f\d]{24}$/i.test(slug);
    product = isObjectId
      ? await getProductByIdFetch(slug)
      : await getProductBySlugFetch(slug);
  } catch (err) {
    error = "Le produit n'a pas pu être chargé.";
    console.error(err);
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
          Le produit que vous recherchez n&apos;existe pas ou a été supprimé.
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
    <div className="container mx-auto px-4 py-12 mt-12">
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
    </div>
  );
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;

  return (
    <Suspense fallback={<ProductDetailSkeletonLoader />}>
      <ProductDetailData slug={slug} />
    </Suspense>
  );
}
