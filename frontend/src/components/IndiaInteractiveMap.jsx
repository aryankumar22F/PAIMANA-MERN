import React, { useState, useEffect, useMemo, useRef } from "react";
import * as d3 from "d3-geo";
import { scaleLinear, scaleSequential } from "d3-scale";
import { interpolateRgb } from "d3-interpolate";
import {
  FileText,
  IndianRupee,
  Briefcase,
  TrendingUp,
  Calendar,
  Construction,
  Info,
} from "lucide-react";

const INDIA_GEOJSON_URL =
  "https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson";

const STATE_NAME_MAP = {
  "Andaman and Nicobar": "Andaman & Nicobar Islands",
  "Andhra Pradesh": "Andhra Pradesh",
  "Arunachal Pradesh": "Arunachal Pradesh",
  Assam: "Assam",
  Bihar: "Bihar",
  Chandigarh: "Chandigarh",
  Chhattisgarh: "Chhattisgarh",
  "Dadra and Nagar Haveli": "Dadra & Nagar Haveli",
  Daman: "Daman & Diu",
  Delhi: "Delhi",
  Goa: "Goa",
  Gujarat: "Gujarat",
  Haryana: "Haryana",
  "Himachal Pradesh": "Himachal Pradesh",
  "Jammu and Kashmir": "Jammu & Kashmir",
  Jharkhand: "Jharkhand",
  Karnataka: "Karnataka",
  Kerala: "Kerala",
  Lakshadweep: "Lakshadweep",
  "Madhya Pradesh": "Madhya Pradesh",
  Maharashtra: "Maharashtra",
  Manipur: "Manipur",
  Meghalaya: "Meghalaya",
  Mizoram: "Mizoram",
  Nagaland: "Nagaland",
  Odisha: "Odisha",
  Orissa: "Odisha",
  Puducherry: "Puducherry",
  Punjab: "Punjab",
  Rajasthan: "Rajasthan",
  Sikkim: "Sikkim",
  "Tamil Nadu": "Tamil Nadu",
  Telangana: "Telangana",
  Tripura: "Tripura",
  "Uttar Pradesh": "Uttar Pradesh",
  Uttarakhand: "Uttarakhand",
  Uttaranchal: "Uttarakhand",
  "West Bengal": "West Bengal",
  Ladakh: "Ladakh",
};

