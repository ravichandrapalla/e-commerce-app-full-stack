import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true, // so for httponly cookies this commange keeps a ckeck for auth cookie
});
