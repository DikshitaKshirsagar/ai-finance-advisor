export interface CategorySpend {
  category: string;
  amount: number;
}

export interface CategoryBreakdownResponse {
  categories: CategorySpend[];
}