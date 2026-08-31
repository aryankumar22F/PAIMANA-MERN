const StatCard = ({ label, value, sublabel, accent }) => {
  return (
    <div className={`stat-card ${accent ? `accent-${accent}` : ""}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sublabel && <div className="stat-sublabel">{sublabel}</div>}
    </div>
  );
};

export default StatCard;
