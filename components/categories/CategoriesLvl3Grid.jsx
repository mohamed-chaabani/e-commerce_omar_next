"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const CategoriesLvl3Grid = ({ category, index = 0 }) => {
  return (
    <>
      <motion.div
        key={category._id}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="w-full sm:basis-1/2 lg:basis-1/3 p-2"
      >
        <Link
          href={
            category.slug
              ? `/categories/${encodeURIComponent(category.slug)}`
              : `/categories/${category._id}`
          }
          className="block h-full"
        >
          <div className="relative overflow-hidden  h-full shadow-sm group-hover:shadow-md transition-shadow duration-300">
            <div className="aspect-square md:aspect-[16/9]">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/80 transition-colors duration-300"></div>
            </div>

            {category?.visibility && (
              <div className="absolute bottom-0 left-0 p-1 sm:p-6">
                <h2 className="text-2xl font-bold text-white mb-2 capitalize">
                  {category.name}
                </h2>
              </div>
            )}
          </div>
        </Link>
      </motion.div>
    </>
  );
};

export default CategoriesLvl3Grid;
