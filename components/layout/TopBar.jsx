"use client";
import React, { useState, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeContext } from "@/context/ThemeContext";
import { useSearch } from "@/context/SearchContext";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Search,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const NavLinks = ({
  isCategoryMenuOpen,
  setIsCategoryMenuOpen,
  menuTimeoutRef,
  dropdownCategories,
  theme,
}) => (
  <nav className="flex items-center space-x-8">
    <Link
      href="/"
      className={`text-lg font-medium transition-colors ${
        theme === "dark"
          ? "text-gray-200 hover:text-primary-400"
          : "text-secondary-800 hover:text-primary-600"
      }`}
    >
      Accueil
    </Link>
    <Link
      href="/products"
      className={`text-lg font-medium transition-colors ${
        theme === "dark"
          ? "text-gray-200 hover:text-primary-400"
          : "text-secondary-800 hover:text-primary-600"
      }`}
    >
      Produits
    </Link>
    <div
      className="relative"
      onMouseEnter={() => {
        if (dropdownCategories.length === 0) {
          return;
        }

        if (menuTimeoutRef.current) {
          clearTimeout(menuTimeoutRef.current);
        }
        setIsCategoryMenuOpen(true);
      }}
      onMouseLeave={() => {
        menuTimeoutRef.current = setTimeout(() => {
          setIsCategoryMenuOpen(false);
        }, 200);
      }}
    >
      <Link
        href="#"
        className={`flex items-center gap-1 transition-colors ${
          theme === "dark"
            ? "text-gray-200 hover:text-primary-400"
            : "text-secondary-800 hover:text-primary-600"
        }`}
      >
        Catégories
        <ChevronDown
          size={16}
          className={`transition-transform ${
            isCategoryMenuOpen ? "rotate-180" : ""
          }`}
        />
      </Link>
      <AnimatePresence>
        {isCategoryMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-60%" }}
            exit={{ opacity: 0, y: 10, x: "-50%" }}
            className={`absolute top-full left-1/2 mt-2 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 z-50 min-w-[850px] max-w-6xl max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary-500 ${
              theme === "dark"
                ? "bg-secondary-900/95 ring-secondary-700 scrollbar-track-secondary-800"
                : "bg-white/95 ring-gray-200 scrollbar-track-gray-200"
            }`}
          >
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dropdownCategories.map((category) => (
                  <div
                    key={category._id}
                    className={`rounded-xl p-4 border hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${
                      theme === "dark"
                        ? "from-secondary-800 to-secondary-900 border-secondary-700 hover:border-primary-500"
                        : "from-white to-gray-50 border-gray-200 hover:border-primary-400"
                    }`}
                  >
                    <Link
                      href={
                        category.slug
                          ? `/category/${encodeURIComponent(category.slug)}`
                          : `/products?categoryId=${encodeURIComponent(category._id)}`
                      }
                      onClick={() => setIsCategoryMenuOpen(false)}
                      className="group"
                    >
                      <h3
                        className={`text-base font-bold uppercase tracking-wider mb-3 pb-2 border-b-2 border-primary-500 transition-colors flex items-center justify-between ${
                          theme === "dark"
                            ? "text-primary-400 group-hover:text-primary-300"
                            : "text-primary-700 group-hover:text-primary-600"
                        }`}
                      >
                        <span>{category.name}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            theme === "dark"
                              ? "bg-primary-900/30 text-primary-400"
                              : "bg-primary-100 text-primary-700"
                          }`}
                        >
                          {category.items.length}
                        </span>
                      </h3>
                    </Link>
                    <ul
                      className={`space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-400 ${
                        theme === "dark"
                          ? "scrollbar-track-secondary-800"
                          : "scrollbar-track-gray-200"
                      }`}
                    >
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <Link
                            href={
                              category.slug
                                ? `/category/${encodeURIComponent(
                                    category.slug,
                                  )}?productName=${encodeURIComponent(
                                    item.name,
                                  )}`
                                : `/products?categoryId=${encodeURIComponent(
                                    category._id,
                                  )}&productName=${encodeURIComponent(
                                    item.name,
                                  )}`
                            }
                            onClick={() => setIsCategoryMenuOpen(false)}
                            className={`flex items-center gap-2 text-sm rounded-md px-2 py-1.5 transition-all duration-200 group ${
                              theme === "dark"
                                ? "text-secondary-300 hover:text-primary-400 hover:bg-secondary-700"
                                : "text-secondary-700 hover:text-primary-600 hover:bg-primary-50"
                            }`}
                          >
                            <span
                              className={`group-hover:translate-x-0.5 transition-transform ${
                                theme === "dark"
                                  ? "text-primary-400"
                                  : "text-primary-500"
                              }`}
                            >
                              ›
                            </span>
                            <span className="line-clamp-2 leading-tight">
                              {item.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </nav>
);

const TopBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems = 0 } = useCart() || {};
  const { theme, toggleTheme } = useContext(ThemeContext);
  const {
    searchQuery,
    setSearchQuery,
    setSearchCategoryLvl4Id,
    isSearching,
    prevRoute,
    startSearch,
    endSearch,
  } = useSearch();
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownCategories, setDropdownCategories] = useState([]);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const menuTimeoutRef = useRef(null);

  // State for hiding/showing search bar on scroll
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // TODO: Implement productService for Next.js
    // For now, set empty categories
    setDropdownCategories([]);
  }, []);

  // Handle scroll to show/hide search bar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // If scroll is at the top (less than 10px), show the bar
      if (currentScrollY < 10) {
        setIsSearchVisible(true);
      }
      // If scrolling down, hide the bar
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsSearchVisible(false);
      }
      // If scrolling up, show the bar
      else if (currentScrollY < lastScrollY) {
        setIsSearchVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const match = pathname.match(/^\/categories-lvl4\/([^/]+)$/);
    const fromPath = match?.[1] || null;
    setSearchCategoryLvl4Id(fromPath);
  }, [pathname, setSearchCategoryLvl4Id]);

  // Drive navigation based on search query changes (global search flow)
  useEffect(() => {
    const trimmed = (searchQuery || "").trim();
    if (trimmed) {
      // If we are already in search mode and left /products (e.g. opened a product),
      // don't force navigation back to /products. Let the other effect clear search state.
      const isProductDetail = /^\/(p|products)\//.test(pathname);
      const isLeavingProductsListing =
        isSearching && pathname !== "/products" && !isProductDetail;
      if (isSearching && (isProductDetail || isLeavingProductsListing)) {
        // In both cases, we don't want to override the user's navigation;
        // another effect will clear the search state when appropriate.
        return;
      }

      if (!isSearching) {
        startSearch(pathname);
      }
      const isLvl4CategoryPage = /^\/categories-lvl4\//.test(pathname);

      // Build target search params, preserving existing filters where possible
      const params = new URLSearchParams(
        pathname === "/products" ? window.location.search : "",
      );
      params.set("q", trimmed);

      // If we come from a level 4 category page, scope search to that slug
      if (isLvl4CategoryPage) {
        const match = pathname.match(/^\/categories-lvl4\/([^/]+)$/);
        const lvl4SlugFromPath = match?.[1];
        if (lvl4SlugFromPath) {
          params.set("categoryLvl4Slug", lvl4SlugFromPath);
        }
      }

      const targetQuery = params.toString();
      const currentQ =
        new URLSearchParams(window.location.search).get("q") || "";
      const nextUrl = targetQuery ? `/products?${targetQuery}` : "/products";

      if (pathname !== "/products" || currentQ !== trimmed) {
        router.push(nextUrl);
      }
    } else if (isSearching && pathname === "/products") {
      const back = prevRoute || "/";
      endSearch();
      router.push(back);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, isSearching, prevRoute, pathname]);

  // When user navigates to a product detail page, exit search mode and clear query
  useEffect(() => {
    const isProductDetail = /^\/(p|products)\//.test(pathname);
    if (isProductDetail && isSearching) {
      setSearchQuery("");
      endSearch();
    }
  }, [pathname, isSearching, setSearchQuery, endSearch]);

  // When user leaves the products listing while a search is active (e.g. goes to home or categories),
  // clear the search state so future searches from those pages work normally.
  useEffect(() => {
    const isProductDetail = /^\/(p|products)\//.test(pathname);
    if (isSearching && pathname !== "/products" && !isProductDetail) {
      setSearchQuery("");
      endSearch();
    }
  }, [pathname, isSearching, setSearchQuery, endSearch]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const match = pathname.match(/^\/categories-lvl4\/([^/]+)$/);
    const fromPath = match?.[1];
    if (fromPath) {
      return;
    }

    router.push("/products");
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 backdrop-filter backdrop-blur-sm">
        <div
          className={`flex items-center h-16 shadow-md ${
            theme === "dark" ? "bg-secondary-900/80" : "bg-white/80"
          }`}
        >
          {/* Left Blue Wing */}
          <div
            className={
              theme === "dark"
                ? "bg-blue-950 h-full w-[40%] md:w-1/4"
                : "bg-blue-900 h-full w-[40%] md:w-1/4"
            }
            style={{
              clipPath: "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)",
            }}
          >
            <div className="flex items-center justify-center h-full">
              <Link
                href="/"
                className="flex items-baseline gap-x-1 font-bold text-white"
              >
                <img
                  src="/blanc.png"
                  alt="logo"
                  className=" h-6 sm:h-8 md:h-9 lg:h-10 w-auto object-contain"
                />
              </Link>
            </div>
          </div>

          {/* Center Navigation */}
          <div className="flex-grow flex items-center justify-center">
            <div className="hidden md:flex">
              <NavLinks
                isCategoryMenuOpen={isCategoryMenuOpen}
                setIsCategoryMenuOpen={setIsCategoryMenuOpen}
                menuTimeoutRef={menuTimeoutRef}
                dropdownCategories={dropdownCategories}
                theme={theme}
              />
            </div>
          </div>

          <div className=" md:hidden absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img
              src={theme === "dark" ? "/icon blanc.png" : "/icon noir.png"}
              alt="logo"
              className="h-8 md:h-10 lg:h-12 w-auto object-contain"
            />
          </div>

          {/* Right Blue Wing */}
          <div
            className={
              theme === "dark"
                ? "bg-red-900 h-full w-[40%]  md:w-1/4"
                : "bg-red-800 h-full w-[40%]  md:w-1/4"
            }
            style={{
              clipPath: "polygon(15% 0, 100% 0, 100% 100%, 15% 100%, 0 50%)",
            }}
          >
            <div className="flex items-center xs:justify-start sm:justify-end h-full space-x-4 pr-4 md:pr-6">
              <button
                onClick={toggleTheme}
                className={
                  theme === "dark"
                    ? "p-2 rounded-full text-white hover:bg-red-950 transition-colors"
                    : "p-2 rounded-full text-white hover:bg-red-900 transition-colors"
                }
                aria-label={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link
                href="/cart"
                className={
                  theme === "dark"
                    ? "p-2 rounded-full text-white hover:bg-red-950 transition-colors relative"
                    : "p-2 rounded-full text-white hover:bg-red-900 transition-colors relative"
                }
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                onClick={toggleMobileMenu}
                className={
                  theme === "dark"
                    ? "p-2 rounded-full md:hidden text-white hover:bg-red-950 transition-colors"
                    : "p-2 rounded-full md:hidden text-white hover:bg-red-900 transition-colors"
                }
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar - Sticky below header */}
      <div
        className={`sticky top-16 left-0 right-0 z-30 shadow-md transition-all duration-300 ease-in-out ${
          theme === "dark" ? "bg-secondary-900" : "bg-white"
        } ${
          isSearchVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
        style={{
          transitionProperty: "transform, opacity",
          transitionDuration: "300ms, 150ms",
          transitionDelay: isSearchVisible ? "0ms, 0ms" : "0ms, 150ms",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-2">
          <form className="flex items-center" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher des produits..."
              className={`w-full p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                theme === "dark"
                  ? "border-secondary-700 bg-secondary-800 text-white"
                  : "border-gray-300"
              }`}
            />
            <button
              type="submit"
              className={
                theme === "dark"
                  ? "bg-blue-800 hover:bg-blue-700 text-white p-2 rounded-r-md transition-colors"
                  : "bg-blue-900 hover:bg-blue-700 text-white p-2 rounded-r-md transition-colors"
              }
            >
              <Search size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-[100] backdrop-filter backdrop-blur-sm md:hidden ${
              theme === "dark" ? "bg-secondary-950/80" : "bg-white/80"
            }`}
          >
            <div className="w-full h-full flex flex-col px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16 md:h-20 shrink-0">
                <Link
                  href="/"
                  onClick={toggleMobileMenu}
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-secondary-900"
                  }`}
                >
                  <img
                    src="/blanc.png"
                    alt="logo"
                    className=" h-8 lg:h-10 w-auto object-contain"
                  />
                </Link>
                <button
                  onClick={toggleMobileMenu}
                  className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${
                    theme === "dark"
                      ? "text-gray-200 hover:bg-secondary-800"
                      : "text-secondary-800 hover:bg-gray-100"
                  }`}
                  aria-label="Close menu"
                >
                  <X size={28} />
                </button>
              </div>
              <nav className="flex flex-col items-center justify-center flex-grow gap-8">
                <Link
                  href="/"
                  onClick={toggleMobileMenu}
                  className={`text-2xl font-medium ${
                    theme === "dark" ? "text-gray-200" : "text-secondary-800"
                  }`}
                >
                  Accueil
                </Link>
                <Link
                  href="/products"
                  onClick={toggleMobileMenu}
                  className={`text-2xl font-medium ${
                    theme === "dark" ? "text-gray-200" : "text-secondary-800"
                  }`}
                >
                  Produits
                </Link>
                <div>
                  <button
                    onClick={() =>
                      setIsMobileCategoryOpen(!isMobileCategoryOpen)
                    }
                    className={`flex items-center justify-center w-full text-2xl font-medium ${
                      theme === "dark" ? "text-gray-200" : "text-secondary-800"
                    }`}
                  >
                    <span>Catégories</span>
                    <ChevronDown
                      size={24}
                      className={`ml-2 transition-transform ${
                        isMobileCategoryOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isMobileCategoryOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={`overflow-hidden mt-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-500 pr-2 ${
                          theme === "dark"
                            ? "scrollbar-track-secondary-800"
                            : "scrollbar-track-gray-200"
                        }`}
                      >
                        <div className="w-full space-y-3">
                          {dropdownCategories.map((category) => (
                            <div
                              key={category._id}
                              className={`bg-gradient-to-r rounded-lg p-3 border-l-4 border-primary-500 shadow-sm ${
                                theme === "dark"
                                  ? "from-secondary-800 to-secondary-900"
                                  : "from-primary-50 to-blue-50"
                              }`}
                            >
                              <Link
                                href={
                                  category.slug
                                    ? `/category/${encodeURIComponent(
                                        category.slug,
                                      )}`
                                    : `/products?categoryId=${encodeURIComponent(
                                        category._id,
                                      )}`
                                }
                                onClick={toggleMobileMenu}
                                className={`block font-bold text-base uppercase tracking-wide transition-colors mb-2 ${
                                  theme === "dark"
                                    ? "text-primary-400 hover:text-primary-300"
                                    : "text-primary-700 hover:text-primary-600"
                                }`}
                              >
                                {category.name}
                              </Link>
                              <ul className="space-y-1.5 pl-2">
                                {category.items.map((item, itemIndex) => (
                                  <li key={itemIndex}>
                                    <Link
                                      href={
                                        category.slug
                                          ? `/category/${encodeURIComponent(
                                              category.slug,
                                            )}?productName=${encodeURIComponent(
                                              item.name,
                                            )}`
                                          : `/products?categoryId=${encodeURIComponent(
                                              category._id,
                                            )}&productName=${encodeURIComponent(
                                              item.name,
                                            )}`
                                      }
                                      onClick={toggleMobileMenu}
                                      className={`flex items-center text-sm hover:translate-x-1 transition-all duration-200 py-1 ${
                                        theme === "dark"
                                          ? "text-secondary-300 hover:text-primary-400"
                                          : "text-secondary-700 hover:text-primary-600"
                                      }`}
                                    >
                                      <span
                                        className={`mr-2 ${
                                          theme === "dark"
                                            ? "text-primary-400"
                                            : "text-primary-500"
                                        }`}
                                      >
                                        ›
                                      </span>
                                      {item.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopBar;
