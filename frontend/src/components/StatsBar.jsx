const StatsBar = ({ stats }) => {
  const cards = [
    { label: "Total", value: stats.total, color: "#6366f1" },
    { label: "Pending", value: stats.pending, color: "#f59e0b" },
    { label: "In Progress", value: stats["in-progress"], color: "#3b82f6" },
    { label: "Completed", value: stats.completed, color: "#22c55e" },
  ];

  return (
    <div className="stats-bar">
      {cards.map(({ label, value, color }) => (
        <div key={label} className="stat-card" style={{ borderTopColor: color }}>
          <span className="stat-value" style={{ color }}>
            {value}
          </span>
          <span className="stat-label">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
