import { api } from "../lib/axios";

export const getDashboardStatsApi = () => api.get("/admin/stats");
