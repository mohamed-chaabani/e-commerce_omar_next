import { get_All } from "../functions/restApi";
// const API_URL = "http://localhost:5000/api/categories-lvl3";
const API_URL = "https://backend-omar-5d89.onrender.com/api/categories-lvl3";
const BASE_API_URL = "https://backend-omar-5d89.onrender.com/api";

// ============================================
// FETCH-BASED VERSIONS (for Server Components)
// ============================================

export async function getCategoryLvl3BySlugFetch(slug) {
  const res = await fetch(
    `${BASE_API_URL}/categories-lvl3/by-slug/${encodeURIComponent(slug)}`,
    {
      cache: "force-cache",
      next: { revalidate: 300 }, // Cache for 5 minutes
    },
  );
  if (!res.ok) throw new Error("Failed to fetch category lvl3 by slug");
  const data = await res.json();
  return data?.data || null;
}

export async function getCategoryLvl3ByIdFetch(id) {
  const res = await fetch(
    `${BASE_API_URL}/categories-lvl3/${encodeURIComponent(id)}`,
    {
      cache: "force-cache",
      next: { revalidate: 300 },
    },
  );
  if (!res.ok) throw new Error("Failed to fetch category lvl3 by id");
  const data = await res.json();
  return data?.data || null;
}

const getCategoriesLvl3 = async () => {
  try {
    const response = await get_All(API_URL);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching level 3 categories:", error);
    throw error;
  }
};

const getCategoryLvl3ById = async (id) => {
  try {
    const response = await get_All(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching category level 3 with id ${id}:`, error);
    throw error;
  }
};

const getCategoryLvl3BySlug = async (slug) => {
  try {
    const response = await get_All(
      `${API_URL.replace(/\/categories-lvl3$/, "")}/categories-lvl3/by-slug/${encodeURIComponent(slug)}`,
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching category level 3 with slug ${slug}:`, error);
    throw error;
  }
};

export const categoryLvl3Service = {
  getCategoriesLvl3,
  getCategoryLvl3ById,
  getCategoryLvl3BySlug,
};
