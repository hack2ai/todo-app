const STATUS_CYCLE = { pending: "in-progress", "in-progress": "completed", completed: "pending" };

const PRIORITY_COLORS = { low: "#22c55e", medium: "#f59e0b", high: "#ef4444" };

const TodoItem = ({ todo, onEdit, onDelete, onStatusChange }) => {
  const { _id, title, description, status, priority, dueDate, createdAt } = todo;

  const isOverdue =
    dueDate &&
    status !== "completed" &&
    new Date(dueDate) < new Date();

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("en-IN") : "—";

  const handleStatusToggle = () => {
    const nextStatus = STATUS_CYCLE[status];
    onStatusChange(_id, nextStatus);
  };

  return (
    <div className={`todo-item todo-item--${status} ${isOverdue ? "todo-item--overdue" : ""}`}>
      {/* Priority indicator */}
      <span
        className="priority-dot"
        style={{ background: PRIORITY_COLORS[priority] }}
        title={`Priority: ${priority}`}
      />

      {/* Content */}
      <div className="todo-content">
        <h3 className="todo-title">{title}</h3>
        {description && <p className="todo-description">{description}</p>}

        <div className="todo-meta">
          <span className={`status-badge status-badge--${status}`}>
            {status.replace("-", " ")}
          </span>
          <span className={`priority-badge priority-badge--${priority}`}>
            {priority}
          </span>
          {dueDate && (
            <span className={`due-date ${isOverdue ? "due-date--overdue" : ""}`}>
              Due: {formatDate(dueDate)}
              {isOverdue && " ⚠️"}
            </span>
          )}
          <span className="created-at">Added: {formatDate(createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="todo-actions">
        <button
          className="btn-icon btn-status"
          onClick={handleStatusToggle}
          title={`Mark as ${STATUS_CYCLE[status]}`}
          aria-label="Toggle status"
        >
          {status === "completed" ? "↩" : status === "in-progress" ? "✓" : "▶"}
        </button>
        <button
          className="btn-icon btn-edit"
          onClick={() => onEdit(todo)}
          title="Edit task"
          aria-label="Edit task"
        >
          ✏️
        </button>
        <button
          className="btn-icon btn-delete"
          onClick={() => {
            if (window.confirm(`Delete "${title}"?`)) onDelete(_id);
          }}
          title="Delete task"
          aria-label="Delete task"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
