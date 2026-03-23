import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import HorizontalProductScroll from "../ui/HorizontalProductScroll.jsx";

const CategoryProductsSection = ({ category }) => {
  if (!category || !category.products || category.products.length === 0) {
    return null;
  }

  return (
    <section className="py-12  bg-white dark:bg-secondary-900">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-baseline mb-2">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-4xl"
            >
              {category.category}
            </motion.h2>
            <Link
              href={`/category/${encodeURIComponent(category.category)}`}
              className="text-sm font-semibold text-customRed hover:text-red-700 dark:hover:text-red-400 transition-colors whitespace-nowrap"
            >
              Afficher tout &rarr;
            </Link>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-2 text-lg text-secondary-600 dark:text-gray-400"
          >
            Découvrez notre sélection de produits dans la catégorie{" "}
            {category.category}.
          </motion.p>
        </div>

        <HorizontalProductScroll
          promo={true}
          nouveau={true}
          products={category.products}
        />
      </div>
    </section>
  );
};

export default CategoryProductsSection;
