import axios from "axios";

// The base URL for the backend API
// const API_URL = "https://backend-omar-90dc.onrender.com/api/sliders";
const API_URL = "https://backend-omar-5d89.onrender.com/api/sliders";

/**
 * Fetches all slider images from the backend.
 * @returns {Promise<Array>} A promise that resolves to an array of slider objects.
 */
export const getSliders = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching sliders:", error);
    // Return an empty array or re-throw the error, depending on desired error handling
    return [];
  }
};

const sliderService = {
  getSliders,
};

export default sliderService;
