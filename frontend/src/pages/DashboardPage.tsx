import { useEffect, useState } from "react";
import { getDashboard } from "../api/dashboardApi";
import type { DashboardResponse } from "../types/dashboard";
import Navbar from "../components/Navbar";

function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

    fetchDashboard();
  }, []);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            {now.toLocaleString("default", { month: "long" })} {year}
          </p>
        </div>

        {loading && <p className="text-gray-500">Loading dashboard...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(data.totalBudgetSpent)}
                <span className="text-sm text-gray-400 font-normal">
                  {" "}/ {formatCurrency(data.totalBudgetLimit)}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;