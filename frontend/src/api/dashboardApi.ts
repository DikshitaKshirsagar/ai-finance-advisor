import api from "./axiosClient";
import type { DashboardResponse } from "../types/dashboard";
import type { InsightResponse } from "../types/insight";
import type { CategoryBreakdownResponse } from "../types/categoryBreakdown";

export const getDashboard = async (month: number, year: number): Promise<DashboardResponse> => {
  const response = await api.get<DashboardResponse>(`/dashboard?month=${month}&year=${year}`);
  return response.data;
};

export const getInsight = async (month: number, year: number): Promise<InsightResponse> => {
  const response = await api.get<InsightResponse>(`/dashboard/insight?month=${month}&year=${year}`);
  return response.data;
};

export const getCategoryBreakdown = async (month: number, year: number): Promise<CategoryBreakdownResponse> => {
  const response = await api.get<CategoryBreakdownResponse>(`/dashboard/category-breakdown?month=${month}&year=${year}`);
  return response.data;
};