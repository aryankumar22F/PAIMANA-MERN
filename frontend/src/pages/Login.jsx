import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Mail, ArrowRight, UserCheck, KeyRound } from "lucide-react";
import api from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("admin@paimana.gov.in");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/");
      window.location.reload(); // update navbar profile state
    } catch (err) {
      setError(err.response?.data?.message || "Invalid officer credentials. Check your email & password.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
  };

  return (
    <div style={{ padding: "40px 16px" }}>
      <div className="login-container-card">
        <div className="login-card-header">
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.15)", padding: "10px", borderRadius: "50%", marginBottom: "10px" }}>
            <Shield size={28} color="#ff9933" />
          </div>
          <h2>PAIMANA Officer Authentication</h2>
          <p style={{ fontSize: "11.5px", color: "#cbd5e1", marginTop: "4px" }}>
            Ministry of Statistics & Programme Implementation (MoSPI)
          </p>
        </div>

        <div className="login-card-body">
          {error && (
            <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: "6px", marginBottom: "16px", fontSize: "12px", border: "1px solid #fecaca" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group-single">
              <label>Official NIC / Gov Email</label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  className="form-control-input"
                  style={{ paddingLeft: "32px" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="officer@paimana.gov.in"
                />
                <Mail size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              </div>
            </div>

            <div className="form-group-single">
              <label>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type="password"
                  className="form-control-input"
                  style={{ paddingLeft: "32px" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "12px", padding: "10px", fontSize: "13.5px" }}
              disabled={loading}
            >
              <KeyRound size={15} />
              <span>{loading ? "Authenticating Officer..." : "Sign In to PAIMANA"}</span>
            </button>
          </form>

          {/* Quick 1-Click Demo Accounts */}
          <div className="demo-account-box">
            <h5>⚡ Quick 1-Click Demo Credentials:</h5>
            <div className="demo-btn-grid">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleDemoFill("admin@paimana.gov.in", "admin123")}
                style={{ fontSize: "11px", textAlign: "left", display: "block" }}
              >
                <strong>Admin (MoSPI)</strong>
                <span style={{ display: "block", color: "#64748b" }}>admin@paimana.gov.in</span>
              </button>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleDemoFill("morth@paimana.gov.in", "morth123")}
                style={{ fontSize: "11px", textAlign: "left", display: "block" }}
              >
                <strong>Ministry (MoRTH)</strong>
                <span style={{ display: "block", color: "#64748b" }}>morth@paimana.gov.in</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
