import React, { useState, useEffect } from "react";
import { X, Save, Building, MapPin, IndianRupee, Calendar } from "lucide-react";
import api from "../api/axios";

const SECTORS = [
  "Transport & Logistics",
  "Power & Energy",
  "Water & Irrigation",
  "Urban Infrastructure",
  "Telecom",
  "Petroleum & Gas",
  "Other",
];

const ProjectModal = ({ isOpen, onClose, projectToEdit, onProjectSaved }) => {
  const [formData, setFormData] = useState({
    projectName: "",
    ministry: "Ministry of Road Transport & Highways",
    sector: "Transport & Logistics",
    state: "National",
    implementingAgency: "NHAI",
    sanctionedCost: 500,
    revisedCost: 550,
    expenditureSoFar: 200,
    startDate: new Date().toISOString().split("T")[0],
    originalCompletionDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split("T")[0],
    revisedCompletionDate: new Date(Date.now() + 450 * 24 * 3600 * 1000).toISOString().split("T")[0],
    physicalProgress: 45,
    status: "On Track",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        projectName: projectToEdit.projectName || "",
        ministry: projectToEdit.ministry || "",
        sector: projectToEdit.sector || "Transport & Logistics",
        state: projectToEdit.state || "",
        implementingAgency: projectToEdit.implementingAgency || "",
        sanctionedCost: projectToEdit.sanctionedCost || 0,
        revisedCost: projectToEdit.revisedCost || 0,
        expenditureSoFar: projectToEdit.expenditureSoFar || 0,
        startDate: projectToEdit.startDate ? projectToEdit.startDate.split("T")[0] : "",
        originalCompletionDate: projectToEdit.originalCompletionDate ? projectToEdit.originalCompletionDate.split("T")[0] : "",
        revisedCompletionDate: projectToEdit.revisedCompletionDate ? projectToEdit.revisedCompletionDate.split("T")[0] : "",
        physicalProgress: projectToEdit.physicalProgress || 0,
        status: projectToEdit.status || "On Track",
      });
    }
  }, [projectToEdit]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (projectToEdit?._id) {
        await api.put(`/projects/${projectToEdit._id}`, formData);
      } else {
        await api.post("/projects", formData);
      }
      onProjectSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save project. Ensure you are logged in.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog-box">
        <div className="modal-header-bar">
          <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#003366" }}>
            {projectToEdit ? "Update Project Dossier" : "Register New Infrastructure Project"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body-content">
            {error && (
              <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px", borderRadius: "6px", marginBottom: "14px", fontSize: "12px" }}>
                {error}
              </div>
            )}

            <div className="form-group-single">
              <label>Project Title (as per CCEA / PIB approval) *</label>
              <input
                type="text"
                name="projectName"
                className="form-control-input"
                value={formData.projectName}
                onChange={handleChange}
                required
                placeholder="e.g. 4-Laning of Delhi-Jaipur Expressway (Package-II)"
              />
            </div>

            <div className="form-group-row">
              <div>
                <label>Administrative Ministry *</label>
                <input
                  type="text"
                  name="ministry"
                  className="form-control-input"
                  value={formData.ministry}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Infrastructure Sector *</label>
                <select
                  name="sector"
                  className="form-control-input"
                  value={formData.sector}
                  onChange={handleChange}
                >
                  {SECTORS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group-row">
              <div>
                <label>Implementing Agency</label>
                <input
                  type="text"
                  name="implementingAgency"
                  className="form-control-input"
                  value={formData.implementingAgency}
                  onChange={handleChange}
                  placeholder="e.g. NHAI, RVNL, NTPC"
                />
              </div>
              <div>
                <label>State / Location</label>
                <input
                  type="text"
                  name="state"
                  className="form-control-input"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Maharashtra, Uttar Pradesh"
                />
              </div>
            </div>

            <div className="form-group-row">
              <div>
                <label>Sanctioned Cost (₹ Cr) *</label>
                <input
                  type="number"
                  name="sanctionedCost"
                  className="form-control-input"
                  value={formData.sanctionedCost}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label>Revised / Anticipated Cost (₹ Cr) *</label>
                <input
                  type="number"
                  name="revisedCost"
                  className="form-control-input"
                  value={formData.revisedCost}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-group-row">
              <div>
                <label>Cumulative Expenditure (₹ Cr)</label>
                <input
                  type="number"
                  name="expenditureSoFar"
                  className="form-control-input"
                  value={formData.expenditureSoFar}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label>Physical Progress (%)</label>
                <input
                  type="number"
                  name="physicalProgress"
                  className="form-control-input"
                  value={formData.physicalProgress}
                  onChange={handleChange}
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="form-group-row">
              <div>
                <label>Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-control-input"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Original Target Date *</label>
                <input
                  type="date"
                  name="originalCompletionDate"
                  className="form-control-input"
                  value={formData.originalCompletionDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group-row">
              <div>
                <label>Revised Target Date</label>
                <input
                  type="date"
                  name="revisedCompletionDate"
                  className="form-control-input"
                  value={formData.revisedCompletionDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Current Status</label>
                <select
                  name="status"
                  className="form-control-input"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="On Track">On Track</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Cost Overrun">Cost Overrun</option>
                  <option value="Critical">Critical</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ padding: "14px 20px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={14} />
              <span>{saving ? "Saving..." : "Save Project"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
