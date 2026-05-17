import axios from "axios";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    const message = response?.data?.message || "";
    if (message) toast.success(message);
    return Promise.resolve(response);
  },

  (error) => {
    const message =
      error.response?.data?.message ??
      (error.code === "ERR_NETWORK"
        ? "Cannot reach the API server. Start it with: cd server && npm run dev"
        : "Something went wrong");

    toast.error(message);

    return Promise.reject(error);
  },
);
