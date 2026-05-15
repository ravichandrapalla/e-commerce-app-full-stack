import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsApi } from "../../services/admin.service";

export const useDashboardStats = () =>
  useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await getDashboardStatsApi();
      return res.data;
    },
  });
