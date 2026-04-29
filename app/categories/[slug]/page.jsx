import { Suspense } from "react";
import Link from "next/link";
import {
  getCategoryLvl3BySlugFetch,
  getCategoryLvl3ByIdFetch,
} from "@/services/categoryLvl3Service";
import GridSkeletonLoader from "@/components/ui/GridSkeletonLoader";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  let categoryLvl3 = null;
  try {
    const isObjectId = /^[a-f\d]{24}$/i.test(slug);
    categoryLvl3 = isObjectId
      ? await getCategoryLvl3ByIdFetch(slug)
      : await getCategoryLvl3BySlugFetch(slug);
  } catch (e) {
    // Silent fail
  }

  const categoryName = categoryLvl3?.name || slug;

  return {
    title: `${categoryName} | Smap Auto Pro`,
    description: categoryLvl3?.name
      ? `Découvrez tous nos produits ${categoryLvl3.name}. Large choix de pièces détachées ${categoryLvl3?.categories_list?.map((cat) => cat.name).join(", ")} avec livraison rapide en Tunisie.`
      : "Parcourez notre collection complète de produits organisés par catégories.",
  };
}

async function CategoryLvl3Data({ slug }) {
  let categoryLvl3 = null;
  let categories = [];
  let error = null;

  try {
    const isObjectId = /^[a-f\d]{24}$/i.test(slug);
    categoryLvl3 = isObjectId
      ? await getCategoryLvl3ByIdFetch(slug)
      : await getCategoryLvl3BySlugFetch(slug);

    if (categoryLvl3 && categoryLvl3.categories_list) {
      categories = categoryLvl3.categories_list;
    }
  } catch (err) {
    error = "Échec du chargement des catégories.";
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
    <div className="bg-white dark:bg-secondary-900 min-h-screen">
      <div className="container mx-auto px-4 mt-12 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
            {categoryLvl3 ? categoryLvl3.name : "Acheter par catégorie"}
          </h1>
          <p className="text-secondary-600 dark:text-gray-400 max-w-2xl mx-auto">
            {categoryLvl3
              ? `Découvrez tous nos produits dans la catégorie ${categoryLvl3.name}`
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
                  href={
                    category.slug
                      ? `/categories-lvl4/${encodeURIComponent(category.slug)}`
                      : `/categories-lvl4/${category._id}`
                  }
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

export default async function CategoriesPage({ params }) {
  const { slug } = await params;

  return (
    <Suspense fallback={<GridSkeletonLoader />}>
      <CategoryLvl3Data slug={slug} />
    </Suspense>
  );
}
