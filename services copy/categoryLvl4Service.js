import { get_All } from "../functions/restApi";

// const API_URL = "http://localhost:5000/api/categories-lvl4";
const API_URL = "https://backend-omar-5d89.onrender.com/api/categories-lvl4";

const getCategoriesLvl4 = async () => {
  try {
    const response = await get_All(API_URL);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching level 4 categories:", error);
    throw error;
  }
};

const getCategoryLvl4ById = async (id) => {
  try {
    const response = await get_All(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching category level 4 with id ${id}:`, error);
    throw error;
  }
};

export const categoryLvl4Service = {
  getCategoriesLvl4,
  getCategoryLvl4ById,
  getCategoryLvl4BySlug: async (slug) => {
    try {
      const base = API_URL.replace(/\/categories-lvl4$/, "");
      const response = await get_All(
        `${base}/categories-lvl4/by-slug/${encodeURIComponent(slug)}`,
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error fetching category level 4 with slug ${slug}:`,
        error,
      );
      throw error;
    }
  },
};
