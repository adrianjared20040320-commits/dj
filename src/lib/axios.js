import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 15000, // Segundos
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// INTERCEPTOR REQUEST
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// INTERCEPTOR RESPONSE
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expirado → redirigir a login
    if (error.response?.status === 401) {
      const isAdminRoute = window.location.pathname.startsWith("/admin");
      if (isAdminRoute) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
