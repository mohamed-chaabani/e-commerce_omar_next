import { Suspense } from "react";
import {
  getProductsPaginatedFetch,
  getCategoryBySlugFetch,
  searchProductsFetch,
  getProductsBycategoriesLvl2Fetch,
  getProductDetailsFetch,
  getProductsByCategoryIdFetch,
} from "@/services/productService";
import { getCategoryLvl4BySlugFetch } from "@/services/categoryLvl4Service";
import ProductsClient from "@/app/products/ProductsClient";
import GridSkeletonLoader from "@/components/ui/GridSkeletonLoader";

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const queryParams = await searchParams;
  const productName = queryParams?.productName;

  // Get category info
  let category = null;
  try {
    category = await getCategoryBySlugFetch(slug);
  } catch (e) {
    // Silent fail
  }

  const categoryName = category?.name || slug;

  // Fetch products for this category
  let productsArray = [];
  try {
    if (category && category._id) {
      if (productName) {
        const data = await getProductDetailsFetch(
          String(category._id),
          productName,
        );
        productsArray = Array.isArray(data) ? data : data?.products || [];
      } else {
        // Try by ID first (new endpoint)
        try {
          const data = await getProductsByCategoryIdFetch(category._id);
          productsArray = Array.isArray(data) ? data : data?.products || [];
        } catch (e) {
          // Fallback to name-based fetch
          const data = await getProductsBycategoriesLvl2Fetch(category.name);
          productsArray = Array.isArray(data) ? data : data?.products || [];
        }
      }
    }
  } catch (e) {
    // Silent fail
  }

  // Extract product names and refs
  const productNames = productsArray
    .slice(0, 4)
    .map((p) => p.name)
    .filter(Boolean);
  const productRefs = productsArray
    .slice(0, 4)
    .map((p) => p.reference)
    .filter(Boolean);

  const title = productName
    ? `${productName} - ${categoryName} | Smap Auto Pro`
    : `${categoryName} - Pièces auto | Smap Auto Pro`;

  const description =
    productNames.length > 0
      ? `Découvrez ${productNames.join(", ")} pour ${categoryName}. Références: ${productRefs.join(", ") || "OEM"}. Prix compétitifs Tunisie.`
      : `Découvrez toutes les pièces détachées pour ${categoryName}. Prix compétitifs et livraison rapide en Tunisie.`;

  const keywords = [
    categoryName,
    ...productNames.slice(0, 4),
    ...productRefs.slice(0, 4),
    "pièces auto",
    "pièces détachées",
    "Tunisie",
    ...(productName ? [productName] : []),
  ]
    .filter(Boolean)
    .join(", ");

  return {
    title,
    description,
    keywords,
  };
}

async function CategoryProductsData({ slug, searchParams }) {
  const queryParams = await searchParams;
  const productName = queryParams?.productName;
  const page = Math.max(1, Number(queryParams?.page) || 1);

  // Get category
  let category = null;
  try {
    category = await getCategoryBySlugFetch(slug);
  } catch (e) {
    console.error("Error fetching category:", e);
  }

  // Fetch products
  let data = { products: [], pages: 1, total: 0 };
  try {
    if (category && category._id) {
      if (productName) {
        data = await getProductDetailsFetch(String(category._id), productName);
      } else {
        // Try by ID first
        try {
          data = await getProductsByCategoryIdFetch(category._id);
        } catch (e) {
          data = await getProductsBycategoriesLvl2Fetch(category.name);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching category products:", error);
    data = { products: [], pages: 1, total: 0 };
  }

  const productsArray = Array.isArray(data) ? data : data?.products || [];
  const pages = !Array.isArray(data) && data ? Number(data.pages) || 1 : 1;
  const total =
    !Array.isArray(data) && data
      ? Number(data.total) || 0
      : productsArray.length;

  return (
    <ProductsClient
      initialProducts={productsArray}
      initialPages={pages}
      initialTotal={total}
      categoriesLvl2={null}
      categoryId={category?._id || null}
      productName={productName}
      searchQuery={null}
      effectiveCategoryLvl4Id={null}
      categoryName={category?.name || slug}
    />
  );
}

export default async function CategoryProductsPage({ params, searchParams }) {
  const { slug } = await params;

  return (
    <Suspense fallback={<GridSkeletonLoader />}>
      <CategoryProductsData slug={slug} searchParams={searchParams} />
    </Suspense>
  );
}
