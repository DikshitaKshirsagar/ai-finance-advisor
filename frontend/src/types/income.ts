export interface IncomeRequest {
  source: string;
  amount: number;
  description?: string;
  incomeDate: string;
}

export interface IncomeResponse {
  id: number;
  source: string;
  amount: number;
  description?: string;
  incomeDate: string;
  createdAt: string;
}