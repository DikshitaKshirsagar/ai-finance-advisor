import api from "./axiosClient";
import type { DashboardResponse } from "../types/dashboard";

export const getDashboard = async (month: number, year: number): Promise<DashboardResponse> => {
  const response = await api.get<DashboardResponse>(`/dashboard?month=${month}&year=${year}`);
  return response.data;
};