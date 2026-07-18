import { useEffect, useState } from "react";
import { getExpenses, createExpense, deleteExpense } from "../api/expenseApi";
import type { ExpenseResponse } from "../types/expense";
import Navbar from "../components/Navbar";

function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      setError("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await createExpense({
        category,
        amount: parseFloat(amount),
        description,
        expenseDate,
      });
      setCategory("");
      setAmount("");
      setDescription("");
      setExpenseDate("");
      loadExpenses();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add expense.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteExpense(id);
      loadExpenses();
    } catch (err) {
      setError("Failed to delete expense.");
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Expenses</h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Expense</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                placeholder="e.g. Food, Rent, Fuel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-purple-600 text-white py-2 rounded-md font-medium hover:bg-purple-700 disabled:opacity-50"
              >
                {submitting ? "Adding..." : "Add Expense"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 p-6 pb-0">All Expenses</h2>

          {loading && <p className="text-gray-500 p-6">Loading...</p>}

          {!loading && expenses.length === 0 && (
            <p className="text-gray-500 p-6">No expenses yet. Add your first one above.</p>
          )}

          <div className="divide-y divide-gray-100">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex justify-between items-center p-4">
                <div>
                  <p className="font-medium text-gray-800">{expense.category}</p>
                  <p className="text-sm text-gray-500">
                    {expense.expenseDate} {expense.description && `• ${expense.description}`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-red-600">{formatCurrency(expense.amount)}</p>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="text-gray-400 hover:text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpensesPage;