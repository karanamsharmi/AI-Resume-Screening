import axios from "axios";

const defaultBaseURL = typeof window !== "undefined"
  ? `${window.location.protocol}//${window.location.hostname}:8000`
  : "http://localhost:8000";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || defaultBaseURL,
});

// Add auth token automatically and preserve FormData uploads.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers = config.headers || {};

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

export default api;
