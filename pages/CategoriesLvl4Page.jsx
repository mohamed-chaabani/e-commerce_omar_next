"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
// import { Helmet } from "react-helmet-async";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import GridSkeletonLoader from "../components/ui/GridSkeletonLoader.jsx";
import { categoryLvl4Service } from "../services/categoryLvl4Service.js";

const CategoriesLvl4Page = ({ home }) => {
  const params = useParams();
  const id = params?.id || params?.slug;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryLvl4, setCategoryLvl4] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (id) {
          const isObjectId = /^[a-f\d]{24}$/i.test(id);
          const lvl4Data = isObjectId
            ? await categoryLvl4Service.getCategoryLvl4ById(id)
            : await categoryLvl4Service.getCategoryLvl4BySlug(id);
          setCategoryLvl4(lvl4Data);
          setCategories(lvl4Data?.categories_list || []);
        } else {
          setCategories([]);
        }
        setError(null);
      } catch (err) {
        setError("Échec du chargement des catégories.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const isObjectId = /^[a-f\d]{24}$/i.test(id || "");
  const parentCategoryLvl4Id = isObjectId ? id : categoryLvl4?._id || "";

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-500">
        <h1 className="text-3xl">{error}</h1>
      </div>
    );
  }

  return (
    <div
      className={`container mx-auto px-4 mt-12 ${home ? "md:py-12" : "py-12"}`}
    >
      {/* <Helmet>
        <title>
          {categoryLvl4
            ? `${categoryLvl4.name} | Smap Auto Pro`
            : "Acheter par catégorie | Smap Auto Pro"}
        </title>
        <meta
          name="description"
          content={
            categoryLvl4
              ? `Découvrez tous nos produits dans la catégorie ${categoryLvl4.name}.`
              : "Parcourez notre collection complète de produits organisés par catégories."
          }
        />
        {
          <link
            rel="canonical"
            href={`${typeof window !== "undefined" ? window.location.origin : ""}/categories-lvl4/${encodeURIComponent(id)}`}
          />
        }
      </Helmet> */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
          {categoryLvl4 ? categoryLvl4.name : "Acheter par catégorie"}
        </h1>
        <p className="text-secondary-600 dark:text-gray-400 max-w-2xl mx-auto">
          {categoryLvl4
            ? `Découvrez tous nos produits dans la catégorie ${categoryLvl4.name}`
            : "Parcourez notre collection complète de produits organisés par catégories"}
        </p>
      </div>

      {loading ? (
        <GridSkeletonLoader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link
                href={`/products?categoriesLvl2=${encodeURIComponent(category.name)}${
                  categoryLvl4?.slug
                    ? `&categoryLvl4Slug=${encodeURIComponent(categoryLvl4.slug)}`
                    : parentCategoryLvl4Id
                      ? `&categoryLvl4Id=${encodeURIComponent(parentCategoryLvl4Id)}`
                      : ""
                }`}
                className="block h-full"
              >
                <div className="relative overflow-hidden rounded-lg h-full shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <div className="aspect-[16/9]">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/80 transition-colors duration-300"></div>
                  </div>

                  <div className="absolute bottom-0 left-0 p-6">
                    <h2 className="text-2xl font-bold text-white mb-2 capitalize">
                      {category.name}
                    </h2>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesLvl4Page;
