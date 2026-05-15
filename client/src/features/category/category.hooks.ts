import { useQuery } from "@tanstack/react-query";
import { getCategoriesApi } from "../../services/category.service";

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getCategoriesApi();
      return res.data;
    },
  });
