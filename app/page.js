import React from "react";
// import FeaturedCategories from "@/components/home/FeaturedCategories.jsx";
import FeaturedSlider from "@/components/home/FeaturedSlider.jsx";
import FeaturedProducts from "@/components/home/FeaturedProducts.jsx";
import NewArrivals from "@/components/home/NewArrivals.jsx";
import TrendingProducts from "@/components/home/TrendingProducts.jsx";
import CallToAction from "@/components/home/CallToAction.jsx";
import CategoryProductsSection from "../components/home/CategoryProductsSection.jsx";
import {
  getAllProducts,
  getTrendingProducts,
  getPromoProducts,
  getHomeCategories,
} from "../services/productService.js";
// import FeaturedSliderV2 from "@/components/home/FeaturedSliderV2.jsx";
import { logoSliderService } from "../services/logoSliderService.js";
import CategoriesLvl3 from "@/app/CategoriesLvl3.jsx";
import LogoSliderClient from "@/components/home/LogoSliderClient.jsx";

import { categoryLvl3Service } from "../services/categoryLvl3Service.js";

export async function generateMetadata() {
  const categoriesLvl3 = await categoryLvl3Service.getCategoriesLvl3();

  const categoryNames = categoriesLvl3
    .map((c) => c.name)
    .slice(0, 5)
    .join(", ");

  // Extract subcategories from categories_list
  const subCategories = categoriesLvl3
    .flatMap((c) => c.categories_list?.map((sub) => sub.name) || [])
    .slice(0, 10)
    .join(", ");

  return {
    title: `Pièces auto | Smap Auto Pro`,
    description: `Découvrez nos catégories de pièces détachées automobiles: ${categoryNames}. Sous-catégories: ${subCategories}. Livraison rapide et prix compétitifs.`,
  };
}

export default async function Home() {
  // Fetch data on server side
  const [allProductsResponse, trending, homeCats, promo, logos] =
    await Promise.all([
      getAllProducts(),
      getTrendingProducts(),
      getHomeCategories(),
      getPromoProducts(),
      logoSliderService.getLogoSliders(),
    ]);

  const productsArray = allProductsResponse.products || [];

  const featuredProducts = promo;

  const newArrivals = productsArray.filter((p) => p.isProduit);

  const trendingProducts = trending;
  const homeCategories = homeCats;
  const logoSliders = logos || [];

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-secondary-950">
      {/* <HomePage /> */}
      <div className="overflow-x-hidden mt-16 ">
        <section className="bg-white dark:bg-secondary-900">
          <FeaturedSlider />
          <LogoSliderClient logoSliders={logoSliders} />
        </section>

        <CategoriesLvl3 home={true} />
        {featuredProducts.length > 0 && (
          <FeaturedProducts products={featuredProducts} loading={false} />
        )}
        {trendingProducts.length > 0 && (
          <TrendingProducts products={trendingProducts} loading={false} />
        )}

        {newArrivals.length > 0 && (
          <NewArrivals products={newArrivals} loading={false} />
        )}
        {homeCategories.map((category, index) => (
          <CategoryProductsSection key={index} category={category} />
        ))}

        <CallToAction />
      </div>
    </main>
  );
}
