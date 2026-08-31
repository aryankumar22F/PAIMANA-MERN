import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/db.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import { calculateRiskScore, getStatusFromRisk } from "../utils/riskCalculator.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();
connectDB();

const VALID_MONTHS = ["april2026", "may2026", "june2026", "july2026"];
const DEFAULT_MONTH = "july2026";

const arg = process.argv[2];
const isDestroy = arg === "-d";
const month = !isDestroy && VALID_MONTHS.includes(arg) ? arg : DEFAULT_MONTH;

const loadMonthData = (monthTag) => {
  const filePath = path.join(__dirname, `paimana_projects_${monthTag}.json`);
  const rawProjects = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return rawProjects.map((p) => ({
    projectName: p.projectName,
    ministry: p.ministry,
    sector: p.sector,
    state: p.state,
    implementingAgency: p.implementingAgency,
    sanctionedCost: p.sanctionedCost,
    revisedCost: p.revisedCost,
    expenditureSoFar: p.expenditureSoFar,
    startDate: p.startDate,
    originalCompletionDate: p.originalCompletionDate,
    revisedCompletionDate: p.revisedCompletionDate,
    physicalProgress: p.physicalProgress,
    financialProgress: p.financialProgress,
    latitude: p.latitude,
    longitude: p.longitude,
  }));
};

const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@paimana.gov.in",
    password: "admin123",
    role: "Admin",
  },
  {
    name: "MoRTH Officer",
    email: "morth@paimana.gov.in",
    password: "morth123",
    role: "Ministry",
    ministry: "Ministry of Road Transport & Highways",
  },
];

const importData = async () => {
  try {
    const sampleProjects = loadMonthData(month);

    await Project.deleteMany();
    await User.deleteMany();

    const projectsWithRisk = sampleProjects.map((p) => {
      const riskScore = calculateRiskScore(p);
      const status = getStatusFromRisk(riskScore, p.physicalProgress);
      return { ...p, riskScore, status };
    });

    await Project.insertMany(projectsWithRisk);
    await User.create(sampleUsers);

    console.log(
      `✅ Imported ${projectsWithRisk.length} real PAIMANA projects (${month.toUpperCase()} Flash Report)!`
    );
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Project.deleteMany();
    await User.deleteMany();
    console.log("🗑️  Data destroyed!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (isDestroy) {
  destroyData();
} else {
  importData();
}