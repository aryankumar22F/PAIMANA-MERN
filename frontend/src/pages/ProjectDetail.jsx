import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import RiskBadge from "../components/RiskBadge";

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        setProject(data);
      } catch (err) {
        setError("Project not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!project) return null;

  return (
    <div className="page">
      <Link to="/projects" className="back-link">← Back to Projects</Link>

      <div className="detail-header">
        <h1>{project.projectName}</h1>
        <RiskBadge status={project.status} />
      </div>
      <p className="subtitle">
        {project.ministry} · {project.sector} · {project.state}
      </p>

      <div className="detail-grid">
        <div className="detail-box">
          <h4>Sanctioned Cost</h4>
          <p>₹{project.sanctionedCost} Cr</p>
        </div>
        <div className="detail-box">
          <h4>Revised Cost</h4>
          <p>₹{project.revisedCost} Cr</p>
        </div>
        <div className="detail-box">
          <h4>Cost Overrun</h4>
          <p>{project.costOverrunPercent?.toFixed(1)}%</p>
        </div>
        <div className="detail-box">
          <h4>Expenditure So Far</h4>
          <p>₹{project.expenditureSoFar} Cr</p>
        </div>
        <div className="detail-box">
          <h4>Risk Score</h4>
          <p>{project.riskScore} / 100</p>
        </div>
        <div className="detail-box">
          <h4>Implementing Agency</h4>
          <p>{project.implementingAgency}</p>
        </div>
      </div>

      <div className="detail-section">
        <h3>Physical Progress</h3>
        <div className="progress-bar large">
          <div
            className="progress-bar-fill"
            style={{ width: `${project.physicalProgress}%` }}
          />
        </div>
        <p>{project.physicalProgress}% complete</p>
      </div>

      <div className="detail-section">
        <h3>Timeline</h3>
        <table className="timeline-table">
          <tbody>
            <tr>
              <td>Start Date</td>
              <td>{new Date(project.startDate).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td>Original Completion Date</td>
              <td>{new Date(project.originalCompletionDate).toLocaleDateString()}</td>
            </tr>
            {project.revisedCompletionDate && (
              <tr>
                <td>Revised Completion Date</td>
                <td>{new Date(project.revisedCompletionDate).toLocaleDateString()}</td>
              </tr>
            )}
            <tr>
              <td>Delay</td>
              <td>{project.delayDays || 0} days</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectDetail;
