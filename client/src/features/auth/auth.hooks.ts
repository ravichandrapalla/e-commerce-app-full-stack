import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getSelfApi,
  loginApi,
  logoutApi,
  registerApi,
  resendVerificationApi,
  updateProfileApi,
  verifyEmailApi,
} from "../../services/auth.service";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerApi,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginApi,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logoutApi,
  });
};

export const useSelf = () => {
  return useQuery({
    queryKey: ["self"],
    queryFn: async () => {
      const res = await getSelfApi();
      return res.data.user;
    },
    retry: false,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfileApi,
  });
};

export const useVerifyEmail = () =>
  useMutation({
    mutationFn: (token: string) => verifyEmailApi(token),
  });

export const useResendVerification = () =>
  useMutation({
    mutationFn: (email: string) => resendVerificationApi(email),
  });
