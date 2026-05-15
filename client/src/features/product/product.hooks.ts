import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createProductApi,
  getProductsApi,
} from "../../services/product.service";

export const useProducts = (params: any) =>
  useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const res = await getProductsApi(params);
      return res.data;
    },
  });

export const useCreateProduct = () =>
  useMutation({
    mutationFn: createProductApi,
  });
