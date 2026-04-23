import { Suspense } from "react";
import { categoryLvl3Service } from "../services/categoryLvl3Service.js";
import CategoriesLvl3Grid from "../components/categories/CategoriesLvl3Grid.jsx";
import GridSkeletonLoader from "../components/ui/GridSkeletonLoader.jsx";

// Async component that fetches data
const CategoriesLvl3Content = async ({ home }) => {
  let categoriesLvl3 = [];
  let error = null;

  try {
    categoriesLvl3 = await categoryLvl3Service.getCategoriesLvl3();
  } catch (err) {
    error = "Échec du chargement des données.";
    console.error(err);
  }

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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 sm:gap-8 mt-7 ">
          {categoriesLvl3.map((category, index) => (
            <CategoriesLvl3Grid
              key={category._id}
              index={index}
              category={category}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Main component with Suspense wrapper
const CategoriesLvl3 = ({ home }) => {
  return (
    <Suspense fallback={<GridSkeletonLoader />}>
      <CategoriesLvl3Content home={home} />
    </Suspense>
  );
};

export default CategoriesLvl3;
