import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Building2,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Activity,
  IndianRupee,
  Layers,
  ArrowRight,
  ShieldAlert,
  MapPin,
  RefreshCw,
  Globe2
} from "lucide-react";
import api from "../api/axios";
import StatCard from "../components/StatCard";
import RiskBadge from "../components/RiskBadge";
import IndiaInteractiveMap from "../components/IndiaInteractiveMap";

const STATUS_COLORS = {
  "On Track": "#059669",
  "Cost Overrun": "#ea580c",
  "Delayed": "#d97706",
  "Critical": "#dc2626",
  "Completed": "#2563eb",
};

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [criticalProjects, setCriticalProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [summaryRes, projectsRes] = await Promise.all([
        api.get("/projects/analytics/summary"),
        api.get("/projects"),
      ]);
      setSummary(summaryRes.data);
      setAllProjects(projectsRes.data);
      // Grab top critical projects
      setCriticalProjects(projectsRes.data.filter((p) => p.status === "Critical").slice(0, 6));
    } catch (err) {
      setError("Failed to connect to PAIMANA Backend. Ensure the API server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-box">
        <RefreshCw size={36} className="spinner-icon" />
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#003366" }}>
          Loading PAIMANA Executive Intelligence Dashboard...
        </h3>
        <p style={{ fontSize: "12px", color: "#64748b" }}>
          Aggregating data from 1,775 Central Sector Infrastructure Projects (MoSPI Flash Report)
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-box" style={{ color: "#dc2626" }}>
        <AlertTriangle size={36} />
        <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Connection Error</h3>
        <p>{lerror}</p>
        <button className="btn btn-primary" onClick={fetchData} style={{ marginTop: "12px" }}>
          <RefreshCw size={14} /> Retry Connection
        </button>
      </div>
    );
  }

  if (!summary) return null;

  const statusChartData = Object.entries(summary.statusCounts || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const sectorChartData = Object.entries(summary.sectorCounts || {}).map(([name, value]) => ({
    name,
    projects: value,
  }));

  return (
    <div>
      {/* Page Header Bar */}
      <div className="page-header-container">
        <div className="page-title-section">
          <h1>
            <Activity size={22} color="#003366" />
            Executive Infrastructure Monitoring Dashboard
          </h1>
          <p>
            Real-time oversight of Central Sector Infrastructure Projects costing ₹150 Cr and above (MoSPI Flash Report, July 2026)
          </p>
        </div>
        <div className="page-actions-section">
          <Link to="/projects" className="btn btn-primary">
            <FileSpreadsheet size={14} />
            <span>Table 6 Flash Report</span>
          </Link>
          <button className="btn btn-outline" onClick={() => window.print()} title="Print Executive Summary">
            <Download size={14} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="stats-grid-container">
        <StatCard
          label="Total Monitored Projects"
          value={summary.totalProjects?.toLocaleString() || "1,775"}
          sublabel="₹150 Cr & above projects"
          accent="blue"
          icon={Layers}
        />
        <StatCard
          label="Sanctioned Outlay"
          value={`₹${(summary.totalSanctionedCost / 100000).toFixed(2)} L Cr`}
          sublabel={`₹${summary.totalSanctionedCost?.toLocaleString()} Cr sanctioned`}
          accent="green"
          icon={IndianRupee}
        />
        <StatCard
          label="Revised Anticipated Cost"
          value={`₹${(summary.totalRevisedCost / 100000).toFixed(2)} L Cr`}
          sublabel={`${summary.overallCostOverrunPercent}% total cost overrun`}
          accent="red"
          icon={TrendingUp}
          trend={`+${summary.overallCostOverrunPercent}%`}
          trendType="danger"
        />
        <StatCard
          label="Cumulative Expenditure"
          value={`₹${(summary.totalExpenditure / 100000).toFixed(2)} L Cr`}
          sublabel={`${summary.expenditurePercent}% of revised outlay spent`}
          accent="blue"
          icon={Building2}
          trend={`${summary.expenditurePercent}%`}
          trendType="success"
        />
        <StatCard
          label="High Risk & Critical Projects"
          value={summary.atRiskProjects || 0}
          sublabel="Risk score ≥ 35 (Immediate Action)"
          accent="amber"
          icon={AlertTriangle}
          trend="Action Req."
          trendType="warning"
        />
      </div>

      {/* OFFICIAL PAIMANA INTERACTIVE INDIA MAP & STATE DOSSIER SECTION */}
      <IndiaInteractiveMap projects={allProjects} />

      {/* Charts Row */}
      <div className="charts-row-grid">
        {/* Status Breakdown Donut */}
        <div className="panel-box">
          <div className="panel-header">
            <span className="panel-header-title">
              <Activity size={16} color="#003366" />
              Project Status Distribution
            </span>
            <span style={{ fontSize: "11px", color: "#64748b" }}>1,775 Projects</span>
          </div>
          <div className="panel-body">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {statusChartData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_COLORS[entry.name] || "#3498db"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} Projects`, name]}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Breakdown Bar Chart */}
        <div className="panel-box">
          <div className="panel-header">
            <span className="panel-header-title">
              <Building2 size={16} color="#003366" />
              Projects by Infrastructure Sector
            </span>
            <span style={{ fontSize: "11px", color: "#64748b" }}>Sectoral Allocation</span>
          </div>
          <div className="panel-body">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={sectorChartData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#475569" }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 11, fill: "#475569" }} allowDecimals={false} />
                <Tooltip
                  formatter={(val) => [`${val} Projects`, "Count"]}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px" }}
                />
                <Bar dataKey="projects" fill="#0b4f8a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Alerts & Quick Insights Grid */}
      <div className="dashboard-layout-grid">
        {/* Critical Projects Feed */}
        <div className="panel-box">
          <div className="panel-header">
            <span className="panel-header-title">
              <ShieldAlert size={16} color="#dc2626" />
              Critical & Escalated Projects (CCI / IPMD Radar)
            </span>
            <Link to="/projects?status=Critical" className="panel-header-action" style={{ color: "#003366" }}>
              View All Critical →
            </Link>
          </div>
          <div className="panel-body">
            {criticalProjects.length === 0 ? (
              <p style={{ color: "#64748b", fontSize: "13px" }}>No projects currently marked critical.</p>
            ) : (
              <div className="critical-alerts-list">
                {criticalProjects.map((p) => (
                  <Link to={`/projects/${p._id}`} key={p._id} className="critical-alert-item">
                    <div className="alert-item-main">
                      <h4>{p.projectName}</h4>
                      <div className="alert-item-meta">
                        <span><strong>Ministry:</strong> {p.ministry}</span>
                        <span><strong>Revised Cost:</strong> ₹{p.revisedCost?.toLocaleString()} Cr</span>
                        <span><strong>Physical:</strong> {p.physicalProgress}%</span>
                      </div>
                    </div>
                    <div className="alert-item-risk">
                      <span className="risk-score-pill">Risk: {p.riskScore}/100</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PAIMANA Institutional Framework Card */}
        <div className="panel-box">
          <div className="panel-header">
            <span className="panel-header-title">
              <Layers size={16} color="#003366" />
              Institutional Framework & Highlights
            </span>
          </div>
          <div className="panel-body" style={{ fontSize: "12.5px", color: "#334155", lineHeight: "1.6" }}>
            <div style={{ background: "#e8f1fa", padding: "12px", borderRadius: "6px", marginBottom: "14px", borderLeft: "4px solid #003366" }}>
              <strong style={{ color: "#003366", display: "block", marginBottom: "2px" }}>
                "One Data, One Entry" Principle
              </strong>
              Integrated via APIs with DPIIT’s IPMP & Line Ministry MIS to eliminate redundant reporting and reduce data errors.
            </div>

            <ul style={{ paddingLeft: "18px", color: "#475569" }}>
              <li style={{ marginBottom: "8px" }}>
                <strong>Replaces OCMS-2006:</strong> Complete modernization of computerized monitoring initiated by MoSPI.
              </li>
              <li style={{ marginBottom: "8px" }}>
                <strong>Transport & Logistics:</strong> Accounts for the largest share of central projects by count and capital.
              </li>
              <li style={{ marginBottom: "8px" }}>
                <strong>Standard Reporting:</strong> Monthly Flash Report published automatically to Parliament and PMO.
              </li>
            </ul>

            <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px dashed #cbd5e1" }}>
              <Link to="/map" className="btn btn-outline btn-sm" style={{ width: "100%" }}>
                <MapPin size={14} /> Open GIS Geospatial Pin Map
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
