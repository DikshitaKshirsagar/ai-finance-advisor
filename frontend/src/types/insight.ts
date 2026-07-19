export interface InsightItem {
  type: string;
  title: string;
  message: string;
}

export interface InsightResponse {
  insights: InsightItem[];
}