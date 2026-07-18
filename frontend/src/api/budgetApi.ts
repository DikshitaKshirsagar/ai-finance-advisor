import api from "./axiosClient";
import type { BudgetRequest, BudgetResponse } from "../types/budget";

export const getBudgets = async (month: number, year: number): Promise<BudgetResponse[]> => {
  const response = await api.get<BudgetResponse[]>(`/budgets?month=${month}&year=${year}`);
  return response.data;
};

export const createBudget = async (data: BudgetRequest): Promise<BudgetResponse> => {
  const response = await api.post<BudgetResponse>("/budgets", data);
  return response.data;
};

export const deleteBudget = async (id: number): Promise<void> => {
  await api.delete(`/budgets/${id}`);
};