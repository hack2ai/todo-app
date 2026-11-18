import { useState, useEffect, useCallback } from "react";
import todoService from "../services/todoService";

const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ pending: 0, "in-progress": 0, completed: 0, total: 0 });
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: "", status: "", priority: "", page: 1, limit: 10 });

  const clearError = () => setError(null);

  // Fetch todos with current filters
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Strip empty filter values before sending
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== "")
      );
      const data = await todoService.getAll(params);
      setTodos(data.todos);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch summary stats
  const fetchStats = useCallback(async () => {
    try {
      const data = await todoService.getStats();
      setStats(data.stats);
    } catch (err) {
      console.error("Failed to fetch stats:", err.message);
    }
  }, []);

  // Refetch both todos and stats
  const refresh = useCallback(() => {
    fetchTodos();
    fetchStats();
  }, [fetchTodos, fetchStats]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Create a new todo
  const createTodo = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await todoService.create(data);
      refresh();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update a todo
  const updateTodo = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await todoService.update(id, data);
      setTodos((prev) => prev.map((t) => (t._id === id ? result.todo : t)));
      fetchStats();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Toggle/update status only
  const updateStatus = async (id, status) => {
    setError(null);
    try {
      const result = await todoService.updateStatus(id, status);
      setTodos((prev) => prev.map((t) => (t._id === id ? result.todo : t)));
      fetchStats();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    setError(null);
    try {
      await todoService.delete(id);
      setTodos((prev) => prev.filter((t) => t._id !== id));
      fetchStats();
    } catch (err) {
      setError(err.message);
    }
  };

  return {
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
    refresh,
  };
};

export default useTodos;