const IndiaInteractiveMap = ({ projects = [] }) => {
  const [geoData, setGeoData] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, name: "", count: 0 });
  const svgRef = useRef(null);

  useEffect(() => {
    fetch(INDIA_GEOJSON_URL)
      .then((r) => r.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Failed to load India GeoJSON", err));
  }, []);

  // State-wise aggregation
  const stateStats = useMemo(() => {
    const stats = {};
    projects.forEach((p) => {
      const st = p.state || "Multi-State";
      if (!stats[st]) {
        stats[st] = {
          name: st,
          count: 0,
          sanctionedCost: 0,
          revisedCost: 0,
          expenditure: 0,
        };
      }
      stats[st].count += 1;
      stats[st].sanctionedCost += p.sanctionedCost || 0;
      stats[st].revisedCost += p.revisedCost || 0;
      stats[st].expenditure += p.expenditureSoFar || 0;
    });
    return stats;
  }, [projects]);

  const maxCount = useMemo(() => {
    let mx = 1;
    Object.values(stateStats).forEach((s) => {
      if (s.count > mx) mx = s.count;
    });
    return mx;
  }, [stateStats]);

  // Exact PAIMANA color scale: Pale Yellow → Light Peach → Salmon → Deep Red
  const colorScale = useMemo(() => {
    return scaleLinear()
      .domain([0, maxCount * 0.15, maxCount * 0.35, maxCount * 0.6, maxCount])
      .range(["#F7F4D5", "#FCDBB0", "#F6A57B", "#D96A5B", "#C84C4C"])
      .clamp(true);
  }, [maxCount]);

  const matchState = (geoName) => {
    if (stateStats[geoName]) return stateStats[geoName];
    const normalized = STATE_NAME_MAP[geoName];
    if (normalized && stateStats[normalized]) return stateStats[normalized];
    for (const key of Object.keys(stateStats)) {
      if (
        key.toLowerCase().includes(geoName.toLowerCase()) ||
        geoName.toLowerCase().includes(key.toLowerCase())
      ) {
        return stateStats[key];
      }
    }
    return null;
  };

  // Map Projection - tuned to match PAIMANA portal exactly
  const width = 800;
  const height = 850;
  const projection = useMemo(() => {
    return d3
      .geoMercator()
      .center([82, 23])
      .scale(1300)
      .translate([width / 2, height / 2]);
  }, []);

  const pathGenerator = useMemo(() => d3.geoPath().projection(projection), [projection]);

  // Active Dossier Data for Left Panel
  const activeDossier = useMemo(() => {
    if (selectedState && stateStats[selectedState]) {
      const s = stateStats[selectedState];
      return {
        title: `${s.name} Details`,
        count: s.count,
        originalCost: s.sanctionedCost,
        revisedCost: s.revisedCost,
        expenditure: s.expenditure,
      };
    }
    let count = 0, orig = 0, rev = 0, exp = 0;
    projects.forEach((p) => {
      count++;
      orig += p.sanctionedCost || 0;
      rev += p.revisedCost || 0;
      exp += p.expenditureSoFar || 0;
    });
    return {
      title: "All State Details",
      count,
      originalCost: orig,
      revisedCost: rev,
      expenditure: exp,
    };
  }, [selectedState, stateStats, projects]);

  const handleMouseMove = (e, name, count) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setTooltip({
      show: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 12,
      name,
      count,
    });
  };

  // Format numbers in Indian style: 33,70,138.22
  const formatIndian = (num) => {
    const fixed = num.toFixed(2);
    const [intPart, decPart] = fixed.split(".");
    // Indian grouping: last 3 digits, then groups of 2
    let result = "";
    const digits = intPart.split("");
    const len = digits.length;
    for (let i = 0; i < len; i++) {
      const posFromEnd = len - 1 - i;
      result += digits[i];
      if (posFromEnd > 0 && posFromEnd === 3 && i < len - 1) result += ",";
      else if (posFromEnd > 3 && (posFromEnd - 3) % 2 === 0 && i < len - 1) result += ",";
    }
    return result + "." + decPart;
  };

  return (
    <div className="paimana-map-section">
      <h2 className="paimana-map-title">
        State-wise Projects <span>(as of July, 2026)</span>
      </h2>

      <div className="paimana-map-container">
        {/* Left Side: Stats Card */}
        <div className="paimana-stats-panel">
          <div className="paimana-stats-header">
            {activeDossier.title}
          </div>
          
          <div className="paimana-stats-grid">
            <div className="paimana-stat-cell">
              <FileText className="paimana-stat-icon" />
              <div className="paimana-stat-content">
                <h5>Project Count (No.) <Info className="info-icon" /></h5>
                <p>{activeDossier.count.toLocaleString()}</p>
              </div>
            </div>

            <div className="paimana-stat-cell">
              <IndianRupee className="paimana-stat-icon" />
              <div className="paimana-stat-content">
                <h5>Original Cost (in Cr.) <Info className="info-icon" /></h5>
                <p>₹ {formatIndian(activeDossier.originalCost)}</p>
              </div>
            </div>

            <div className="paimana-stat-cell">
              <Briefcase className="paimana-stat-icon" />
              <div className="paimana-stat-content">
                <h5>Latest Revised Cost (in Cr.) <Info className="info-icon" /></h5>
                <p>₹ {formatIndian(activeDossier.revisedCost)}</p>
              </div>
            </div>

            <div className="paimana-stat-cell">
              <TrendingUp className="paimana-stat-icon" />
              <div className="paimana-stat-content">
                <h5>Expenditure(Cumm.) (in Cr.) <Info className="info-icon" /></h5>
                <p>₹ {formatIndian(activeDossier.expenditure)}</p>
              </div>
            </div>

            <div className="paimana-stat-cell">
              <Calendar className="paimana-stat-icon" />
              <div className="paimana-stat-content">
                <h5>Completed During month (No.) <Info className="info-icon" /></h5>
                <p>0</p>
              </div>
            </div>

            <div className="paimana-stat-cell">
              <Construction className="paimana-stat-icon" />
              <div className="paimana-stat-content">
                <h5>Newly Added (No.) <Info className="info-icon" /></h5>
                <p>0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Fixed SVG Map */}
        <div className="paimana-svg-wrapper">
          {!geoData ? (
            <div style={{ color: "#374151" }}>Loading Map...</div>
          ) : (
            <div style={{ position: "relative" }}>
              <svg
                ref={svgRef}
                viewBox={`0 0 ${width} ${height}`}
                className="paimana-svg-map"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Drop shadow filter */}
                <defs>
                  <filter id="mapShadow" x="-5%" y="-5%" width="110%" height="110%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#00000020" />
                  </filter>
                </defs>
                <g filter="url(#mapShadow)">
                  {geoData.features.map((feature, i) => {
                    const name =
                      feature.properties.NAME_1 ||
                      feature.properties.name ||
                      feature.properties.NAME;
                    const stat = matchState(name);
                    const count = stat ? stat.count : 0;
                    const displayName = stat ? stat.name : name;
                    const isHovered = hoveredState === displayName;
                    const isSelected = selectedState === displayName;

                    return (
                      <path
                        key={i}
                        d={pathGenerator(feature)}
                        fill={count === 0 ? "#F7F4D5" : colorScale(count)}
                        stroke={isHovered || isSelected ? "#2D4030" : "#4A5568"}
                        strokeWidth={isHovered || isSelected ? 1.8 : 0.7}
                        style={{
                          cursor: "pointer",
                          filter: isHovered ? "brightness(0.88)" : "none",
                        }}
                        onClick={() => {
                          setSelectedState((prev) => (prev === displayName ? null : displayName));
                        }}
                        onMouseEnter={() => setHoveredState(displayName)}
                        onMouseMove={(e) => handleMouseMove(e, displayName, count)}
                        onMouseLeave={() => {
                          setHoveredState(null);
                          setTooltip({ show: false, x: 0, y: 0, name: "", count: 0 });
                        }}
                      />
                    );
                  })}
                </g>
              </svg>

              {/* Tooltip on hover */}
              {tooltip.show && (
                <div
                  style={{
                    position: "absolute",
                    left: tooltip.x,
                    top: tooltip.y,
                    transform: "translate(-50%, -100%)",
                    background: "rgba(11, 27, 61, 0.92)",
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                    zIndex: 10,
                  }}
                >
                  <span style={{ fontWeight: 800 }}>{tooltip.name}</span>
                  <br />
                  <span style={{ fontSize: "11px", opacity: 0.85 }}>{tooltip.count} Projects</span>
                </div>
              )}
            </div>
          )}
          
          {/* Vertical Legend Bar - exactly like PAIMANA */}
          <div className="paimana-legend">
            <div className="paimana-legend-bar"></div>
            <div className="paimana-legend-labels">
              <span>{Math.ceil(maxCount)}</span>
              <span>{Math.ceil(maxCount * 0.75)}</span>
              <span>{Math.ceil(maxCount * 0.5)}</span>
              <span>{Math.ceil(maxCount * 0.25)}</span>
              <span>0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndiaInteractiveMap;
