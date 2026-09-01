import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";
import { BarChart3, TrendingUp, Layers, Building2, AlertTriangle, ShieldCheck } from "lucide-react";
import api from "../api/axios";

const COLORS = ["#003366", "#0b4f8a", "#ff8c00", "#059669", "#dc2626", "#7c3aed", "#2563eb"];

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get("/projects/analytics/summary");
        setSummary(data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !summary) {
    return (
      <div className="loading-box">
        <p>Loading Sectoral Analytics...</p>
      </div>
    );
  }

  const sectorData = Object.entries(summary.sectorCounts || {}).map(([name, count]) => ({
    name,
    count,
  }));

  const statusData = Object.entries(summary.statusCounts || {}).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <div>
      <div className="page-header-container">
        <div className="page-title-section">
          <h1>
            <BarChart3 size={22} color="#003366" />
            Infrastructure Sectoral Performance & Analytics
          </h1>
          <p>
            Statistical breakdown of Central Sector Infrastructure investments, time overruns, and sector capacities
          </p>
        </div>
      </div>

      <div className="charts-row-grid">
        <div className="panel-box">
          <div className="panel-header">
            <span className="panel-header-title">
              <Layers size={16} color="#003366" />
              Sector-Wise Project Density
            </span>
          </div>
          <div className="panel-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectorData} layout="vertical" margin={{ left: 40, right: 20 }}>
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
                <Tooltip formatter={(val) => [`${val} Projects`, "Total"]} />
                <Bar dataKey="count" fill="#003366" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel-box">
          <div className="panel-header">
            <span className="panel-header-title">
              <TrendingUp size={16} color="#003366" />
              Project Status Proportions
            </span>
          </div>
          <div className="panel-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="panel-box" style={{ marginTop: "20px" }}>
        <div className="panel-header">
          <span className="panel-header-title">
            <ShieldCheck size={16} color="#003366" />
            MoSPI Flash Report Key Insights (July 2026 Edition)
          </span>
        </div>
        <div className="panel-body" style={{ fontSize: "13px", lineHeight: "1.7", color: "#334155" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
              <strong style={{ color: "#003366", display: "block" }}>1. Largest Sector: Transport & Logistics</strong>
              Road Transport and Highways along with Railways account for the majority of mega projects and capital expenditure.
            </div>

            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
              <strong style={{ color: "#003366", display: "block" }}>2. Overall Capital Overrun Rate</strong>
              Total cost escalation across monitored central projects stands at <strong>{summary.overallCostOverrunPercent}%</strong> compared to original sanctioned estimates.
            </div>

            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
              <strong style={{ color: "#003366", display: "block" }}>3. Expenditure Velocity</strong>
              <strong>{summary.expenditurePercent}%</strong> of the revised capital allocation has been disbursed as cumulative expenditure to date.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
