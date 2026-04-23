"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { X, Filter } from "lucide-react";
import GridSkeletonLoader from "@/components/ui/GridSkeletonLoader";
import ProductGrid from "@/components/ui/ProductGrid";
import { useSearch } from "@/context/SearchContext";

const ProductsClient = ({
  initialProducts,
  initialPages,
  initialTotal,
  categoriesLvl2,
  categoryId,
  productName,
  searchQuery,
  effectiveCategoryLvl4Id,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { searchCategoryLvl4Id } = useSearch();

  const [products, setProducts] = useState(initialProducts || []);
  const [filteredProducts, setFilteredProducts] = useState(
    initialProducts || [],
  );
  const [activeCategory, setActiveCategory] = useState(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [pages, setPages] = useState(initialPages || 1);
  const [total, setTotal] = useState(initialTotal || 0);

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = 20;

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "Produits | Smap Auto Pro";
    }
  }, []);

  // Sync products when initialProducts changes (e.g., after search)
  useEffect(() => {
    setProducts(initialProducts || []);
    setFilteredProducts(initialProducts || []);
    setPages(initialPages || 1);
    setTotal(initialTotal || 0);
  }, [initialProducts, initialPages, initialTotal]);

  const setPageInUrl = (nextPage) => {
    const next = Math.max(1, Number(nextPage) || 1);
    const nextParams = new URLSearchParams(searchParams);

    if (next === 1) nextParams.delete("page");
    else nextParams.set("page", String(next));

    if (nextParams.toString() !== searchParams.toString()) {
      const queryString = nextParams.toString();
      router.push(queryString ? `?${queryString}` : "/products");
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

  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen(!isMobileFiltersOpen);
  };

  // Get the "from" parameter to know where to return when clearing search
  const fromPath = searchParams.get("from");

  const handleClearSearch = () => {
    if (fromPath && fromPath !== "/products") {
      // Go back to where user came from (e.g., home)
      router.push(fromPath);
    } else {
      // Just clear the search query but stay on products
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("q");
      nextParams.delete("from");
      router.push(
        `/products${nextParams.toString() ? `?${nextParams.toString()}` : ""}`,
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 mt-12 ">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters - Mobile */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
            <div className="bg-white dark:bg-secondary-900 h-full w-3/4 max-w-sm overflow-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-xl text-secondary-900 dark:text-white">
                  Filtres
                </h2>
                <button onClick={toggleMobileFilters}>
                  <X className="w-5 h-5 text-secondary-900 dark:text-white" />
                </button>
              </div>

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
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
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

          {pages > 1 && (
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

export default ProductsClient;
