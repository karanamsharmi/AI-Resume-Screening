import axios from "axios";

const api = axios.create({
  baseURL: "http://54.234.71.29:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;