import axios from "axios";

const api = axios.create({
  baseURL: "https://vue-goods-service.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
