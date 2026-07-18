import { useEffect, useState } from "react";
import { getBudgets, createBudget, deleteBudget } from "../api/budgetApi";
import type { BudgetResponse } from "../types/budget";
import Navbar from "../components/Navbar";

function BudgetsPage() {
  const [budgets, setBudgets] = useState<BudgetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [category, setCategory] = useState("");
  const [limitAmount, setLimitAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadBudgets = async () => {
    try {
      const data = await getBudgets(currentMonth, currentYear);
      setBudgets(data);
    } catch (err) {
      setError("Failed to load budgets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await createBudget({
        category,
        limitAmount: parseFloat(limitAmount),
        month: currentMonth,
        year: currentYear,
      });
      setCategory("");
      setLimitAmount("");
      loadBudgets();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add budget.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBudget(id);
      loadBudgets();
    } catch (err) {
      setError("Failed to delete budget.");
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Budgets</h1>
          <p className="text-gray-500 text-sm mt-1">
            {now.toLocaleString("default", { month: "long" })} {currentYear}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Set Budget</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                placeholder="e.g. Food, Shopping"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Limit Amount</label>
              <input
                type="number"
                step="0.01"
                value={limitAmount}
                onChange={(e) => setLimitAmount(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-purple-600 text-white py-2 rounded-md font-medium hover:bg-purple-700 disabled:opacity-50"
              >
                {submitting ? "Adding..." : "Set Budget"}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {loading && <p className="text-gray-500">Loading...</p>}

          {!loading && budgets.length === 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
              No budgets set for this month yet. Add one above.
            </div>
          )}

          {budgets.map((budget) => {
            const percentUsed = budget.limitAmount > 0
              ? Math.min((budget.spentAmount / budget.limitAmount) * 100, 100)
              : 0;

            return (
              <div key={budget.id} className="bg-white p-5 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{budget.category}</p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(budget.spentAmount)} of {formatCurrency(budget.limitAmount)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="text-gray-400 hover:text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div
                    className={`h-2.5 rounded-full ${
                      budget.overBudget ? "bg-red-500" : "bg-purple-500"
                    }`}
                    style={{ width: `${percentUsed}%` }}
                  ></div>
                </div>

                {budget.overBudget ? (
                  <p className="text-sm text-red-600 font-medium">
                    ⚠ Over budget by {formatCurrency(Math.abs(budget.remainingAmount))}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    {formatCurrency(budget.remainingAmount)} remaining
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default BudgetsPage;