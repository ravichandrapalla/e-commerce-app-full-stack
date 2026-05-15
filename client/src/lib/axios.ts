import axios from "axios";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const message = error.response?.data?.message || "Something went wrong";

    toast.error(message);

    return Promise.reject(error);
  },
);
