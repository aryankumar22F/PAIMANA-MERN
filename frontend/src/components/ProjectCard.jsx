import React from "react";
import { Link } from "react-router-dom";
import RiskBadge from "./RiskBadge";
import { MapPin, Building, Calendar, ArrowRight } from "lucide-react";

const ProjectCard = ({ project }) => {
  const financialPct = project.revisedCost > 0
    ? Math.min(100, Math.round((project.expenditureSoFar / project.revisedCost) * 100))
    : 0;

  return (
    <Link to={`/projects/${project._id}`} className="paimana-project-card">
      <div>
        <div className="card-top-meta">
          <span className="card-sector-tag">{project.sector || "Infrastructure"}</span>
          <RiskBadge status={project.status} />
        </div>

        <h3 className="card-title" title={project.projectName}>
          {project.projectName}
        </h3>

        <div className="card-ministry-info">
          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "3px" }}>
            <Building size={12} />
            <span style={{ fontWeight: 600 }}>{project.implementingAgency || project.ministry}</span>
          </div>
          {project.state && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <MapPin size={12} />
              <span>{project.state}</span>
            </div>
          )}
        </div>

        <div className="card-finance-grid">
          <div className="card-finance-item">
            <span>Revised Cost</span>
            <strong>₹{project.revisedCost?.toLocaleString()} Cr</strong>
          </div>
          <div className="card-finance-item">
            <span>Cumulative Exp.</span>
            <strong>₹{project.expenditureSoFar?.toLocaleString()} Cr</strong>
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-header-labels">
            <span>Physical Progress</span>
            <span>{project.physicalProgress || 0}%</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${project.physicalProgress || 0}%` }}
            />
          </div>
        </div>

        <div className="progress-container" style={{ marginBottom: "6px" }}>
          <div className="progress-header-labels">
            <span>Financial Exp.</span>
            <span>{financialPct}%</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill financial"
              style={{ width: `${financialPct}%` }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", paddingTop: "8px", borderTop: "1px solid #f1f5f9", fontSize: "11px", color: "#64748b" }}>
        <span>Risk: <strong>{project.riskScore || 0}/100</strong></span>
        <span style={{ color: "#0b4f8a", fontWeight: 700, display: "flex", alignItems: "center", gap: "2px" }}>
          Inspect <ArrowRight size={11} />
        </span>
      </div>
    </Link>
  );
};

export default ProjectCard;
