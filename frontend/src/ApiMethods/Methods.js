import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Add token automatically if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Handle API response errors in a cleaner way
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Something went wrong!";
    if (error.response) {
      message =
        error.response.data?.error ||
        error.response.data?.message ||
        message;
    } else if (error.request) {
      message = "No response from server. Please try again.";
    } else {
      message = error.message;
    }
    return Promise.reject({ message, status: error.response?.status });
  }
);

// ✅ Helper functions
export const getRequest = async (url, params = {}) => {
  const res = await api.get(url, { params });
  return res.data;
};

export const postRequest = async (url, data = {}) => {
  const res = await api.post(url, data);
  return res.data;
};

export const putRequest = async (url, data = {}) => {
  const res = await api.put(url, data);
  return res.data;
};

export const deleteRequest = async (url) => {
  const res = await api.delete(url);
  return res.data;
};

// ✅ Export all methods as an object (optional)
const Methods = { getRequest, postRequest, putRequest, deleteRequest };
export default Methods;
