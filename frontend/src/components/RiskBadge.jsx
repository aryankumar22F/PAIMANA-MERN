const statusColors = {
  "On Track": "green",
  "Cost Overrun": "yellow",
  Delayed: "orange",
  Critical: "red",
  Completed: "blue",
};

const RiskBadge = ({ status }) => {
  const color = statusColors[status] || "gray";
  return <span className={`badge badge-${color}`}>{status}</span>;
};

export default RiskBadge;
