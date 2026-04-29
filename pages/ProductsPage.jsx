"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
// import { Helmet } from "react-helmet-async";
import { useSearch } from "../context/SearchContext";
import { useParams, useSearchParams } from "next/navigation";
import { X, Filter } from "lucide-react";
import {
  getAllProducts,
  getProductDetails,
  searchProducts,
  getProductsBycategoriesLvl2,
  getProductsPaginated,
} from "../services/productService";
import { getCategoryBySlug } from "../services/productService";
import { categoryLvl4Service } from "../services/categoryLvl4Service";
import ProductGrid from "../components/ui/ProductGrid.jsx";
import GridSkeletonLoader from "../components/ui/GridSkeletonLoader.jsx";

const ProductsPage = () => {
  const searchParamsHook = useSearchParams();
  const searchParams = searchParamsHook || new URLSearchParams();
  const setSearchParams = () => {}; // No-op for SSR
  const { searchQuery, searchCategoryLvl4Id } = useSearch();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortOption, setSortOption] = useState("featured");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const params = useParams();
  const slug = params?.slug;
  const [resolvedCategoryId, setResolvedCategoryId] = useState(null);

  // If on /category/:slug, resolve slug -> categoryId but keep URL clean
  useEffect(() => {
    const syncSlugCategory = async () => {
      if (!slug) {
        setResolvedCategoryId(null);
        return;
      }
      try {
        const category = await getCategoryBySlug(slug);
        if (category && category._id) {
          setResolvedCategoryId(String(category._id));
        } else {
          setResolvedCategoryId(null);
        }
      } catch (e) {
        // No-op for not found; keep null
        setResolvedCategoryId(null);
      }
    };
    syncSlugCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  // Scroll to top when page changes (pagination)
  useEffect(() => {
    if (isClient) {
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (_) {
        window.scrollTo(0, 0);
      }
    }
  }, [page, isClient]);

  const setPageInUrl = (nextPage) => {
    const next = Math.max(1, Number(nextPage) || 1);
    const nextParams = new URLSearchParams(searchParams);

    if (next === 1) nextParams.delete("page");
    else nextParams.set("page", String(next));

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams);
    }
  };

  const getPaginationItems = (current, totalPages) => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const items = [];
    const left = Math.max(2, current - 1);
    const right = Math.min(totalPages - 1, current + 1);

    items.push(1);
    if (left > 2) items.push("...");
    for (let i = left; i <= right; i += 1) items.push(i);
    if (right < totalPages - 1) items.push("...");
    items.push(totalPages);
    return items;
  };

  const categoriesLvl2 = searchParams.get("categoriesLvl2");
  const categoryLvl4Id = searchParams.get("categoryLvl4Id");
  const categoryLvl4Slug = searchParams.get("categoryLvl4Slug");

  const [resolvedLvl4Id, setResolvedLvl4Id] = useState(null);

  useEffect(() => {
    const syncLvl4Slug = async () => {
      if (!categoryLvl4Slug) {
        setResolvedLvl4Id(null);
        return;
      }
      try {
        const cat =
          await categoryLvl4Service.getCategoryLvl4BySlug(categoryLvl4Slug);
        setResolvedLvl4Id(cat && cat._id ? String(cat._id) : null);
      } catch (e) {
        setResolvedLvl4Id(null);
      }
    };
    syncLvl4Slug();
  }, [categoryLvl4Slug]);

  const effectiveCategoryLvl4Id =
    categoryLvl4Id || resolvedLvl4Id || searchCategoryLvl4Id;

  const filterKey = useMemo(() => {
    const paramsWithoutPage = new URLSearchParams(searchParams);
    paramsWithoutPage.delete("page");
    return paramsWithoutPage.toString();
  }, [searchParams]);

  const resetKey = useMemo(() => {
    return `${filterKey}__${searchQuery || ""}__${effectiveCategoryLvl4Id || ""}`;
  }, [filterKey, searchQuery, effectiveCategoryLvl4Id]);

  const prevResetKeyRef = useRef(null);

  useEffect(() => {
    if (prevResetKeyRef.current === null) {
      prevResetKeyRef.current = resetKey;
      return;
    }

    if (prevResetKeyRef.current !== resetKey) {
      prevResetKeyRef.current = resetKey;
      setPageInUrl(1);
    }
  }, [resetKey]);

  useEffect(() => {
    const fetchData = async () => {
      const hasSearch = Boolean(
        searchQuery ||
        categoriesLvl2 ||
        searchParams.get("productName") ||
        searchParams.get("categoryId") ||
        resolvedCategoryId,
      );
      // Prefer SSR data injected on the page to avoid duplicate fetch and mismatch
      if (typeof window !== "undefined" && window.__SSR_PRODUCTS__) {
        const ssr = window.__SSR_PRODUCTS__;
        if (
          ssr &&
          !hasSearch &&
          page === (ssr.page || 1) &&
          (effectiveCategoryLvl4Id || "") === (ssr.categoryLvl4Id || "")
        ) {
          const list = Array.isArray(ssr?.data?.products)
            ? ssr.data.products
            : [];
          setProducts(list);
          setFilteredProducts(list);
          setPages(Number(ssr?.data?.pages) || 1);
          setTotal(Number(ssr?.data?.total) || 0);
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(true);
      try {
        let data;

        if (searchQuery) {
          data = await searchProducts(searchQuery, effectiveCategoryLvl4Id);
        } else if (categoriesLvl2) {
          data = await getProductsBycategoriesLvl2(
            categoriesLvl2,
            effectiveCategoryLvl4Id,
          );
        } else {
          const categoryId =
            resolvedCategoryId || searchParams.get("categoryId");
          const productName = searchParams.get("productName");
          if (categoryId || productName) {
            data = await getProductDetails(categoryId, productName);
          } else {
            data = await getProductsPaginated({
              page,
              limit,
              categoryLvl4Id: effectiveCategoryLvl4Id,
            });
          }
        }

        const productsArray = Array.isArray(data) ? data : data?.products || [];

        setProducts(productsArray);
        setFilteredProducts(productsArray);

        if (!Array.isArray(data) && data) {
          setPages(Number(data.pages) > 0 ? Number(data.pages) : 1);
          setTotal(Number(data.total) >= 0 ? Number(data.total) : 0);
        } else {
          setPages(1);
          setTotal(productsArray.length);
        }
      } catch (error) {
        console.error("Échec de la récupération des données:", error);
        setProducts([]);
        setFilteredProducts([]);
        setPages(1);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    searchParams,
    searchQuery,
    effectiveCategoryLvl4Id,
    page,
    resolvedCategoryId,
  ]);

  const handleCategoryFilter = (categoryId) => {
    setActiveCategory(categoryId);

    if (categoryId === null) {
      setFilteredProducts(products);
    } else {
      const newFilteredProducts = products.filter(
        (product) => product.categorieLvl2 === categoryId,
      );
      setFilteredProducts(newFilteredProducts);
    }
  };

  const handlePriceRangeChange = (e, index) => {
    const value = parseInt(e.target.value);
    const newRange = [...priceRange];
    newRange[index] = value;
    setPriceRange(newRange);
  };

  const handleSort = (e) => {
    setSortOption(e.target.value);
  };

  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen(!isMobileFiltersOpen);
  };

  if (!isClient) {
    // Minimal container to keep SSR and first client paint identical
    return <div className="container mx-auto px-4 py-12 mt-12 "></div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 mt-12 ">
      {/* <Helmet>
        <title>Produits | Smap Auto Pro</title>
      </Helmet> */}
      {/* <div className="flex justify-between items-center mb-8">
        <button
          className="md:hidden flex items-center text-secondary-700 dark:text-gray-300"
          onClick={toggleMobileFilters}
        >
          <Filter size={20} className="mr-2" />
          Filtres
        </button>
      </div> */}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters - Mobile */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
            <div
              className="bg-white dark:bg-secondary-900 h-full w-3/4 max-w-sm overflow-auto p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-xl text-secondary-900 dark:text-white">
                  Filtres
                </h2>
                <button onClick={toggleMobileFilters}>
                  <X className="w-5 h-5 text-secondary-900 dark:text-white" />
                </button>
              </div>

              {/* Mobile filter content - same as desktop but in a slide-over */}
              <div className="mb-6">
                <h3 className="font-medium text-lg text-secondary-900 dark:text-white mb-4">
                  Catégories
                </h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => handleCategoryFilter(null)}
                      className={`text-left w-full ${
                        activeCategory === null
                          ? "text-primary-600 dark:text-primary-400 font-medium"
                          : "text-secondary-700 dark:text-gray-300"
                      }`}
                    >
                      Tous les produits
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category._id}>
                      <button
                        onClick={() => handleCategoryFilter(category._id)}
                        className={`text-left w-full ${
                          activeCategory === category._id
                            ? "text-primary-600 dark:text-primary-400 font-medium"
                            : "text-secondary-700 dark:text-gray-300"
                        }`}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-lg text-secondary-900 dark:text-white mb-4">
                  Fourchette de prix
                </h3>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-secondary-700 dark:text-gray-300">
                    {priceRange[0]} DT
                  </span>
                  <span className="text-secondary-700 dark:text-gray-300">
                    {priceRange[1]} DT
                  </span>
                </div>
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="100"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(e, 0)}
                    className="w-full accent-primary-500 cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(e, 1)}
                    className="w-full accent-primary-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {/* <div className="flex justify-end mb-6">
            <select
              value={sortOption}
              onChange={handleSort}
              className="rounded-md border border-gray-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="featured">En vedette</option>
              <option value="price-low-high">Prix : Croissant</option>
              <option value="price-high-low">Prix : Décroissant</option>
              <option value="name-a-z">Nom : A à Z</option>
              <option value="name-z-a">Nom : Z à A</option>
            </select>
          </div> */}

          {isLoading ? (
            <GridSkeletonLoader />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-white mb-2">
                Aucun produit trouvé
              </h2>
            </div>
          ) : (
            <ProductGrid
              promo={true}
              nouveau={true}
              products={filteredProducts}
            />
          )}

          {!isLoading && pages > 1 && (
            <div className="mt-10 flex flex-col items-center justify-center gap-3 relative">
              <div className="inline-flex overflow-hidden rounded-md border border-gray-300 dark:border-secondary-700">
                <button
                  type="button"
                  aria-label="Previous page"
                  onClick={() => setPageInUrl(page - 1)}
                  disabled={page <= 1}
                  className="w-10 h-10 flex items-center justify-center bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  ‹
                </button>

                {getPaginationItems(page, pages).map((item, idx) =>
                  item === "..." ? (
                    <div
                      key={`ellipsis-${idx}`}
                      className="w-10 h-10 flex items-center justify-center bg-white dark:bg-secondary-800 text-secondary-700 dark:text-gray-300"
                    >
                      ...
                    </div>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      aria-current={Number(item) === page ? "page" : undefined}
                      aria-label={`Page ${item}`}
                      onClick={() => setPageInUrl(item)}
                      disabled={Number(item) === page}
                      className={`w-10 h-10 flex items-center justify-center border-l border-gray-300 dark:border-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:pointer-events-none ${
                        Number(item) === page
                          ? "bg-customRed text-white dark:bg-customRed dark:text-white font-semibold"
                          : "bg-white dark:bg-secondary-800 hover:bg-gray-50 dark:hover:bg-secondary-700"
                      }`}
                    >
                      {item}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  aria-label="Next page"
                  onClick={() => setPageInUrl(page + 1)}
                  disabled={page >= pages}
                  className="w-10 h-10 flex items-center justify-center border-l border-gray-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  ›
                </button>
              </div>

              <div className="text-xs text-secondary-700 dark:text-gray-300">
                {total} produits
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
