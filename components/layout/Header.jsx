"use client";
import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { getAllProducts } from "../../services/productService";

const Header = () => {
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();

        if (data.products && data.products.length > 0) {
          const categoriesMap = new Map();

          data.products.forEach((product) => {
            if (Array.isArray(product.category)) {
              product.category.forEach((category) => {
                if (category && category._id && category.name) {
                  if (!categoriesMap.has(category._id)) {
                    categoriesMap.set(category._id, {
                      name: category.name,
                      items: new Set(),
                    });
                  }
                  categoriesMap.get(category._id).items.add(product.name);
                }
              });
            }
          });

          const formattedCategories = Array.from(categoriesMap.entries()).map(
            ([categoryId, categoryData]) => ({
              _id: categoryId,
              name: categoryData.name,
              items: Array.from(categoryData.items).map((itemName) => ({
                name: itemName,
                href: `/products/${itemName
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`,
              })),
            }),
          );

          setDropdownCategories(formattedCategories);
        }
      } catch (error) {
        console.error("Erreur dans le composant Header:", error);
      }
    };

    fetchProducts();
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const menuTimeoutRef = useRef(null);

  const [dropdownCategories, setDropdownCategories] = useState([]);

  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup function to ensure scroll is restored
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMobileMenuOpen]);

  // Handle scroll event to change header styles
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCategoryClick = () => {
    setIsCategoryMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const headerClasses = `fixed top-0 w-full z-50 transition-all duration-300 ${
    isScrolled
      ? "bg-white/90 dark:bg-secondary-900/90 backdrop-blur-md shadow-md py-3"
      : "bg-transparent py-5"
  }`;

  return (
    <>
      <header className={headerClasses}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-baseline gap-x-1 font-bold text-secondary-900 transition-colors dark:text-white"
            >
              <span className="text-2xl font-serif-display sm:text-4xl">
                ZH
              </span>
              <span className="text-sm font-sans-condensed sm:text-lg">
                Piece Auto
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-primary-600 dark:text-primary-400 transition-colors"
                    : "text-secondary-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                }
              >
                Accueil
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  isActive
                    ? "text-primary-600 dark:text-primary-400 transition-colors"
                    : "text-secondary-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                }
              >
                Produits
              </NavLink>
              <div
                className="relative"
                onMouseEnter={() => {
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
                <NavLink
                  to="#"
                  className={({ isActive }) =>
                    `flex items-center gap-1
                      text-secondary-800 dark:text-gray-200
                   hover:text-primary-600 dark:hover:text-primary-400 transition-colors`
                  }
                >
                  Catégories
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      isCategoryMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </NavLink>
                <AnimatePresence>
                  {isCategoryMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, x: "-50%" }}
                      animate={{ opacity: 1, y: 0, x: "-50%" }}
                      exit={{ opacity: 0, y: 10, x: "-50%" }}
                      className="absolute top-full left-1/2 mt-2 w-screen bg-white/90 dark:bg-secondary-900/90 backdrop-blur-md rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 min-w-[800px] max-w-6xl max-h-[85vh] overflow-y-auto"
                    >
                      <div className="p-6 bg-white dark:bg-secondary-900 rounded-lg shadow-xl">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          {dropdownCategories.map((category) => (
                            <div key={category._id}>
                              <Link
                                href={`/products?categoryId=${encodeURIComponent(
                                  category._id,
                                )}`}
                                onClick={() => setIsCategoryMenuOpen(false)} // Close menu on click
                              >
                                <h3 className="text-lg font-semibold text-secondary-700 dark:text-white mb-2 pb-1 border-b border-secondary-200 dark:border-secondary-700 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400">
                                  {category.name}
                                </h3>
                              </Link>
                              <ul className="space-y-2">
                                {category.items.map((item, itemIndex) => (
                                  <li key={itemIndex}>
                                    <Link
                                      href={`/products?categoryId=${encodeURIComponent(
                                        category._id,
                                      )}&productName=${encodeURIComponent(
                                        item.name,
                                      )}`}
                                      onClick={() =>
                                        setIsCategoryMenuOpen(false)
                                      }
                                      className="flex items-center gap-3 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-secondary-700 p-1 "
                                    >
                                      <span>{item.name}</span>
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
              {/* <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? "text-primary-600 dark:text-primary-400 transition-colors"
                    : "text-secondary-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                }
              >
                À propos
              </NavLink> */}
            </nav>

            {/* Action Icons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSearch}
                className="p-2 rounded-full text-secondary-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-800 transition-colors"
                aria-label="Rechercher"
              >
                <Search size={20} />
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-secondary-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-800 transition-colors"
                aria-label={
                  theme === "dark"
                    ? "Passer en mode clair"
                    : "Passer en mode sombre"
                }
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <Link
                href="/cart"
                className="p-2 rounded-full text-secondary-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-800 transition-colors relative"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-full md:hidden text-secondary-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-800 transition-colors"
                style={{ visibility: isMobileMenuOpen ? "hidden" : "visible" }}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-secondary-900 shadow-md p-4 animate-fade-in">
              <form
                className="flex items-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  const params = new URLSearchParams();
                  if (searchQuery?.trim()) {
                    params.set("q", searchQuery.trim());
                  }
                  // Track where user came from
                  if (location?.pathname && location.pathname !== "/products") {
                    params.set("from", location.pathname);
                  }
                  const queryString = params.toString();
                  navigate(`/products${queryString ? `?${queryString}` : ""}`);
                  setIsSearchOpen(false);
                }}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des produits..."
                  className="w-full p-2 border border-gray-300 dark:border-secondary-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-800 dark:text-white"
                />
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-r-md transition-colors"
                >
                  <Search size={20} />
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-white/95 dark:bg-secondary-900/95 backdrop-blur-sm md:hidden"
        >
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-5 right-5 z-10 p-2 rounded-full text-secondary-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            aria-label="Fermer le menu"
          >
            <X size={28} />
          </button>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
            <div className="flex items-center justify-between h-16 md:h-20 shrink-0">
              <Link
                to="/"
                className="text-2xl font-bold text-secondary-900 dark:text-white"
              >
                <span className="text-[42px] font-serif-display">ZH</span>{" "}
                <span className="font-sans-condensed">Piece Auto</span>
              </Link>
            </div>
            <nav className="flex flex-col items-center justify-center flex-grow gap-8 -mt-16">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "text-primary-600"
                      : "text-secondary-800 dark:text-gray-200"
                  } text-2xl font-medium`
                }
              >
                Accueil
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "text-primary-600"
                      : "text-secondary-800 dark:text-gray-200"
                  } text-2xl font-medium`
                }
              >
                Produits
              </NavLink>
              <div>
                <button
                  onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
                  className="flex items-center justify-center w-full text-2xl font-medium text-secondary-800 dark:text-gray-200"
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
                      className="overflow-hidden mt-4 max-h-64 overflow-y-auto"
                    >
                      <div className="pl-4 border-l-2 border-primary-500 space-y-4">
                        {dropdownCategories.map((category) => (
                          <div key={category._id}>
                            <Link
                              href={`/products?categoryId=${encodeURIComponent(
                                category._id,
                              )}`}
                              onClick={toggleMobileMenu}
                              className="block font-bold text-lg text-secondary-700 dark:text-secondary-300"
                            >
                              {category.name}
                            </Link>

                            <ul className="space-y-2 mt-2 pl-2 border-l border-gray-200 dark:border-gray-700">
                              {category.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <Link
                                    href={`/products?categoryId=${encodeURIComponent(
                                      category._id,
                                    )}&productName=${encodeURIComponent(
                                      item.name,
                                    )}`}
                                    onClick={toggleMobileMenu}
                                    className="block text-secondary-600 dark:text-secondary-400 hover:text-primary-600"
                                  >
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
              {/* <NavLink
                to="/about"
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "text-primary-600"
                      : "text-secondary-800 dark:text-gray-200"
                  } text-2xl font-medium`
                }
              >
                À propos
              </NavLink> */}
            </nav>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Header;
