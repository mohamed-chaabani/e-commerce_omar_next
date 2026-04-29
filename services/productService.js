import { get_All } from "../functions/restApi";

// const API_URL = "https://backend-omar-90dc.onrender.com/api";
// const API_URL = "http://localhost:5000/api";
const API_URL = "https://backend-omar-5d89.onrender.com/api";

const PRODUCTS_URL = `${API_URL}/products`;
const ALL_PRODUCTS_URL = `${API_URL}/all-products`;
const ARTICLES_URL = `${API_URL}/articles`;
const CATEGORIES_URL = `${API_URL}/categories`;

// ============================================
// FETCH-BASED VERSIONS (for Server Components)
// ============================================
// These use native fetch() which works in both Node.js and Browser

export async function getProductDetailsFetch(categoryId, productName) {
  const categoryIdParam = categoryId ? encodeURIComponent(categoryId) : "";
  const productNameParam = productName ? encodeURIComponent(productName) : "";

  const url = `${API_URL}/product?categoryId=${categoryIdParam}&productName=${productNameParam}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch product details");
  }

  const data = await res.json();

  return data;
}

export async function getCategoryBySlugFetch(slug) {
  const res = await fetch(
    `${CATEGORIES_URL}/by-slug/${encodeURIComponent(slug)}`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error("Failed to fetch category");
  return res.json();
}

export async function getProductBySlugFetch(slug) {
  const res = await fetch(
    `${PRODUCTS_URL}/by-slug/${encodeURIComponent(slug)}`,
    {
      cache: "force-cache",
      next: { revalidate: 60 }, // Cache for 1 minute (product data changes frequently)
    },
  );
  if (!res.ok) throw new Error("Failed to fetch product by slug");
  const data = await res.json();

  return data || null;
}

export async function getProductByIdFetch(id) {
  const res = await fetch(`${PRODUCTS_URL}/${encodeURIComponent(id)}`, {
    cache: "force-cache",
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch product by id");
  const data = await res.json();
  return data?.data || null;
}

export async function getProductsPaginatedFetch({
  page = 1,
  limit = 20,
  categoryLvl4Id,
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (categoryLvl4Id) params.set("categoryLvl4Id", String(categoryLvl4Id));

  const res = await fetch(`${ALL_PRODUCTS_URL}?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch paginated products");
  return res.json();
}

export async function getProductsBycategoriesLvl2Fetch(
  categoryName,
  categoryLvl4Id,
) {
  const categoryLvl4Query = categoryLvl4Id
    ? `?categoryLvl4Id=${encodeURIComponent(categoryLvl4Id)}`
    : "";
  const url = `${API_URL}/category/${encodeURIComponent(categoryName)}${categoryLvl4Query}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products by category");
  const data = await res.json();
  return data;
}

// NEW: Get products by category ID (alternative to name-based endpoint)
export async function getProductsByCategoryIdFetch(categoryId, categoryLvl4Id) {
  if (!categoryId) throw new Error("categoryId is required");

  const categoryLvl4Query = categoryLvl4Id
    ? `&categoryLvl4Id=${encodeURIComponent(categoryLvl4Id)}`
    : "";
  const url = `${API_URL}/product?categoryId=${encodeURIComponent(categoryId)}${categoryLvl4Query}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products by category ID");
  const data = await res.json();
  return data;
}

export async function searchProductsFetch(query, categoryLvl4Key) {
  let categoryLvl4Query = "";
  if (categoryLvl4Key) {
    const isObjectId = /^[a-f\d]{24}$/i.test(String(categoryLvl4Key));
    categoryLvl4Query = isObjectId
      ? `&categoryLvl4Id=${encodeURIComponent(categoryLvl4Key)}`
      : `&categoryLvl4Slug=${encodeURIComponent(categoryLvl4Key)}`;
  }

  const res = await fetch(
    `${ALL_PRODUCTS_URL}?searchTerm=${encodeURIComponent(query)}${categoryLvl4Query}`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error("Failed to search products");
  return res.json();
}

// Fetch product details by category and product name
export const getProductDetails = async (categoryId, productName) => {
  try {
    // get_All returns the full axios response object.
    // We access the actual data using response.data
    const categoryIdParam =
      categoryId !== undefined && categoryId !== null
        ? encodeURIComponent(categoryId)
        : "";
    const productNameParam =
      productName !== undefined && productName !== null
        ? encodeURIComponent(productName)
        : "";
    const response = await get_All(
      `${API_URL}/product?categoryId=${categoryIdParam}&productName=${productNameParam}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};

// Fetch category by slug
const getCategoryBySlug = async (slug) => {
  try {
    const response = await get_All(
      `${CATEGORIES_URL}/by-slug/${encodeURIComponent(slug)}`,
    );
    return response.data || null;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de la catégorie par slug ${slug}:`,
      error,
    );
    throw error;
  }
};

// Fetch product by slug
const getProductBySlug = async (slug) => {
  try {
    const response = await get_All(
      `${PRODUCTS_URL}/by-slug/${encodeURIComponent(slug)}`,
    );
    return response.data || null;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du produit par slug ${slug}:`,
      error,
    );
    throw error;
  }
};

const getProductsPaginated = async ({
  page = 1,
  limit = 20,
  categoryLvl4Id,
} = {}) => {
  try {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (categoryLvl4Id) params.set("categoryLvl4Id", String(categoryLvl4Id));

    const response = await get_All(`${ALL_PRODUCTS_URL}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération paginée des produits:",
      error,
    );
    throw error;
  }
};

