import axios from "axios";

export const post = async (url, data) => {
  try {
    const res = await axios.post(url, data);
    return res; // Toujours retourner la réponse, même si res.data est undefined
  } catch (error) {
    console.error("Error in post request:", error);
    throw error; // Lancer l'erreur au lieu de retourner undefined
  }
};

export const update = async (url, data) => {
  try {
    const res = await axios.patch(url, data);
    return res;
  } catch (error) {
    console.error("Error in patch request:", error);
    throw error;
  }
};

export const update_put = async (url, data, headers) => {
  try {
    let res;

    if (headers) {
      res = await axios.put(url, data, { headers });
    } else {
      res = await axios.put(url, data);
    }

    return res;
  } catch (error) {
    console.error("Error in put request:", error);
    throw error;
  }
};

export const get_All = async (url) => {
  try {
    const res = await axios.get(url);
    return res;
  } catch (error) {
    console.error("Error in get request:", error);
    throw error;
  }
};

export const deleteApi = async (url) => {
  try {
    const res = await axios.delete(url);
    return res;
  } catch (error) {
    console.error("Error in delete request:", error);
    throw error;
  }
};
