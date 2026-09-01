import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileSpreadsheet,
  MapPin,
  BarChart3,
  Info,
  LogOut,
  User,
  Shield,
  Activity,
  Layers,
} from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const [fontSize, setFontSize] = useState("normal");

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const toggleContrast = () => {
    document.body.classList.toggle("high-contrast");
  };

  const handleFontChange = (type) => {
    if (type === "increase") {
      document.documentElement.style.fontSize = "15px";
      setFontSize("large");
    } else if (type === "decrease") {
      document.documentElement.style.fontSize = "13px";
      setFontSize("small");
    } else {
      document.documentElement.style.fontSize = "14px";
      setFontSize("normal");
    }
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header>
      {/* Top Government of India Bar */}
      <div className="top-goi-bar">
        <div className="goi-identity">
          <span className="goi-tricolor-dot"></span>
          <span>भारत सरकार | GOVERNMENT OF INDIA</span>
          <span style={{ color: "#94a3b8" }}>|</span>
          <span>सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)</span>
        </div>
        <div className="top-utilities">
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              className="top-util-btn"
              onClick={() => handleFontChange("decrease")}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              className="top-util-btn"
              onClick={() => handleFontChange("reset")}
              title="Standard Font Size"
            >
              A
            </button>
            <button
              className="top-util-btn"
              onClick={() => handleFontChange("increase")}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>
          <button
            className="top-util-btn"
            onClick={toggleContrast}
            title="Toggle High Contrast"
          >
            Contrast
          </button>
          <span style={{ color: "#94a3b8" }}>|</span>
          <span style={{ fontWeight: 600, color: "#003366" }}>English</span>
        </div>
      </div>

      {/* Main Masthead Banner */}
      <div className="masthead-banner">
        <div className="masthead-left">
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "16px", textDecoration: "none" }}>
            <div className="national-emblem-container" title="State Emblem of India">
              {/* Ashoka Lion Capital SVG Representation */}
              <svg className="emblem-svg" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 5 C35 5 25 15 25 30 C25 45 35 52 50 52 C65 52 75 45 75 30 C75 15 65 5 50 5 Z" fill="#ffd700" opacity="0.9" />
                <circle cx="50" cy="70" r="14" fill="none" stroke="#ffd700" strokeWidth="3" />
                <circle cx="50" cy="70" r="2" fill="#ffd700" />
                <path d="M20 90 L80 90 L70 105 L30 105 Z" fill="#ffd700" />
                <text x="50" y="116" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#ffffff" letterSpacing="1">
                  सत्यमेव जयते
                </text>
              </svg>
            </div>
            <div className="portal-title-block">
              <span className="portal-title-hi">परियोजना मूल्यांकन, अवसंरचना निगरानी और विश्लेषण</span>
              <div className="portal-title-en">
                PAIMANA
                <span className="portal-acronym-badge">MoSPI FLASH REPORT JULY 2026</span>
              </div>
              <span className="portal-subtitle">
                Project Assessment, Infrastructure Monitoring & Analytics for Nation-building
              </span>
            </div>
          </Link>
        </div>

        <div className="masthead-right">
          <div className="gati-shakti-badge">
            <Layers size={18} color="#ff9933" />
            <div className="gati-shakti-text">
              <strong>PM Gati Shakti</strong>
              <span>DPIIT / IPMP Integrated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation Menu */}
      <nav className="primary-nav-bar">
        <ul className="nav-menu-list">
          <li className="nav-link-item">
            <Link to="/" className={isActive("/") ? "active" : ""}>
              <LayoutDashboard size={15} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="nav-link-item">
            <Link to="/projects" className={isActive("/projects") ? "active" : ""}>
              <FileSpreadsheet size={15} />
              <span>Flash Report (Table 6)</span>
              <span className="nav-pill-badge">1,775</span>
            </Link>
          </li>
          <li className="nav-link-item">
            <Link to="/map" className={isActive("/map") ? "active" : ""}>
              <MapPin size={15} />
              <span>GIS Geospatial Map</span>
            </Link>
          </li>
          <li className="nav-link-item">
            <Link to="/analytics" className={isActive("/analytics") ? "active" : ""}>
              <BarChart3 size={15} />
              <span>Sector Analytics</span>
            </Link>
          </li>
          <li className="nav-link-item">
            <Link to="/about" className={isActive("/about") ? "active" : ""}>
              <Info size={15} />
              <span>About IPMD</span>
            </Link>
          </li>
        </ul>

        <div className="nav-auth-section">
          {userInfo ? (
            <>
              <div className="officer-profile-chip">
                <Shield size={14} color="#ff9933" />
                <span>{userInfo.name}</span>
                <span className="officer-role-tag">{userInfo.role}</span>
              </div>
              <button className="nav-btn-logout" onClick={handleLogout} title="Logout">
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="btn nav-btn-login">
              <User size={14} />
              <span>Officer Login</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Official MoSPI Flash Ticker */}
      <div className="flash-ticker-bar">
        <div className="ticker-label">
          <span className="ticker-pulse"></span>
          <span>FLASH REPORT JULY 2026</span>
        </div>
        <div className="ticker-content">
          Monitoring 1,775 Central Sector Infrastructure Projects costing ₹150 Crore and above •
          Total Sanctioned Cost: ₹31.81 Lakh Cr • Revised Cost: ₹36.87 Lakh Cr • Cumulative Expenditure: ₹19.46 Lakh Cr (52.8%)
        </div>
      </div>
    </header>
  );
};

export default Navbar;
