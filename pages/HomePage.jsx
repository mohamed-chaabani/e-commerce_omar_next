"use client";
import React, { useState, useEffect } from "react";
import FeaturedCategories from "../components/home/FeaturedCategories.jsx";
import FeaturedSlider from "../components/home/FeaturedSlider.jsx";
import FeaturedProducts from "../components/home/FeaturedProducts.jsx";
import NewArrivals from "../components/home/NewArrivals.jsx";
import TrendingProducts from "../components/home/TrendingProducts.jsx";
import CallToAction from "../components/home/CallToAction.jsx";
import CategoryProductsSection from "../components/home/CategoryProductsSection.jsx";
import {
  getAllProducts,
  getTrendingProducts,
  getPromoProducts,
  getHomeCategories,
} from "../services/productService.js";
import CategoriesLvl3 from "../app/CategoriesLvl3.jsx";
import FeaturedSliderV2 from "../components/home/FeaturedSliderV2.jsx";
import Slider from "react-infinite-logo-slider";
import { logoSliderService } from "../services/logoSliderService.js";
const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [homeCategories, setHomeCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logoSliders, setLogoSliders] = useState([]);
  // No client-only gating: keep SSR and first client paint identical

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [allProductsResponse, trending, homeCats, promo, logos] =
          await Promise.all([
            getAllProducts(),
            getTrendingProducts(),
            getHomeCategories(),
            getPromoProducts(),
            logoSliderService.getLogoSliders(),
          ]);

        const productsArray = allProductsResponse.products || [];

        const featured = productsArray.filter(
          (p) => p.promoPrice && p.promoPrice > 0,
        );
        // setFeaturedProducts(featured);
        setFeaturedProducts(promo);

        const newItems = productsArray.filter((p) => p.isProduit);
        setNewArrivals(newItems);

        setTrendingProducts(trending);
        setHomeCategories(homeCats);
        setLogoSliders(logos || []);
      } catch (error) {
        console.error(
          "Échec de la récupération des produits pour la page d'accueil:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="overflow-x-hidden mt-16 ">
      <section className="bg-white dark:bg-secondary-900">
        <FeaturedSlider />
        {/* <FeaturedSliderV2 /> */}
        {/* <FeaturedCategories /> */}
        {/* <CategoriesPage home={true} /> */}

        {logoSliders.length === 1 ? (
          <div className="w-full flex items-center justify-center py-4">
            <img
              src={logoSliders[0].image}
              alt="logo"
              className="w-36"
              loading="lazy"
            />
          </div>
        ) : logoSliders.length > 1 ? (
          <Slider
            width="250px"
            duration={40}
            pauseOnHover={false}
            blurBorders={false}
            blurBorderColor={"#fff"}
          >
            {logoSliders.map((logo) => (
              <Slider.Slide key={logo._id}>
                <img
                  src={logo.image}
                  alt="logo"
                  className="w-36"
                  loading="lazy"
                />
              </Slider.Slide>
            ))}
          </Slider>
        ) : null}
      </section>

      <CategoriesLvl3 home={true} />
      {featuredProducts.length > 0 && (
        <FeaturedProducts products={featuredProducts} loading={loading} />
      )}
      {trendingProducts.length > 0 && (
        <TrendingProducts products={trendingProducts} loading={loading} />
      )}

      {newArrivals.length > 0 && (
        <NewArrivals products={newArrivals} loading={loading} />
      )}
      {homeCategories.map((category, index) => (
        <CategoryProductsSection key={index} category={category} />
      ))}

      <CallToAction />
    </div>
  );
};

export default HomePage;
