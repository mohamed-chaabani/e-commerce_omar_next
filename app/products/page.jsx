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

  return {
    title: searchQuery
      ? `Résultats pour "${searchQuery}" | Smap Auto Pro`
      : "Produits | Smap Auto Pro",
    description: searchQuery
      ? `Résultats de recherche pour "${searchQuery}". Découvrez nos pièces détachées automobiles.`
      : "Découvrez notre catalogue de pièces détachées automobiles. Livraison rapide et prix compétitifs.",
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
