import { useAuthStore } from "@/features/auth/store/auth.store";
import axios from "axios";

const API_BASE_URL = "https://krishianubhav.mssplonline.in";
const NODE_API_BASE_URL = "http://10.0.2.2:4500/api/v1"; // Change this to your Node.js server URL in development
// const NODE_API_BASE_URL = "http://160.25.62.109:8222/api/v1"; // Change this to your Node.js server URL in development


const nodeApi = axios.create({
  baseURL: NODE_API_BASE_URL,
  timeout: 30 * 1000,
})


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60 * 1000,
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

// adding bearer token to nodeApi requests
nodeApi.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  }
);

nodeApi.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    console.log("API Error:",error.response?.data);
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    let err =  error.response?.data?.message || error.response?.data.message || "An unknown error occurred";
    throw new Error(err);
  }
);




export default api;

export { nodeApi };
