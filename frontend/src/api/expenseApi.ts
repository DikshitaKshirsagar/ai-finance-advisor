import api from "./axiosClient";
import type { ExpenseRequest, ExpenseResponse } from "../types/expense";

export const getExpenses = async (): Promise<ExpenseResponse[]> => {
  const response = await api.get<ExpenseResponse[]>("/expenses");
  return response.data;
};

export const createExpense = async (data: ExpenseRequest): Promise<ExpenseResponse> => {
  const response = await api.post<ExpenseResponse>("/expenses", data);
  return response.data;
};

export const deleteExpense = async (id: number): Promise<void> => {
  await api.delete(`/expenses/${id}`);
};