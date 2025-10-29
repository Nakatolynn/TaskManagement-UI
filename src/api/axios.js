import axios from "axios";
import { API_URL } from "./apiConstant";

const axiosService = axios.create({
  baseURL: API_URL,
});
axiosService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosService;