// Fonction pour récupérer tous les produits
const getAllCategories = async () => {
  try {
    // We'll assume the backend route /api/categories exists and returns all categories
    const response = await get_All(CATEGORIES_URL);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    throw error;
  }
};

// Fonction pour récupérer tous les produits
const getAllProductsForDropdown = async () => {
  try {
    // La fonction get_All retourne la réponse complète d'axios
    const response = await get_All(`${API_URL}/products`);
    return response.data; // Nous retournons donc response.data
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de tous les produits:",
      error,
    );
    throw error;
  }
};

const getAllProducts = async () => {
  try {
    // La fonction get_All retourne la réponse complète d'axios
    const response = await get_All(`${API_URL}/all-products`);
    return response.data; // Nous retournons donc response.data
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de tous les produits:",
      error,
    );
    throw error;
  }
};

const getPromoProducts = async () => {
  try {
    const response = await get_All(`${PRODUCTS_URL}/promo`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des produits en promo:",
      error,
    );
    throw error;
  }
};

// Fonction pour récupérer un produit par son ID
const getProductById = async (id) => {
  try {
    const response = await get_All(`${ALL_PRODUCTS_URL}/${id}`);

    // The API returns an array, so we take the first element.
    // If the array is empty (product not found), it returns undefined which becomes null.
    return response.data || null;
  } catch (error) {
    console.error(`Erreur lors de la récupération du produit ${id}:`, error);
    throw error;
  }
};

// Fonction pour récupérer les produits par catégorie de niveau 2
const getProductsBycategoriesLvl2 = async (categoryName, categoryLvl4Id) => {
  try {
    const categoryLvl4Query = categoryLvl4Id
      ? `?categoryLvl4Id=${encodeURIComponent(categoryLvl4Id)}`
      : "";
    const response = await get_All(
      `${API_URL}/category/${encodeURIComponent(
        categoryName,
      )}${categoryLvl4Query}`,
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching products for category ${categoryName}:`,
      error,
    );
    throw error;
  }
};

// Fonction pour rechercher des produits
// Le deuxième argument peut être un ObjectId OU un slug de catégorie niveau 4
const searchProducts = async (query, categoryLvl4Key) => {
  try {
    let categoryLvl4Query = "";

    if (categoryLvl4Key) {
      const isObjectId = /^[a-f\d]{24}$/i.test(String(categoryLvl4Key));
      if (isObjectId) {
        categoryLvl4Query = `&categoryLvl4Id=${encodeURIComponent(
          categoryLvl4Key,
        )}`;
      } else {
        categoryLvl4Query = `&categoryLvl4Slug=${encodeURIComponent(
          categoryLvl4Key,
        )}`;
      }
    }

    const response = await get_All(
      `${ALL_PRODUCTS_URL}?searchTerm=${encodeURIComponent(
        query,
      )}${categoryLvl4Query}`,
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la recherche de produits pour "${query}":`,
      error,
    );
    throw error;
  }
};

// Fonction pour récupérer les produits les plus vendus
// Fonction pour récupérer les catégories de la page d'accueil avec leurs produits
const getHomeCategories = async () => {
  try {
    const response = await get_All(`${PRODUCTS_URL}/home-categories`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des catégories pour la page d'accueil:",
      error,
    );
    throw error;
  }
};

// Fonction pour récupérer les produits les plus vendus
const getTrendingProducts = async () => {
  try {
    const response = await get_All(`${ARTICLES_URL}/trending`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des produits les plus vendus:",
      error,
    );
    throw error;
  }
};

export {
  getAllProducts,
  getProductsPaginated,
  getAllCategories,
  getProductById,
  getProductsBycategoriesLvl2,
  searchProducts,
  getTrendingProducts,
  getHomeCategories,
  getAllProductsForDropdown,
  getPromoProducts,
  getProductBySlug,
  getCategoryBySlug,
};
