import { get_All } from "../functions/restApi";

// const urlBase = "http://localhost:5000/api";
const urlBase = "https://backend-omar-5d89.onrender.com/api";

const getLogoSliders = async () => {
  try {
    const response = await get_All(`${urlBase}/logo-sliders`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching logo sliders:", error);
    return [];
  }
};

export const logoSliderService = {
  getLogoSliders,
};
