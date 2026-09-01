import React, { useState, useEffect, useMemo } from "react";
import * as d3 from "d3-geo";
import { scaleLinear } from "d3-scale";
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

// Fallback: state name normalization map (same as before)
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

  // Color scale matching PAIMANA exactly: Light Yellow -> Orange -> Deep Red
  const colorScale = scaleLinear()
    .domain([0, maxCount * 0.4, maxCount]) // Midpoint for orange
    .range(["#FFF4D2", "#F6A57B", "#D9534F"])
    .clamp(true);

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

  // Map Projection setup using D3
  const width = 600;
  const height = 650;
  // Fit India properly in the viewBox
  const projection = d3
    .geoMercator()
    .center([82.5, 23.5]) // Center of India
    .scale(1000)
    .translate([width / 2, height / 2]);

  const pathGenerator = d3.geoPath().projection(projection);

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
    // All India
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
                <p>₹ {activeDossier.originalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              </div>
            </div>

            <div className="paimana-stat-cell">
              <Briefcase className="paimana-stat-icon" />
              <div className="paimana-stat-content">
                <h5>Latest Revised Cost (in Cr.) <Info className="info-icon" /></h5>
                <p>₹ {activeDossier.revisedCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              </div>
            </div>

            <div className="paimana-stat-cell">
              <TrendingUp className="paimana-stat-icon" />
              <div className="paimana-stat-content">
                <h5>Expenditure(Cumm.) (in Cr.) <Info className="info-icon" /></h5>
                <p>₹ {activeDossier.expenditure.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
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
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="paimana-svg-map"
              preserveAspectRatio="xMidYMid meet"
            >
              <g>
                {geoData.features.map((feature, i) => {
                  const name =
                    feature.properties.NAME_1 ||
                    feature.properties.name ||
                    feature.properties.NAME;
                  const stat = matchState(name);
                  const count = stat ? stat.count : 0;
                  const isSelected = selectedState && stat && stat.name === selectedState;

                  return (
                    <path
                      key={i}
                      d={pathGenerator(feature)}
                      className="state-path"
                      fill={isSelected ? "#003366" : count === 0 ? "#FFF4D2" : colorScale(count)}
                      onClick={() => {
                        const stateName = stat ? stat.name : name;
                        setSelectedState((prev) => (prev === stateName ? null : stateName));
                      }}
                      title={`${name}: ${count} projects`}
                    />
                  );
                })}
              </g>
            </svg>
          )}
          
          {/* Legend Bar on the right */}
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
