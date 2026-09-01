import React from "react";
import { TrendingUp, TrendingDown, IndianRupee, Layers, AlertTriangle, Clock } from "lucide-react";

const StatCard = ({ label, value, sublabel, accent = "blue", icon: IconComponent, trend, trendType = "warning" }) => {
  return (
    <div className={`stat-card-box accent-${accent}`}>
      <div className="stat-card-header">
        <span className="stat-card-title">{label}</span>
        <div className="stat-card-icon-wrap">
          {IconComponent ? <IconComponent size={17} /> : <Layers size={17} />}
        </div>
      </div>
      <div className="stat-card-value">{value}</div>
      {sublabel && (
        <div className="stat-card-footer">
          <span className="stat-sublabel-text">{sublabel}</span>
          {trend && (
            <span className={`stat-badge-trend trend-${trendType}`}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
