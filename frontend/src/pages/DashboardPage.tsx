import { useEffect, useState } from "react";
import { getDashboard, getInsight, getCategoryBreakdown } from "../api/dashboardApi";
import type { DashboardResponse } from "../types/dashboard";
import type { InsightItem } from "../types/insight";
import type { CategorySpend } from "../types/categoryBreakdown";
import Navbar from "../components/Navbar";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const insightStyles: Record<string, { bg: string; border: string; icon: string; label: string }> = {
  warning: { bg: "bg-red-50", border: "border-red-200", icon: "⚠️", label: "text-red-700" },
  praise: { bg: "bg-green-50", border: "border-green-200", icon: "🎉", label: "text-green-700" },
  trend: { bg: "bg-blue-50", border: "border-blue-200", icon: "📊", label: "text-blue-700" },
  tip: { bg: "bg-purple-50", border: "border-purple-200", icon: "💡", label: "text-purple-700" },
};

const CHART_COLORS = ["#9333ea", "#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#ec4899", "#6366f1"];

function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [insightLoading, setInsightLoading] = useState(true);

  const [categories, setCategories] = useState<CategorySpend[]>([]);
  const [chartLoading, setChartLoading] = useState(true);

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await getDashboard(month, year);
        setData(result);
      } catch (err: any) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    const fetchInsight = async () => {
      try {
        const result = await getInsight(month, year);
        setInsights(result.insights || []);
      } catch (err) {
        setInsights([]);
      } finally {
        setInsightLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const result = await getCategoryBreakdown(month, year);
        setCategories(result.categories || []);
      } catch (err) {
        setCategories([]);
      } finally {
        setChartLoading(false);
      }
    };

    fetchDashboard();
    fetchInsight();
    fetchCategories();
  }, []);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pb-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            {now.toLocaleString("default", { month: "long" })} {year}
          </p>
        </div>

        {loading && <p className="text-gray-500">Loading dashboard...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-5 rounded-lg shadow-md">
              <p className="text-sm text-gray-500 mb-1">Total Income</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(data.totalIncome)}
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-md">
              <p className="text-sm text-gray-500 mb-1">Total Expense</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(data.totalExpense)}
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-md">
              <p className="text-sm text-gray-500 mb-1">Savings</p>
              <p
                className={`text-2xl font-bold ${
                  data.totalSavings >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(data.totalSavings)}
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-md">
              <p className="text-sm text-gray-500 mb-1">Budget Used</p>
              <p className="text-2xl font-bold text-purple-600 whitespace-nowrap">
                {formatCurrency(data.totalBudgetSpent)}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                of {formatCurrency(data.totalBudgetLimit)} limit
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-1 bg-white p-5 rounded-lg shadow-md">
            <p className="text-sm font-semibold text-gray-700 mb-3">Spending by Category</p>
            {chartLoading ? (
              <div className="h-52 flex items-center justify-center text-gray-400 text-sm">
                Loading chart...
              </div>
            ) : categories.length === 0 ? (
              <div className="h-52 flex items-center justify-center text-gray-400 text-sm text-center px-4">
                No expenses recorded this month yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {categories.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">✨</span>
              <h2 className="text-lg font-semibold text-gray-800">AI Insights</h2>
            </div>

            {insightLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : insights.length === 0 ? (
              <div className="bg-white p-5 rounded-lg shadow-sm text-gray-500 text-sm">
                No insights available yet. Add some expenses to get personalized advice.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {insights.map((item, idx) => {
                  const style = insightStyles[item.type] || insightStyles.tip;
                  return (
                    <div
                      key={idx}
                      className={`${style.bg} ${style.border} border rounded-lg p-4 shadow-sm transition-transform hover:-translate-y-0.5`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span>{style.icon}</span>
                        <p className={`font-semibold text-sm ${style.label}`}>{item.title}</p>
                      </div>
                      <p className="text-sm text-gray-600 leading-snug">{item.message}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;