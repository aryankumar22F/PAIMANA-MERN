import { Link } from "react-router-dom";
import RiskBadge from "./RiskBadge";

const ProjectCard = ({ project }) => {
  return (
    <Link to={`/projects/${project._id}`} className="project-card">
      <div className="project-card-header">
        <h3>{project.projectName}</h3>
        <RiskBadge status={project.status} />
      </div>
      <p className="project-card-ministry">{project.ministry}</p>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${project.physicalProgress}%` }}
        />
      </div>
      <div className="project-card-footer">
        <span>Progress: {project.physicalProgress}%</span>
        <span>₹{project.revisedCost} Cr</span>
      </div>
    </Link>
  );
};

export default ProjectCard;
