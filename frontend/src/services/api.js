import axios from "axios";

const api = axios.create({
  baseURL: "http://107.20.129.72:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;