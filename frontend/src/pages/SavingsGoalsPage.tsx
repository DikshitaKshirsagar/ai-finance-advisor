import { useEffect, useState } from "react";
import { getSavingsGoals, createSavingsGoal, addContribution, deleteSavingsGoal } from "../api/savingsGoalApi";
import type { SavingsGoalResponse } from "../types/savingsGoal";
import Navbar from "../components/Navbar";

function SavingsGoalsPage() {
  const [goals, setGoals] = useState<SavingsGoalResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [contributionInputs, setContributionInputs] = useState<Record<number, string>>({});

  const loadGoals = async () => {
    try {
      const data = await getSavingsGoals();
      setGoals(data);
    } catch (err) {
      setError("Failed to load savings goals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await createSavingsGoal({
        goalName,
        targetAmount: parseFloat(targetAmount),
        targetDate: targetDate || undefined,
      });
      setGoalName("");
      setTargetAmount("");
      setTargetDate("");
      loadGoals();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add goal.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleContribute = async (id: number) => {
    const amount = contributionInputs[id];
    if (!amount || parseFloat(amount) <= 0) return;

    try {
      await addContribution(id, { amount: parseFloat(amount) });
      setContributionInputs({ ...contributionInputs, [id]: "" });
      loadGoals();
    } catch (err) {
      setError("Failed to add contribution.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSavingsGoal(id);
      loadGoals();
    } catch (err) {
      setError("Failed to delete goal.");
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Savings Goals</h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Create Goal</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                required
                placeholder="e.g. Buy Car"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
              <input
                type="number"
                step="0.01"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Date (optional)</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-purple-600 text-white py-2 rounded-md font-medium hover:bg-purple-700 disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Goal"}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {loading && <p className="text-gray-500">Loading...</p>}

          {!loading && goals.length === 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
              No savings goals yet. Create one above.
            </div>
          )}

          {goals.map((goal) => (
            <div key={goal.id} className="bg-white p-5 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-800">
                    {goal.goalName} {goal.completed && "🎉"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                    {goal.targetDate && ` • Target: ${goal.targetDate}`}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(goal.id)}
                  className="text-gray-400 hover:text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                <div
                  className={`h-2.5 rounded-full ${
                    goal.completed ? "bg-green-500" : "bg-purple-500"
                  }`}
                  style={{ width: `${goal.progressPercent}%` }}
                ></div>
              </div>

              {!goal.completed && (
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Add amount"
                    value={contributionInputs[goal.id] || ""}
                    onChange={(e) =>
                      setContributionInputs({ ...contributionInputs, [goal.id]: e.target.value })
                    }
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={() => handleContribute(goal.id)}
                    className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-purple-200"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SavingsGoalsPage;