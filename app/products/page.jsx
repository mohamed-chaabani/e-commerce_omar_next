import { Suspense } from "react";
import {
  getProductsPaginatedFetch,
  getCategoryBySlugFetch,
  searchProductsFetch,
  getProductsBycategoriesLvl2Fetch,
  getProductDetailsFetch,
} from "@/services/productService";
import { getCategoryLvl4BySlugFetch } from "@/services/categoryLvl4Service";
import ProductsClient from "./ProductsClient";
import GridSkeletonLoader from "@/components/ui/GridSkeletonLoader";

export async function generateMetadata({ searchParams }) {
  // Next.js 15+: searchParams is a Promise
  const params = await searchParams;
  const searchQuery = params?.q;
  const categoryId = params?.categoryId;
  const productName = params?.productName;
  const categoriesLvl2 = params?.categoriesLvl2;
  const categoryLvl4Id = params?.categoryLvl4Id;
  const page = Math.max(1, Number(params?.page) || 1);
  const limit = 20; // Same as ProductsData

  // Fetch products for metadata - SAME LOGIC AS ProductsData
  let productsArray = [];
  try {
    if (searchQuery) {
      const data = await searchProductsFetch(searchQuery, categoryLvl4Id);
      productsArray = Array.isArray(data) ? data : data?.products || [];
    } else if (categoriesLvl2) {
      const data = await getProductsBycategoriesLvl2Fetch(
        categoriesLvl2,
        categoryLvl4Id,
      );
      productsArray = Array.isArray(data) ? data : data?.products || [];
    } else if (categoryId || productName) {
      const data = await getProductDetailsFetch(categoryId, productName);
      productsArray = Array.isArray(data) ? data : data?.products || [];
    } else {
      const data = await getProductsPaginatedFetch({
        page,
        limit,
        categoryLvl4Id,
      });
      productsArray = Array.isArray(data) ? data : data?.products || [];
    }
  } catch (e) {
    // Silently fail - metadata is not critical
  }

  // Extract references and names from CURRENT page products
  const productNames = productsArray
    .slice(0, 4) // First 4 products shown on page
    .map((p) => p.name)
    .filter(Boolean);
  const productRefs = productsArray
    .slice(0, 4)
    .map((p) => p.reference)
    .filter(Boolean);

  // Dynamic title based on search/filters
  let title = "Produits";
  if (searchQuery) {
    title = `${searchQuery}`;
  } else if (productName) {
    title = `${productName}`;
  } else if (categoriesLvl2) {
    title = `Catégorie ${categoriesLvl2}`;
  }
  if (page > 1) {
    title += ` - Page ${page}`;
  }
  title += " | Smap Auto Pro";

  // Description with actual products from this page
  const description =
    productNames.length > 0
      ? `Découvrez ${productNames.join(", ")}. Références: ${productRefs.join(", ") || "OEM"}. ${page > 1 ? `Page ${page}. ` : ""}Prix compétitifs Tunisie.`
      : "Découvrez notre catalogue de pièces détachées automobiles. Livraison rapide et prix compétitifs.";

  // Keywords for SEO
  const keywords = [
    ...productNames.slice(0, 4),
    ...productRefs.slice(0, 4),
    "pièces auto",
    "pièces détachées",
    "Tunisie",
    ...(searchQuery ? [searchQuery] : []),
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

async function ProductsData({ searchParams }) {
  // Next.js 15+: searchParams is a Promise, must await it
  const params = await searchParams;

  const page = Math.max(1, Number(params?.page) || 1);
  const limit = 20;
  const categoriesLvl2 = params?.categoriesLvl2;
  const categoryId = params?.categoryId;
  const productName = params?.productName;
  const searchQuery = params?.q;
  const categoryLvl4Id = params?.categoryLvl4Id;
  const categoryLvl4Slug = params?.categoryLvl4Slug;
  const slug = params?.slug;

  let effectiveCategoryLvl4Id = categoryLvl4Id;

  // Resolve categoryLvl4Slug if present
  if (categoryLvl4Slug) {
    try {
      const cat = await getCategoryLvl4BySlugFetch(categoryLvl4Slug);
      if (cat && cat._id) {
        effectiveCategoryLvl4Id = String(cat._id);
      }
    } catch (e) {
      // Keep null
    }
  }

  let resolvedCategoryId = null;
  if (slug) {
    try {
      const category = await getCategoryBySlugFetch(slug);
      if (category && category._id) {
        resolvedCategoryId = String(category._id);
      }
    } catch (e) {
      // Keep null
    }
  }

  let data;
  try {
    if (searchQuery) {
      data = await searchProductsFetch(searchQuery, effectiveCategoryLvl4Id);
    } else if (categoriesLvl2) {
      data = await getProductsBycategoriesLvl2Fetch(
        categoriesLvl2,
        effectiveCategoryLvl4Id,
      );
    } else if (categoryId || productName) {
      data = await getProductDetailsFetch(categoryId, productName);
    } else {
      data = await getProductsPaginatedFetch({
        page,
        limit,
        categoryLvl4Id: effectiveCategoryLvl4Id,
      });
    }
  } catch (error) {
    console.error("Error fetching products:", error);
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
      categoriesLvl2={categoriesLvl2}
      categoryId={resolvedCategoryId || categoryId}
      productName={productName}
      searchQuery={searchQuery}
      effectiveCategoryLvl4Id={effectiveCategoryLvl4Id}
    />
  );
}

export default async function ProductsPage({ searchParams }) {
  return (
    <Suspense fallback={<GridSkeletonLoader />}>
      <ProductsData searchParams={searchParams} />
    </Suspense>
  );
}
