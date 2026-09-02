import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Calendar,
  IndianRupee,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Clock,
  Shield,
  Edit,
  Trash2,
  CheckCircle2,
  Layers,
  Activity,
  FileText,
  Printer
} from "lucide-react";
import api from "../api/axios";
import RiskBadge from "../components/RiskBadge";
import ProjectModal from "../components/ProjectModal";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const fetchProject = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
    } catch (err) {
      setError("Project record could not be found in the PAIMANA database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${project.projectName}" from the repository?`)) {
      return;
    }
    try {
      await api.delete(`/projects/${id}`);
      navigate("/projects");
    } catch (err) {
      alert("Failed to delete project: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="loading-box">
        <Activity size={32} className="spinner-icon" />
        <p>Loading Official MoSPI Project Dossier...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="loading-box" style={{ color: "#dc2626" }}>
        <AlertTriangle size={36} />
        <h3>Project Not Found</h3>
        <p>{error}</p>
        <Link to="/projects" className="btn btn-primary" style={{ marginTop: "12px" }}>
          ← Back to Table 6 Explorer
        </Link>
      </div>
    );
  }

  const costVariance = (project.revisedCost || 0) - (project.sanctionedCost || 0);
  const costVariancePct = project.sanctionedCost > 0
    ? ((costVariance / project.sanctionedCost) * 100).toFixed(1)
    : 0;

  const financialPct = project.revisedCost > 0
    ? Math.min(100, Math.round((project.expenditureSoFar / project.revisedCost) * 100))
    : 0;

  return (
    <div>
      {/* Back Navigation Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <Link to="/projects" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#003366", fontWeight: 700, fontSize: "13px" }}>
          <ArrowLeft size={16} /> Back to Table 6 Projects Explorer
        </Link>

        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn btn-outline btn-sm" onClick={() => window.print()}>
            <Printer size={13} /> Print Dossier
          </button>
          {userInfo && (userInfo.role === "Admin" || userInfo.role === "Ministry") && (
            <>
              <button className="btn btn-primary btn-sm" onClick={() => setIsEditModalOpen(true)}>
                <Edit size={13} /> Edit Dossier
              </button>
              {userInfo.role === "Admin" && (
                <button className="btn btn-outline btn-sm" onClick={handleDelete} style={{ color: "#dc2626", borderColor: "#fecaca" }}>
                  <Trash2 size={13} /> Delete
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Dossier Header Box */}
      <div className="dossier-header-box">
        <div className="dossier-top-meta">
          <span style={{ fontSize: "11px", fontWeight: 800, color: "#ff8c00", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            CENTRAL SECTOR INFRASTRUCTURE DOSSIER (₹150 CR+)
          </span>
          <RiskBadge status={project.status} />
        </div>

        <h1 className="dossier-title">{project.projectName}</h1>

        <div className="dossier-subtitle">
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Building2 size={14} color="#003366" />
            <strong>Ministry:</strong> {project.ministry}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Layers size={14} color="#003366" />
            <strong>Sector:</strong> {project.sector}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <MapPin size={14} color="#003366" />
            <strong>State:</strong> {project.state || "National"}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Shield size={14} color="#003366" />
            <strong>Agency:</strong> {project.implementingAgency || "Line Agency"}
          </span>
        </div>
      </div>

      {/* Financial Overview Grid */}
      <div className="dossier-grid-summary">
        <div className="dossier-metric-card">
          <h5>Sanctioned Cost</h5>
          <p>₹{project.sanctionedCost?.toLocaleString()} Cr</p>
        </div>

        <div className="dossier-metric-card">
          <h5>Revised / Anticipated Cost</h5>
          <p>₹{project.revisedCost?.toLocaleString()} Cr</p>
        </div>

        <div className={`dossier-metric-card ${costVariance > 0 ? "highlight-danger" : "highlight-success"}`}>
          <h5>Cost Escalation / Overrun</h5>
          <p>
            {costVariance > 0 ? `+₹${costVariance.toLocaleString()} Cr (${costVariancePct}%)` : "₹0 (Within Budget)"}
          </p>
        </div>

        <div className="dossier-metric-card">
          <h5>Cumulative Expenditure</h5>
          <p>₹{project.expenditureSoFar?.toLocaleString()} Cr</p>
        </div>

        <div className="dossier-metric-card">
          <h5>Financial Expenditure %</h5>
          <p>{financialPct}%</p>
        </div>

        <div className={`dossier-metric-card ${project.riskScore >= 35 ? "highlight-danger" : ""}`}>
          <h5>IPMD Risk Score</h5>
          <p>{project.riskScore || 0} / 100</p>
        </div>
      </div>

      {/* Progress Comparison Section */}
      <div className="dossier-section-box">
        <h3 className="dossier-section-title">
          <Activity size={16} color="#003366" />
          Physical Progress vs Financial Expenditure Progress
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div>
            <div className="progress-header-labels">
              <span style={{ fontWeight: 700, color: "#059669" }}>Physical Progress (Work On-Site)</span>
              <strong style={{ fontSize: "14px", color: "#059669" }}>{project.physicalProgress || 0}%</strong>
            </div>
            <div className="progress-track" style={{ height: "12px" }}>
              <div
                className="progress-fill"
                style={{ width: `${project.physicalProgress || 0}%` }}
              />
            </div>
            <p style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
              Actual ground completion percentage verified by line ministry engineers.
            </p>
          </div>

          <div>
            <div className="progress-header-labels">
              <span style={{ fontWeight: 700, color: "#2563eb" }}>Financial Progress (Funds Disbursed)</span>
              <strong style={{ fontSize: "14px", color: "#2563eb" }}>{financialPct}%</strong>
            </div>
            <div className="progress-track" style={{ height: "12px" }}>
              <div
                className="progress-fill financial"
                style={{ width: `${financialPct}%` }}
              />
            </div>
            <p style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
              ₹{project.expenditureSoFar?.toLocaleString()} Cr disbursed out of ₹{project.revisedCost?.toLocaleString()} Cr total outlay.
            </p>
          </div>
        </div>
      </div>

      {/* Timeline & Milestone Sheet */}
      <div className="dossier-section-box">
        <h3 className="dossier-section-title">
          <Calendar size={16} color="#003366" />
          Commissioning Timeline & Delay Breakdown
        </h3>

        <table className="timeline-table">
          <tbody>
            <tr>
              <td style={{ fontWeight: 600, color: "#334155" }}>Approval / Start Date</td>
              <td style={{ fontWeight: 700 }}>
                {project.startDate ? new Date(project.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A"}
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, color: "#334155" }}>Original Target Date of Commissioning (DoC)</td>
              <td style={{ fontWeight: 700 }}>
                {project.originalCompletionDate ? new Date(project.originalCompletionDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A"}
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, color: "#334155" }}>Anticipated / Revised Target Date</td>
              <td style={{ fontWeight: 700, color: project.revisedCompletionDate ? "#d97706" : "inherit" }}>
                {project.revisedCompletionDate ? new Date(project.revisedCompletionDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Same as Original"}
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, color: "#334155" }}>Time Overrun (Delay in Days)</td>
              <td>
                {project.delayDays > 0 ? (
                  <span style={{ color: "#dc2626", fontWeight: 800 }}>
                    ⚠️ {project.delayDays} Days ({(project.delayDays / 30.4).toFixed(1)} Months Delay)
                  </span>
                ) : (
                  <span style={{ color: "#059669", fontWeight: 700 }}>
                    ✓ On Schedule / No Delay Reported
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Geolocation & Data Integration Info */}
      <div className="dossier-section-box">
        <h3 className="dossier-section-title">
          <MapPin size={16} color="#003366" />
          Geospatial & Gati Shakti Integration
        </h3>
        <p style={{ fontSize: "12.5px", color: "#475569", marginBottom: "12px" }}>
          Coordinates recorded for PM Gati Shakti National Master Plan GIS spatial synchronization.
        </p>
        <div style={{ display: "flex", gap: "20px", fontSize: "12.5px" }}>
          <span><strong>Latitude:</strong> {project.latitude || "22.5937 (State Centroid)"}</span>
          <span><strong>Longitude:</strong> {project.longitude || "78.9629 (State Centroid)"}</span>
          <span><strong>Last Synchronized:</strong> {new Date(project.updatedAt || Date.now()).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Edit Modal */}
      <ProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        projectToEdit={project}
        onProjectSaved={fetchProject}
      />
    </div>
  );
};

export default ProjectDetail;
