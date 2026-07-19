import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      location.pathname === path
        ? "bg-purple-100 text-purple-700"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <nav className="bg-white shadow-sm mb-6">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-1 flex-wrap">
          <span className="font-bold text-purple-600 mr-4">FinanceAdvisor</span>
          <Link to="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link>
          <Link to="/expenses" className={linkClass("/expenses")}>Expenses</Link>
          <Link to="/incomes" className={linkClass("/incomes")}>Income</Link>
          <Link to="/budgets" className={linkClass("/budgets")}>Budgets</Link>
          <Link to="/savings-goals" className={linkClass("/savings-goals")}>Goals</Link>
          <Link to="/chat" className={linkClass("/chat")}>✨ AI Chat</Link>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;