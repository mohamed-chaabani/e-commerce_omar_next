import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { categoryLvl2Service } from "../services/categoryLvl2Service.js";
import { categoryLvl3Service } from "../services/categoryLvl3Service.js";
import GridSkeletonLoader from "../components/ui/GridSkeletonLoader.jsx";

const CategoriesLvl3 = ({ home }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriesLvl3, setCategoriesLvl3] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [, lvl3Data] = await Promise.all([
          categoryLvl2Service.getCategoriesLvl2(),
          categoryLvl3Service.getCategoriesLvl3(),
        ]);
        setCategoriesLvl3(lvl3Data || []);
        setError(null);
      } catch (err) {
        setError("Échec du chargement des données.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-500">
        <h1 className="text-3xl">{error}</h1>
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-secondary-900">
      <div className={`container mx-auto px-4 ${home ? "md:py-12" : "py-12"}`}>
        {loading ? (
          <GridSkeletonLoader />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1 sm:gap-8 mt-7 ">
            {categoriesLvl3.map((category, index) => (
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

                    <div className="absolute bottom-0 left-0 p-1 sm:p-6">
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
    </section>
  );
};

export default CategoriesLvl3;
