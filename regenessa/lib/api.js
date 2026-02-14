import axios from "axios";

const api = axios.create({
  baseURL: "https://regenessa-backend.onrender.com/api",
  // baseURL: "http://localhost:5000/api",
});

// This automatically attaches JWT token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
