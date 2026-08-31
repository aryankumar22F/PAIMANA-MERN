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

// ---------------------------------------------------------------------------
// REAL DATA SOURCE
// ---------------------------------------------------------------------------
// All 1775 Central Sector Infrastructure Projects (Rs. 150 crore & above),
// transcribed programmatically (not hand-typed) from Table 6 "All Ongoing
// Projects" of the official PAIMANA Flash Report, JULY 2026 edition
// (https://paimana-proj.mospi.gov.in), Ministry of Statistics & Programme
// Implementation (MoSPI), Government of India.
//
// Every field below — ministry, sector, state, implementing agency, approval
// date, start date, original/revised completion date, original/revised cost,
// cumulative expenditure, and physical progress — comes directly from that
// report. Nothing is fabricated or guessed. financialProgress is derived
// (expenditureSoFar / revisedCost * 100); latitude/longitude are state-level
// centroids added only for map placement, not sourced from the report.
//
// To refresh this data for a future month: download the new Flash Report PDF
// from the portal above and re-run the extraction script that produced
// paimana_projects_july2026.json (Table 6 has a stable row structure:
// Sl.No | Project Name (Agency) (Code) | State | Approval(Start) |
// Original/Target DoC(Revised DoC) | Original/Revised Cost | Cumulative
// Expenditure | Physical Progress %).
// ---------------------------------------------------------------------------

const rawProjects = JSON.parse(
  fs.readFileSync(path.join(__dirname, "paimana_projects_july2026.json"), "utf-8")
);

// Keep only fields defined on the Project schema (drops projectCode etc.)
const sampleProjects = rawProjects.map((p) => ({
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
    await Project.deleteMany();
    await User.deleteMany();

    const projectsWithRisk = sampleProjects.map((p) => {
      const riskScore = calculateRiskScore(p);
      const status = getStatusFromRisk(riskScore, p.physicalProgress);
      return { ...p, riskScore, status };
    });

    await Project.insertMany(projectsWithRisk);
    await User.create(sampleUsers);

    console.log(`✅ Imported ${projectsWithRisk.length} real PAIMANA projects (July 2026 Flash Report)!`);
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

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}