import api from "./axiosClient";
import type { SavingsGoalRequest, AddContributionRequest, SavingsGoalResponse } from "../types/savingsGoal";

export const getSavingsGoals = async (): Promise<SavingsGoalResponse[]> => {
  const response = await api.get<SavingsGoalResponse[]>("/savings-goals");
  return response.data;
};

export const createSavingsGoal = async (data: SavingsGoalRequest): Promise<SavingsGoalResponse> => {
  const response = await api.post<SavingsGoalResponse>("/savings-goals", data);
  return response.data;
};

export const addContribution = async (id: number, data: AddContributionRequest): Promise<SavingsGoalResponse> => {
  const response = await api.post<SavingsGoalResponse>(`/savings-goals/${id}/contribute`, data);
  return response.data;
};

export const deleteSavingsGoal = async (id: number): Promise<void> => {
  await api.delete(`/savings-goals/${id}`);
};