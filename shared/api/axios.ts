import axios from "axios";

const API_BASE_URL = "https://api.kisna.com/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30 * 1000,
});

export default api;