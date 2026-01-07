import { useState, useEffect } from "react";
import ExpenseList from "./components/ExpenseList";
import ExpenseForm from "./components/ExpenseForm";
import { api } from "./services/api";
import type { Expense, ExpenseFormData } from "./types";

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [view, setView] = useState<"list" | "form">("list");
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await api.getExpenses();
      setExpenses(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingExpense(undefined);
    setView("form");
  };

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setView("form");
  };

  const handleFormSubmit = async (data: ExpenseFormData): Promise<void> => {
    try {
      if (editingExpense) {
        await api.updateExpense(editingExpense.id, data);
      } else {
        await api.createExpense(data);
      }
      await loadExpenses();
      setView("list");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert("Failed to delete expense: " + (err as Error).message);
    }
  };

  return (
    <div className="container">
      <h1
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          color: "var(--primary)",
        }}
      >
        💰 Expense Tracker
      </h1>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: "1rem" }}>
          {error}
          <button
            onClick={loadExpenses}
            style={{
              marginLeft: "1rem",
              padding: "0.2rem 0.5rem",
              fontSize: "0.8rem",
            }}
            className="btn-secondary"
          >
            Retry
          </button>
          <br />
          <small>
            Ensure the backend is running at http://localhost:8000/api or update
            src/services/api.ts
          </small>
        </div>
      )}

      {loading && view === "list" ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
      ) : view === "list" ? (
        <ExpenseList
          expenses={expenses}
          onAdd={handleAddClick}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      ) : (
        <ExpenseForm
          initialData={editingExpense}
          onSubmit={handleFormSubmit}
          onCancel={() => setView("list")}
        />
      )}
    </div>
  );
}

export default App;
