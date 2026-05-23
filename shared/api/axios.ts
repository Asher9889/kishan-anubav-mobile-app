import axios from "axios";

const API_BASE_URL = "https://krishianubhav.mssplonline.in";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30 * 1000,
});

// Add a response interceptor
api.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    console.log("API Error:",error.response?.data);
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    throw error.response?.data.message || error.message || "An unknown error occurred";
  }
);

export default api;