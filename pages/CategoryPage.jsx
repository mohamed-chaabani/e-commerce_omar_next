import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ProductGrid from "../components/ui/ProductGrid.jsx";
import { getProductsBycategoriesLvl2 } from "../services/productService.js";
import GridSkeletonLoader from "../components/ui/GridSkeletonLoader.jsx";
import { Helmet } from "react-helmet-async";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const ssrCat = useMemo(() => {
    if (typeof window !== "undefined" && window.__SSR_CATEGORY__) {
      return window.__SSR_CATEGORY__;
    }
    return null;
  }, []);
  const [products, setProducts] = useState(
    Array.isArray(ssrCat?.products) ? ssrCat.products : [],
  );
  const [loading, setLoading] = useState(!ssrCat);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryName) {
        setLoading(false);
        return;
      }
      if (ssrCat && ssrCat.categoryName === decodeURIComponent(categoryName)) {
        setLoading(false);
        return; // already have SSR data
      }
      try {
        setLoading(true);
        const decodedName = decodeURIComponent(categoryName);
        const data = await getProductsBycategoriesLvl2(decodedName);
        setProducts(data || []);
        setError(null);
      } catch (err) {
        setError("Échec du chargement des produits.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  // if (loading) {
  //   return (
  // <div className="container mx-auto px-4 py-16 text-center">Loading...</div>

  //   );
  // }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <GridSkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!products.length && !loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
          Catégorie non trouvée
        </h1>
        <p className="text-secondary-700 dark:text-gray-300 mb-8">
          La catégorie que vous recherchez n'existe pas ou a été supprimée.
        </p>
        <Link
          to="/categories"
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
        >
          <ArrowLeft size={16} className="mr-2" />
          Retour aux catégories
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 mt-12 ">
      <Helmet>
        <title>
          {categoryName
            ? `${decodeURIComponent(categoryName).replace(/-/g, " ")} | Smap Auto Pro`
            : "Catégorie | Smap Auto Pro"}
        </title>
        {ssrCat?.canonical && <link rel="canonical" href={ssrCat.canonical} />}
      </Helmet>
      <div className="mb-8">
        <Link
          to="/categories"
          className="inline-flex items-center text-secondary-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Retour aux catégories
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-secondary-600 dark:text-gray-400 text-lg mb-6">
            Aucun produit trouvé dans cette catégorie
          </p>
          <Link
            to="/products"
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
          >
            Voir tous les produits
          </Link>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-8 capitalize">
            {categoryName
              ? decodeURIComponent(categoryName).replace(/-/g, " ")
              : ""}
          </h2>
          <ProductGrid products={products} />
        </>
      )}
    </div>
  );
};

export default CategoryPage;
