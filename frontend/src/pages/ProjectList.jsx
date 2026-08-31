import { useEffect, useState } from "react";
import api from "../api/axios";
import ProjectCard from "../components/ProjectCard";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (status) params.status = status;
      const { data } = await api.get("/projects", { params });
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchProjects, 300); // debounce search
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  return (
    <div className="page">
      <h1>All Projects</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search project name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="On Track">On Track</option>
          <option value="Cost Overrun">Cost Overrun</option>
          <option value="Delayed">Delayed</option>
          <option value="Critical">Critical</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading projects...</div>
      ) : (
        <div className="project-grid">
          {projects.length === 0 && <p>No projects found.</p>}
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
