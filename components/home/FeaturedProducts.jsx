"use client";
import { motion } from "framer-motion";
import HorizontalProductScroll from "../ui/HorizontalProductScroll.jsx";
import SkeletonCard from "../ui/SkeletonCard.jsx";

const FeaturedProducts = ({ products, loading }) => {
  return (
    <section
      className="py-16  bg-white dark:bg-secondary-900"
    >
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
              Nos Promotions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-secondary-600 dark:text-gray-400"
            >
              Découvrez nos meilleures offres et réductions du moment
            </motion.p>
          </div>
        </div>

        {loading ? (
          // <p>Chargement...</p>
          <SkeletonCard />
        ) : products.length > 0 ? (
          <HorizontalProductScroll promo={true} products={products} />
        ) : (
          <div className="w-full text-center py-10">
            <p className="text-secondary-600 dark:text-gray-400">
              Il n'y a aucune promotion pour le moment. Revenez plus tard !
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
