import React, { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  Printer,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  RefreshCw,
  Building,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  Shield,
  FileSpreadsheet
} from "lucide-react";
import api from "../api/axios";
import ProjectCard from "../components/ProjectCard";
import RiskBadge from "../components/RiskBadge";
import ProjectModal from "../components/ProjectModal";

const SECTORS = [
  "Transport & Logistics",
  "Power & Energy",
  "Water & Irrigation",
  "Urban Infrastructure",
  "Telecom",
  "Petroleum & Gas",
  "Other",
];

const STATUSES = ["On Track", "Delayed", "Cost Overrun", "Critical", "Completed"];

const ProjectList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters state
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [sector, setSector] = useState(searchParams.get("sector") || "");
  const [stateFilter, setStateFilter] = useState(searchParams.get("state") || "");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (status) params.status = status;
      if (sector) params.sector = sector;

      const { data } = await api.get("/projects", { params });
      setProjects(data);
      setCurrentPage(1); // reset to page 1 on search/filter
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchProjects, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, sector]);

  // Unique states from loaded projects for filter dropdown
  const uniqueStates = useMemo(() => {
    const states = new Set();
    projects.forEach((p) => {
      if (p.state) states.add(p.state);
    });
    return Array.from(states).sort();
  }, [projects]);

  // Client-side filtering by state if selected
  const filteredProjects = useMemo(() => {
    if (!stateFilter) return projects;
    return projects.filter((p) => p.state === stateFilter);
  }, [projects, stateFilter]);

  // Pagination slice
  const totalItems = filteredProjects.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [filteredProjects, currentPage, pageSize]);

  // CSV Export
  const handleExportCSV = () => {
    if (filteredProjects.length === 0) return;
    const headers = [
      "Sl No",
      "Project Name",
      "Ministry",
      "Sector",
      "Implementing Agency",
      "State",
      "Sanctioned Cost (Cr)",
      "Revised Cost (Cr)",
      "Cumulative Expenditure (Cr)",
      "Physical Progress (%)",
      "Status",
      "Risk Score",
    ];

    const rows = filteredProjects.map((p, idx) => [
      idx + 1,
      `"${(p.projectName || "").replace(/"/g, '""')}"`,
      `"${p.ministry || ""}"`,
      `"${p.sector || ""}"`,
      `"${p.implementingAgency || ""}"`,
      `"${p.state || ""}"`,
      p.sanctionedCost,
      p.revisedCost,
      p.expenditureSoFar,
      p.physicalProgress,
      p.status,
      p.riskScore,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PAIMANA_Table6_FlashReport_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header-container">
        <div className="page-title-section">
          <h1>
            <FileSpreadsheet size={22} color="#003366" />
            Table 6: All Ongoing Infrastructure Projects
          </h1>
          <p>
            Official repository of Central Sector Projects costing ₹150 Crore and above (MoSPI Flash Report, July 2026)
          </p>
        </div>

        <div className="page-actions-section">
          {userInfo && (userInfo.role === "Admin" || userInfo.role === "Ministry") && (
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={15} />
              <span>Add New Project</span>
            </button>
          )}

          <button className="btn btn-outline" onClick={handleExportCSV} title="Export current filtered view to CSV">
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button className="btn btn-outline" onClick={() => window.print()} title="Print Table 6">
            <Printer size={14} />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="filter-toolbar-box">
        <div className="filter-grid-row">
          <div className="search-input-wrap">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by project name, agency, or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <select
              className="filter-select"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            >
              <option value="">All Sectors</option>
              {SECTORS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="filter-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {STATUSES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="filter-select"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
            >
              <option value="">All States / UTs</option>
              {uniqueStates.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="view-mode-toggle">
            <button
              className={`view-mode-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Official Table View"
            >
              <TableIcon size={14} />
              <span>Table</span>
            </button>
            <button
              className={`view-mode-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Card Grid View"
            >
              <LayoutGrid size={14} />
              <span>Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="loading-box">
          <RefreshCw size={32} className="spinner-icon" />
          <p>Querying PAIMANA Table 6 Repository...</p>
        </div>
      ) : (
        <>
          {viewMode === "table" ? (
            <div className="flash-table-container">
              <div className="flash-table-meta-bar">
                <span>
                  Showing <strong>{totalItems.toLocaleString()}</strong> projects in Table 6
                  {search && ` matching "${search}"`}
                  {sector && ` in ${sector}`}
                  {status && ` [${status}]`}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>Rows per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    style={{ padding: "3px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "12px" }}
                  >
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              <div className="table-responsive">
                <table className="flash-report-table">
                  <thead>
                    <tr>
                      <th className="table-col-num">#</th>
                      <th className="table-col-project">Project Name & Agency</th>
                      <th>Ministry & Sector</th>
                      <th>State</th>
                      <th style={{ textAlign: "right" }}>Sanctioned Cost (₹ Cr)</th>
                      <th style={{ textAlign: "right" }}>Revised Cost (₹ Cr)</th>
                      <th style={{ textAlign: "right" }}>Expenditure (₹ Cr)</th>
                      <th style={{ textAlign: "center" }}>Physical %</th>
                      <th style={{ textAlign: "center" }}>Status</th>
                      <th style={{ textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProjects.length === 0 ? (
                      <tr>
                        <td colSpan={10} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                          No matching projects found. Try resetting filters.
                        </td>
                      </tr>
                    ) : (
                      paginatedProjects.map((p, index) => {
                        const serialNum = (currentPage - 1) * pageSize + index + 1;
                        return (
                          <tr key={p._id}>
                            <td className="table-col-num">{serialNum}</td>
                            <td className="table-col-project">
                              <Link to={`/projects/${p._id}`} className="table-project-name">
                                {p.projectName}
                              </Link>
                              <span className="table-project-agency">
                                Agency: {p.implementingAgency || "N/A"}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontWeight: 600, color: "#334155", display: "block" }}>
                                {p.ministry}
                              </span>
                              <span style={{ fontSize: "11px", color: "#64748b" }}>
                                {p.sector}
                              </span>
                            </td>
                            <td>{p.state || "National"}</td>
                            <td className="table-currency">
                              ₹{p.sanctionedCost?.toLocaleString()}
                            </td>
                            <td className="table-currency" style={{ color: p.revisedCost > p.sanctionedCost ? "#dc2626" : "inherit" }}>
                              ₹{p.revisedCost?.toLocaleString()}
                            </td>
                            <td className="table-currency">
                              ₹{p.expenditureSoFar?.toLocaleString()}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <div style={{ fontWeight: 700 }}>{p.physicalProgress || 0}%</div>
                              <div className="progress-track" style={{ width: "60px", margin: "2px auto 0" }}>
                                <div
                                  className="progress-fill"
                                  style={{ width: `${p.physicalProgress || 0}%` }}
                                />
                              </div>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <RiskBadge status={p.status} />
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <Link
                                to={`/projects/${p._id}`}
                                className="btn btn-outline btn-sm"
                                style={{ padding: "3px 8px", fontSize: "11px" }}
                              >
                                Dossier
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="pagination-bar">
                <span>
                  Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({totalItems.toLocaleString()} total items)
                </span>
                <div className="pagination-controls">
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    title="First Page"
                  >
                    <ChevronsLeft size={14} />
                  </button>
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    title="Previous Page"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  <span style={{ margin: "0 6px", fontWeight: 700 }}>{currentPage}</span>

                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    title="Next Page"
                  >
                    <ChevronRight size={14} />
                  </button>
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    title="Last Page"
                  >
                    <ChevronsRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="project-card-grid">
                {paginatedProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>

              {/* Pagination for Card View */}
              <div className="pagination-bar" style={{ borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                <span>
                  Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({totalItems.toLocaleString()} total)
                </span>
                <div className="pagination-controls">
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Project Creation Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectSaved={fetchProjects}
      />
    </div>
  );
};

export default ProjectList;
