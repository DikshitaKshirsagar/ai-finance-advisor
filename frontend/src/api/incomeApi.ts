import api from "./axiosClient";
import type { IncomeRequest, IncomeResponse } from "../types/income";

export const getIncomes = async (): Promise<IncomeResponse[]> => {
  const response = await api.get<IncomeResponse[]>("/incomes");
  return response.data;
};

export const createIncome = async (data: IncomeRequest): Promise<IncomeResponse> => {
  const response = await api.post<IncomeResponse>("/incomes", data);
  return response.data;
};

export const deleteIncome = async (id: number): Promise<void> => {
  await api.delete(`/incomes/${id}`);
};