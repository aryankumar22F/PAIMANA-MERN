import React from "react";
import { Shield, Building, Globe, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="official-footer">
      <div className="footer-main-strip">
        <div className="footer-col">
          <h4>Infrastructure & Project Monitoring Division (IPMD)</h4>
          <p style={{ color: "#94a3b8", fontSize: "12px", lineHeight: "1.6", marginTop: "4px" }}>
            Ministry of Statistics and Programme Implementation (MoSPI)<br />
            Government of India, Khurshid Lal Bhawan, Janpath,<br />
            New Delhi - 110001
          </p>
          <p style={{ color: "#64748b", fontSize: "11px", marginTop: "10px" }}>
            PAIMANA tracks all Central Sector Infrastructure projects costing ₹150 Crore & above
            under the mandate of the Government of India.
          </p>
        </div>

        <div className="footer-col">
          <h4>Portals & Systems</h4>
          <ul className="footer-links-list">
            <li>
              <a href="https://mospi.gov.in" target="_blank" rel="noreferrer">
                MoSPI Official Portal ↗
              </a>
            </li>
            <li>
              <a href="https://paimana-proj.mospi.gov.in" target="_blank" rel="noreferrer">
                PAIMANA Official Live ↗
              </a>
            </li>
            <li>
              <a href="https://dpiit.gov.in" target="_blank" rel="noreferrer">
                DPIIT Integrated Portal ↗
              </a>
            </li>
            <li>
              <a href="https://gatishakti.gov.in" target="_blank" rel="noreferrer">
                PM Gati Shakti NMP ↗
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Policy & Compliance</h4>
          <ul className="footer-links-list">
            <li><a href="#!">One Data One Entry Framework</a></li>
            <li><a href="#!">Data Dissemination Policy</a></li>
            <li><a href="#!">Terms of Usage</a></li>
            <li><a href="#!">Hyperlinking Policy</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Technical Collaboration</h4>
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <p style={{ fontSize: "11px", color: "#cbd5e1", lineHeight: "1.4" }}>
              Developed for <strong>Smart India Hackathon (SIH PS 26103)</strong> based on the real July 2026 PAIMANA Flash Report.
            </p>
            <span style={{ display: "block", fontSize: "10px", color: "#ff9933", marginTop: "6px", fontWeight: 700 }}>
              National Informatics Centre (NIC) Hosting Standards
            </span>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <span>
          © 2026 Ministry of Statistics and Programme Implementation (MoSPI), Government of India. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
