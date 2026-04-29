import { Suspense } from "react";
import Link from "next/link";
import {
  getCategoryLvl4BySlugFetch,
  getCategoryLvl4ByIdFetch,
} from "@/services/categoryLvl4Service";
import GridSkeletonLoader from "@/components/ui/GridSkeletonLoader";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  let categoryLvl4 = null;
  try {
    const isObjectId = /^[a-f\d]{24}$/i.test(slug);
    categoryLvl4 = isObjectId
      ? await getCategoryLvl4ByIdFetch(slug)
      : await getCategoryLvl4BySlugFetch(slug);
  } catch (e) {
    // Silent fail
  }

  const categoryName = categoryLvl4?.name || slug;
  const subCategories = categoryLvl4?.categories_list
    ?.map((cat) => cat.name)
    .slice(0, 5)
    .join(", ");

  return {
    title: `${categoryName} | Smap Auto Pro`,
    description: categoryLvl4?.name
      ? `Découvrez tous nos produits ${categoryLvl4.name}: ${subCategories}. Large choix de pièces détachées avec livraison rapide en Tunisie.`
      : "Parcourez notre collection complète de produits organisés par catégories.",
  };
}

async function CategoryLvl4Data({ slug }) {
  let categoryLvl4 = null;
  let categories = [];
  let error = null;

  try {
    const isObjectId = /^[a-f\d]{24}$/i.test(slug);
    categoryLvl4 = isObjectId
      ? await getCategoryLvl4ByIdFetch(slug)
      : await getCategoryLvl4BySlugFetch(slug);

    if (categoryLvl4 && categoryLvl4.categories_list) {
      categories = categoryLvl4.categories_list;
    }
  } catch (err) {
    error = "Échec du chargement des catégories.";
    console.error(err);
  }

  const isObjectId = /^[a-f\d]{24}$/i.test(slug);
  const parentCategoryLvl4Id = isObjectId ? slug : categoryLvl4?._id || "";

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-500">
        <h1 className="text-3xl">{error}</h1>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-secondary-900 min-h-screen">
      <div className="container mx-auto px-4 mt-12 py-12">
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

        {categories.length === 0 ? (
          <GridSkeletonLoader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div
                key={category._id}
                className="group"
                style={{ animationDelay: `${index * 0.1}s` }}
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
                  <div className="relative overflow-hidden rounded-lg h-full shadow-sm hover:shadow-md transition-shadow duration-300">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default async function CategoriesLvl4Page({ params }) {
  const { slug } = await params;

  return (
    <Suspense fallback={<GridSkeletonLoader />}>
      <CategoryLvl4Data slug={slug} />
    </Suspense>
  );
}
