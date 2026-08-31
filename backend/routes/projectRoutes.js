import express from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getAnalyticsSummary,
} from "../controllers/projectController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/analytics/summary", getAnalyticsSummary);

router.route("/")
  .get(getProjects)
  .post(protect, authorize("Admin", "Ministry"), createProject);

router.route("/:id")
  .get(getProjectById)
  .put(protect, authorize("Admin", "Ministry"), updateProject)
  .delete(protect, authorize("Admin"), deleteProject);

export default router;
