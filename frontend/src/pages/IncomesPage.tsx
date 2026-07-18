import { useEffect, useState } from "react";
import { getIncomes, createIncome, deleteIncome } from "../api/incomeApi";
import type { IncomeResponse } from "../types/income";
import Navbar from "../components/Navbar";

function IncomesPage() {
  const [incomes, setIncomes] = useState<IncomeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [incomeDate, setIncomeDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadIncomes = async () => {
    try {
      const data = await getIncomes();
      setIncomes(data);
    } catch (err) {
      setError("Failed to load incomes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncomes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await createIncome({
        source,
        amount: parseFloat(amount),
        description,
        incomeDate,
      });
      setSource("");
      setAmount("");
      setDescription("");
      setIncomeDate("");
      loadIncomes();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add income.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteIncome(id);
      loadIncomes();
    } catch (err) {
      setError("Failed to delete income.");
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Income</h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Income</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
                placeholder="e.g. Salary, Freelance, Business"
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
                value={incomeDate}
                onChange={(e) => setIncomeDate(e.target.value)}
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
                {submitting ? "Adding..." : "Add Income"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 p-6 pb-0">All Income</h2>

          {loading && <p className="text-gray-500 p-6">Loading...</p>}

          {!loading && incomes.length === 0 && (
            <p className="text-gray-500 p-6">No income records yet. Add your first one above.</p>
          )}

          <div className="divide-y divide-gray-100">
            {incomes.map((income) => (
              <div key={income.id} className="flex justify-between items-center p-4">
                <div>
                  <p className="font-medium text-gray-800">{income.source}</p>
                  <p className="text-sm text-gray-500">
                    {income.incomeDate} {income.description && `• ${income.description}`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-green-600">{formatCurrency(income.amount)}</p>
                  <button
                    onClick={() => handleDelete(income.id)}
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

export default IncomesPage;