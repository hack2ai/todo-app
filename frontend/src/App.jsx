import { useState } from "react";
import useTodos from "./hooks/useTodos";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";
import FilterBar from "./components/FilterBar";
import StatsBar from "./components/StatsBar";
import "./App.css";

const App = () => {
  const {
    todos,
    stats,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    clearError,
    createTodo,
    updateTodo,
    updateStatus,
    deleteTodo,
  } = useTodos();

  const [editingTodo, setEditingTodo] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSubmit = async (data) => {
    let success;
    if (editingTodo) {
      success = await updateTodo(editingTodo._id, data);
      if (success) {
        setEditingTodo(null);
        setShowForm(false);
      }
    } else {
      success = await createTodo(data);
      if (success) setShowForm(false);
    }
    return success;
  };

  const handleCancel = () => {
    setEditingTodo(null);
    setShowForm(false);
    clearError();
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>✅ My To-Do List</h1>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingTodo(null);
              setShowForm((v) => !v);
            }}
          >
            {showForm && !editingTodo ? "✕ Cancel" : "+ Add Task"}
          </button>
        </div>
      </header>

      <main className="app-main">
        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Error Banner */}
        {error && (
          <div className="error-banner" role="alert">
            <span>⚠️ {error}</span>
            <button onClick={clearError} aria-label="Dismiss error">✕</button>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <section className="form-section">
            <TodoForm
              onSubmit={handleFormSubmit}
              initialData={editingTodo}
              onCancel={handleCancel}
              loading={loading}
            />
          </section>
        )}

        {/* Filters */}
        <section className="list-section">
          <FilterBar filters={filters} onFilterChange={handleFilterChange} />

          {/* Loading */}
          {loading && <div className="loading-spinner">Loading tasks…</div>}

          {/* Empty state */}
          {!loading && todos.length === 0 && (
            <div className="empty-state">
              <p>🗒️ No tasks found.</p>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                Add your first task
              </button>
            </div>
          )}

          {/* Todo list */}
          {!loading && todos.length > 0 && (
            <>
              <p className="result-count">
                Showing {todos.length} of {pagination.total} task{pagination.total !== 1 ? "s" : ""}
              </p>
              <ul className="todo-list">
                {todos.map((todo) => (
                  <li key={todo._id}>
                    <TodoItem
                      todo={todo}
                      onEdit={handleEdit}
                      onDelete={deleteTodo}
                      onStatusChange={updateStatus}
                    />
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={pagination.page <= 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    ← Prev
                  </button>
                  <span>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
