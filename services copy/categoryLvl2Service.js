import { get_All, post } from "../functions/restApi";

// const urlBase = "http://localhost:5000/api";
const urlBase = "https://backend-omar-5d89.onrender.com/api";

const getCategoriesLvl2 = async () => {
  try {
    const response = await get_All(`${urlBase}/categories-lvl2`);
    // The backend sends data in a { success: true, data: [...] } format
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching level 2 categories:", error);
    throw error;
  }
};

const getCategoriesByIds = async (ids) => {
  try {
    const response = await post(`${urlBase}/categories-lvl2/by-ids`, { ids });
    return response.data; // Assuming the backend returns the data directly
  } catch (error) {
    console.error("Error fetching level 2 categories by IDs:", error);
    throw error;
  }
};

const getCategoryLvl2BySlug = async (slug) => {
  try {
    const response = await get_All(
      `${urlBase}/categories-lvl2/by-slug/${encodeURIComponent(slug)}`,
    );
    return response.data; // backend returns the category document
  } catch (error) {
    console.error(`Error fetching level 2 category by slug ${slug}:`, error);
    throw error;
  }
};

export const categoryLvl2Service = {
  getCategoriesLvl2,
  getCategoriesByIds,
  getCategoryLvl2BySlug,
};
