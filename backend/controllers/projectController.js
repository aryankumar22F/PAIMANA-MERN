import Project from "../models/Project.js";
import { calculateRiskScore, getStatusFromRisk } from "../utils/riskCalculator.js";

// @desc Get all projects (with optional filters)
// @route GET /api/projects
export const getProjects = async (req, res) => {
  try {
    const { ministry, sector, status, search } = req.query;
    const filter = {};

    if (ministry) filter.ministry = ministry;
    if (sector) filter.sector = sector;
    if (status) filter.status = status;
    if (search) filter.projectName = { $regex: search, $options: "i" };

    const projects = await Project.find(filter).sort({ updatedAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single project
// @route GET /api/projects/:id
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create project
// @route POST /api/projects
export const createProject = async (req, res) => {
  try {
    const riskScore = calculateRiskScore(req.body);
    const status = getStatusFromRisk(riskScore, req.body.physicalProgress || 0);

    const project = await Project.create({ ...req.body, riskScore, status });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Update project
// @route PUT /api/projects/:id
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    Object.assign(project, req.body);
    project.riskScore = calculateRiskScore(project);
    project.status = getStatusFromRisk(project.riskScore, project.physicalProgress);
    project.lastUpdated = Date.now();

    const updated = await project.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Delete project
// @route DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    await project.deleteOne();
    res.json({ message: "Project removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Dashboard analytics summary
// @route GET /api/projects/analytics/summary
export const getAnalyticsSummary = async (req, res) => {
  try {
    const projects = await Project.find();

    const totalProjects = projects.length;
    const totalSanctionedCost = projects.reduce((sum, p) => sum + p.sanctionedCost, 0);
    const totalRevisedCost = projects.reduce((sum, p) => sum + p.revisedCost, 0);
    const totalExpenditure = projects.reduce((sum, p) => sum + p.expenditureSoFar, 0);

    const statusCounts = projects.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});

    const sectorCounts = projects.reduce((acc, p) => {
      acc[p.sector] = (acc[p.sector] || 0) + 1;
      return acc;
    }, {});

    const atRiskProjects = projects.filter((p) => p.riskScore >= 35).length;

    res.json({
      totalProjects,
      totalSanctionedCost,
      totalRevisedCost,
      totalExpenditure,
      overallCostOverrunPercent:
        totalSanctionedCost > 0
          ? (((totalRevisedCost - totalSanctionedCost) / totalSanctionedCost) * 100).toFixed(2)
          : 0,
      expenditurePercent:
        totalRevisedCost > 0 ? ((totalExpenditure / totalRevisedCost) * 100).toFixed(2) : 0,
      statusCounts,
      sectorCounts,
      atRiskProjects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
