export interface SavingsGoalRequest {
  goalName: string;
  targetAmount: number;
  targetDate?: string;
}

export interface AddContributionRequest {
  amount: number;
}

export interface SavingsGoalResponse {
  id: number;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  progressPercent: number;
  completed: boolean;
}