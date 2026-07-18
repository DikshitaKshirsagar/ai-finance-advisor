export interface BudgetRequest {
  category: string;
  limitAmount: number;
  month: number;
  year: number;
}

export interface BudgetResponse {
  id: number;
  category: string;
  limitAmount: number;
  month: number;
  year: number;
  spentAmount: number;
  remainingAmount: number;
  overBudget: boolean;
}