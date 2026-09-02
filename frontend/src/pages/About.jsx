import React from "react";
import { Info, Shield, Layers, Building, Globe, ExternalLink, CheckCircle } from "lucide-react";

const About = () => {
  return (
    <div>
      <div className="page-header-container">
        <div className="page-title-section">
          <h1>
            <Info size={22} color="#003366" />
            About PAIMANA & MoSPI IPMD
          </h1>
          <p>
            Project Assessment, Infrastructure Monitoring & Analytics for Nation-building
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        <div className="panel-box">
          <div className="panel-body" style={{ fontSize: "13.5px", lineHeight: "1.8", color: "#334155" }}>
            <h2 style={{ fontSize: "18px", color: "#003366", marginBottom: "12px", fontWeight: 800 }}>
              Institutional Mandate
            </h2>
            <p style={{ marginBottom: "14px" }}>
              The <strong>Infrastructure and Project Monitoring Division (IPMD)</strong> of the Ministry of Statistics
              and Programme Implementation (MoSPI) is mandated by the Government of India to monitor all Central Sector
              Infrastructure Projects costing <strong>₹150 Crore and above</strong>.
            </p>

            <h3 style={{ fontSize: "15px", color: "#003366", marginTop: "20px", marginBottom: "8px", fontWeight: 700 }}>
              What is PAIMANA?
            </h3>
            <p style={{ marginBottom: "14px" }}>
              <strong>PAIMANA (Project Assessment, Infrastructure Monitoring & Analytics for Nation-building)</strong> was
              launched on September 25, 2025, replacing the legacy OCMS-2006 (Online Computerized Monitoring System).
              It provides automated, API-driven, and real-time visibility into infrastructure projects across India.
            </p>

            <h3 style={{ fontSize: "15px", color: "#003366", marginTop: "20px", marginBottom: "8px", fontWeight: 700 }}>
              Key Pillars of PAIMANA
            </h3>
            <ul style={{ paddingLeft: "20px", marginBottom: "16px" }}>
              <li style={{ marginBottom: "6px" }}>
                <strong>"One Data, One Entry" Principle:</strong> Eliminates duplicate entries by integrating directly with
                DPIIT’s Integrated Project Monitoring Portal (IPMP) and Line Ministry MIS.
              </li>
              <li style={{ marginBottom: "6px" }}>
                <strong>Automated Flash Reporting:</strong> Produces the monthly Flash Report detailing time and cost overruns
                across ~1,775+ mega and major projects.
              </li>
              <li style={{ marginBottom: "6px" }}>
                <strong>Geospatial Integration:</strong> Synchronized with PM Gati Shakti National Master Plan GIS layers.
              </li>
              <li style={{ marginBottom: "6px" }}>
                <strong>Evidence-Based Governance:</strong> Empowers the Cabinet Committee on Investment (CCI) and PMO
                with objective data to resolve bottlenecks.
              </li>
            </ul>
          </div>
        </div>

        <div>
          <div className="panel-box" style={{ marginBottom: "20px" }}>
            <div className="panel-header">
              <span className="panel-header-title">
                <Building size={16} color="#003366" />
                Division Contact Info
              </span>
            </div>
            <div className="panel-body" style={{ fontSize: "12.5px", color: "#475569", lineHeight: "1.6" }}>
              <p>
                <strong>Infrastructure & Project Monitoring Division</strong><br />
                Ministry of Statistics & Programme Implementation<br />
                Khurshid Lal Bhawan, Janpath,<br />
                New Delhi - 110001
              </p>
              <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid #e2e8f0" }}>
                <a
                  href="https://paimana-proj.mospi.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ width: "100%" }}
                >
                  <ExternalLink size={13} /> Official Portal ↗
                </a>
              </div>
            </div>
          </div>

          <div className="panel-box">
            <div className="panel-header">
              <span className="panel-header-title">
                <Shield size={16} color="#003366" />
                SIH PS 26103 Details
              </span>
            </div>
            <div className="panel-body" style={{ fontSize: "12px", color: "#475569", lineHeight: "1.5" }}>
              <p>
                Smart India Hackathon Problem Statement 26103:
                <em> "Use case on web-based Integrated Project-Monitoring platform (PAIMANA)"</em>
              </p>
              <div style={{ marginTop: "10px", background: "#ecfdf5", padding: "8px", borderRadius: "4px", color: "#065f46" }}>
                ✓ Includes 1,775 verified projects from the July 2026 Flash Report.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
