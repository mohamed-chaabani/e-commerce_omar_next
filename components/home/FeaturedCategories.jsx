import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { categoryLvl2Service } from "../../services/categoryLvl2Service";

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryLvl2Service.getCategoriesLvl2();
        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          // Handle cases where the API might not return an array (e.g., on error)
          setCategories([]);
          console.warn("Expected an array of categories, but received:", data);
        }
        setError(null);
      } catch (err) {
        setError("Échec du chargement des catégories.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Chargement des catégories...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <section
      // className=" bg-gray-50 dark:bg-secondary-950 py-4 "
      className="py-4"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
            Parcourir nos catégories
          </h2>
          <p className="max-w-2xl mx-auto text-secondary-600 dark:text-gray-400">
            Trouvez la pièce dont vous avez besoin parmi notre large sélection
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/category/${encodeURIComponent(category.name)}`}
                className="group block bg-white dark:bg-secondary-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-medium text-secondary-900 dark:text-white">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
