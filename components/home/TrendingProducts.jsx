import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import HorizontalProductScroll from "../ui/HorizontalProductScroll.jsx";

const TrendingProducts = ({ products, loading }) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-secondary-900 dark:text-white mb-2"
            >
              Tendances actuelles
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-secondary-600 dark:text-gray-400"
            >
              Découvrez ce que tout le monde achète en ce moment
            </motion.p>
          </div>
        </div>

        <HorizontalProductScroll products={products} />
      </div>
    </section>
  );
};

export default TrendingProducts;
