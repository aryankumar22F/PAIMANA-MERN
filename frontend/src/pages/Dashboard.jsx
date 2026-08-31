import { useEffect, useState } from "react";
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
import api from "../api/axios";
import StatCard from "../components/StatCard";

const COLORS = ["#2ecc71", "#f1c40f", "#e67e22", "#e74c3c", "#3498db"];

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get("/projects/analytics/summary");
        setSummary(data);
      } catch (err) {
        setError("Failed to load dashboard data. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!summary) return null;

  const statusData = Object.entries(summary.statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const sectorData = Object.entries(summary.sectorCounts).map(([name, value]) => ({
    name,
    projects: value,
  }));

  return (
    <div className="page">
      <h1>Project Monitoring Dashboard</h1>
      <p className="subtitle">
        Real-time overview of Central Sector Infrastructure Projects
      </p>

      <div className="stats-grid">
        <StatCard label="Total Projects" value={summary.totalProjects} />
        <StatCard
          label="Sanctioned Cost"
          value={`₹${summary.totalSanctionedCost.toLocaleString()} Cr`}
        />
        <StatCard
          label="Revised Cost"
          value={`₹${summary.totalRevisedCost.toLocaleString()} Cr`}
          sublabel={`${summary.overallCostOverrunPercent}% overrun`}
          accent="red"
        />
        <StatCard
          label="Expenditure"
          value={`${summary.expenditurePercent}%`}
          sublabel={`₹${summary.totalExpenditure.toLocaleString()} Cr spent`}
        />
        <StatCard
          label="At-Risk Projects"
          value={summary.atRiskProjects}
          accent="orange"
        />
      </div>

      <div className="charts-grid">
        <div className="chart-box">
          <h3>Projects by Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Projects by Sector</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sectorData}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={80} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="projects" fill="#3498db" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
