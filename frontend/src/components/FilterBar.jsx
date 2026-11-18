import { useState } from "react";

const FilterBar = ({ filters, onFilterChange }) => {
  const [searchInput, setSearchInput] = useState(filters.search || "");

  // Debounce search: only fire after user stops typing
  let debounceTimer;
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      onFilterChange({ search: value, page: 1 });
    }, 400);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value, page: 1 });
  };

  const handleReset = () => {
    setSearchInput("");
    onFilterChange({ search: "", status: "", priority: "", page: 1 });
  };

  const hasActiveFilters = searchInput || filters.status || filters.priority;

  return (
    <div className="filter-bar">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search tasks…"
          className="search-input"
          aria-label="Search tasks"
        />
      </div>

      <select
        name="status"
        value={filters.status}
        onChange={handleChange}
        className="filter-select"
        aria-label="Filter by status"
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <select
        name="priority"
        value={filters.priority}
        onChange={handleChange}
        className="filter-select"
        aria-label="Filter by priority"
      >
        <option value="">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      {hasActiveFilters && (
        <button className="btn btn-secondary btn-sm" onClick={handleReset}>
          Clear Filters ✕
        </button>
      )}
    </div>
  );
};

export default FilterBar;
