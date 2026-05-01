import { api } from "../lib/axios";

type registerPayloadType = {
  name: string;
  email: string;
  password: string;
};

type loginPayloadType = {
  email: string;
  password: string;
};

export const registerApi = (data: registerPayloadType) => {
  return api.post("/auth/register", data);
};

export const loginApi = (data: loginPayloadType) => {
  return api.post("/auth/login", data);
};

export const logoutApi = () => {
  return api.post("/auth/logout");
};

export const getSelfApi = () => {
  return api.get("/auth/self");
};
