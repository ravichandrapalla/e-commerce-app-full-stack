import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getSelfApi,
  loginApi,
  logoutApi,
  registerApi,
} from "../../services/auth.service";

export const useRegister = () => {
  useMutation({
    mutationFn: registerApi,
  });
};

export const useLogin = () => {
  useMutation({
    mutationFn: loginApi,
  });
};

export const useLogout = () => {
  useMutation({
    mutationFn: logoutApi,
  });
};

export const useSelf = () => {
  useQuery({
    queryKey: ["self"],
    queryFn: async () => {
      const res = await getSelfApi();
      return res.data.user;
    },
    retry: false,
  });
};
