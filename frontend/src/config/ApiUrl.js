import axios from "axios";

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: "https://inkandpixel.onrender.com",
  withCredentials: true,
});

// 🔹 Request interceptor (access token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔹 Response interceptor (AUTO REFRESH)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // 🔥 CALL REFRESH API (cookie auto sent)
        const res = await axios.post(
          "https://inkandpixel.onrender.com/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;

        // store new token
        localStorage.setItem("token", newToken);

        // retry original request
        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return api(originalRequest);

      } catch (err) {
        // refresh failed → logout
        localStorage.removeItem("token");
        localStorage.removeItem("USER_ID");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
