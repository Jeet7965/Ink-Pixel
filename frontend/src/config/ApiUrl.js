import axios from "axios";
import { useNavigate } from "react-router";
const navigate = useNavigate();

const api = axios.create({
  baseURL: "https://inkandpixel.onrender.com",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🔹 Auto logout when token expires (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Remove token from localStorage
      // alert("Session expired. Please login again.");
      localStorage.removeItem("token");
      // Redirect to login page
      navigate("/login"); 
    }

    return Promise.reject(error);
  }
);

export default api;
