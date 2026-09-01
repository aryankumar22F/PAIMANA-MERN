import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import { MapPin, Filter, Layers, RefreshCw, Eye } from "lucide-react";
import api from "../api/axios";

// Status pin colors
const STATUS_COLORS = {
  "On Track": "#059669",
  "Cost Overrun": "#ea580c",
  "Delayed": "#d97706",
  "Critical": "#dc2626",
  "Completed": "#2563eb",
};

const MapView = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sector, setSector] = useState("");
  const [status, setStatus] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  // Fetch projects
  useEffect(() => {
    const fetchMapProjects = async () => {
      setLoading(true);
      try {
        const params = {};
        if (sector) params.sector = sector;
        if (status) params.status = status;
        const { data } = await api.get("/projects", { params });
        setProjects(data);
      } catch (err) {
        console.error("Map fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMapProjects();
  }, [sector, status]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center of India
      const map = L.map(mapContainerRef.current).setView([22.5937, 78.9629], 5);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | MoSPI PAIMANA GIS',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      // Cleanup if unmounted
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when projects change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // Map projects with coordinates (or state-level default coords)
    const validProjects = projects.filter((p) => p.latitude && p.longitude);

    validProjects.forEach((p) => {
      const pinColor = STATUS_COLORS[p.status] || "#0b4f8a";

      const customIcon = L.divIcon({
        className: "custom-map-marker",
        html: `
          <div style="
            background-color: ${pinColor};
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 5px rgba(0,0,0,0.35);
          "></div>
        `,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker([p.latitude, p.longitude], { icon: customIcon });

      const popupContent = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; max-width: 240px; padding: 4px;">
          <span style="font-size: 10px; font-weight: 700; color: ${pinColor}; text-transform: uppercase;">
            ${p.status}
          </span>
          <h4 style="margin: 4px 0 6px 0; font-size: 13px; color: #003366; line-height: 1.3;">
            ${p.projectName}
          </h4>
          <p style="margin: 0 0 4px 0; color: #64748b; font-size: 11px;">
            <strong>Ministry:</strong> ${p.ministry}
          </p>
          <p style="margin: 0 0 4px 0; color: #334155;">
            <strong>Revised Cost:</strong> ₹${p.revisedCost?.toLocaleString()} Cr
          </p>
          <p style="margin: 0 0 8px 0; color: #334155;">
            <strong>Physical Progress:</strong> ${p.physicalProgress || 0}%
          </p>
          <a href="/projects/${p._id}" style="
            display: inline-block;
            background: #003366;
            color: #ffffff;
            padding: 4px 10px;
            border-radius: 4px;
            text-decoration: none;
            font-size: 11px;
            font-weight: 600;
          ">
            View Full Dossier →
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on("click", () => setSelectedProject(p));
      markersLayerRef.current.addLayer(marker);
    });
  }, [projects]);

  return (
    <div className="map-page-container">
      {/* Header */}
      <div className="page-header-container">
        <div className="page-title-section">
          <h1>
            <MapPin size={22} color="#003366" />
            GIS Geospatial Infrastructure Map
          </h1>
          <p>
            Spatial mapping of Central Sector Projects across States & Union Territories of India
          </p>
        </div>

        <div className="page-actions-section">
          <Link to="/projects" className="btn btn-outline">
            View Table 6 List
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-toolbar-box">
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#334155" }}>
            <Filter size={15} />
            <span>Map Filters:</span>
          </div>

          <select
            className="filter-select"
            style={{ width: "200px" }}
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          >
            <option value="">All Sectors</option>
            <option value="Transport & Logistics">Transport & Logistics</option>
            <option value="Power & Energy">Power & Energy</option>
            <option value="Water & Irrigation">Water & Irrigation</option>
            <option value="Urban Infrastructure">Urban Infrastructure</option>
            <option value="Telecom">Telecom</option>
            <option value="Petroleum & Gas">Petroleum & Gas</option>
          </select>

          <select
            className="filter-select"
            style={{ width: "180px" }}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="On Track">On Track</option>
            <option value="Delayed">Delayed</option>
            <option value="Cost Overrun">Cost Overrun</option>
            <option value="Critical">Critical</option>
            <option value="Completed">Completed</option>
          </select>

          <span style={{ fontSize: "12px", color: "#64748b", marginLeft: "auto" }}>
            Showing <strong>{projects.length}</strong> projects on GIS canvas
          </span>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="map-wrapper-box">
        {loading && (
          <div style={{ position: "absolute", top: 12, left: 60, zIndex: 1000, background: "white", padding: "6px 12px", borderRadius: "4px", boxShadow: "0 2px 6px rgba(0,0,0,0.15)", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
            <RefreshCw size={14} className="spinner-icon" />
            <span>Loading Geospatial Pins...</span>
          </div>
        )}

        <div ref={mapContainerRef} className="map-element" />

        {/* Legend */}
        <div className="map-legend-overlay">
          <strong style={{ display: "block", marginBottom: "6px", color: "#003366", fontSize: "11px", textTransform: "uppercase" }}>
            Project Status Pin
          </strong>
          {Object.entries(STATUS_COLORS).map(([name, color]) => (
            <div key={name} className="map-legend-item">
              <span className="map-legend-pin" style={{ backgroundColor: color }}></span>
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;
