import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProductApi,
  getProductsApi,
  updateProductApi,
} from "../../services/product.service";
import type { ProductSearchParams, ProductUpdateInput } from "../../types/ecommerce";

export const useProducts = (params: ProductSearchParams) =>
  useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const res = await getProductsApi(params);
      return res.data;
    },
  });

export const useCreateProduct = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createProductApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["seller-products"] });
      qc.invalidateQueries({ queryKey: ["seller-stats"] });
      qc.invalidateQueries({ queryKey: ["admin-pending-approvals"] });
    },
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: ProductUpdateInput;
    }) => {
      const res = await updateProductApi(id, data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["seller-products"] });
      qc.invalidateQueries({ queryKey: ["seller-stats"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      qc.invalidateQueries({ queryKey: ["admin-pending-approvals"] });
      qc.invalidateQueries({ queryKey: ["admin-catalog-products"] });
    },
  });
};
