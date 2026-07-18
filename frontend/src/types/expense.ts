export interface ExpenseRequest {
  category: string;
  amount: number;
  description?: string;
  expenseDate: string;
}

export interface ExpenseResponse {
  id: number;
  category: string;
  amount: number;
  description?: string;
  expenseDate: string;
  createdAt: string;
}