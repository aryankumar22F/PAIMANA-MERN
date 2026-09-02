import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Lock, Mail, UserPlus, User, Phone } from "lucide-react";
import api from "../api/axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validations
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const payload = { name, email, password };
      if (phone.trim()) {
        payload.phone = phone.trim();
      }

      const { data } = await api.post("/auth/register", payload);
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/");
      window.location.reload(); // update navbar profile state
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px 16px" }}>
      <div className="login-container-card">
        <div className="login-card-header">
          <div
            style={{
              display: "inline-flex",
              background: "rgba(255,255,255,0.15)",
              padding: "10px",
              borderRadius: "50%",
              marginBottom: "10px",
            }}
          >
            <UserPlus size={28} color="#ff9933" />
          </div>
          <h2>PAIMANA Officer Registration</h2>
          <p
            style={{
              fontSize: "11.5px",
              color: "#cbd5e1",
              marginTop: "4px",
            }}
          >
            Ministry of Statistics &amp; Programme Implementation (MoSPI)
          </p>
        </div>

        <div className="login-card-body">
          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "10px 14px",
                borderRadius: "6px",
                marginBottom: "16px",
                fontSize: "12px",
                border: "1px solid #fecaca",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSignup}>
            {/* Full Name */}
            <div className="form-group-single">
              <label>Full Name</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  className="form-control-input"
                  style={{ paddingLeft: "32px" }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                />
                <User
                  size={15}
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
              </div>
            </div>

            {/* Email */}
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
                <Mail
                  size={15}
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
              </div>
            </div>

            {/* Phone (Optional) */}
            <div className="form-group-single">
              <label>
                Phone Number{" "}
                <span style={{ color: "#94a3b8", fontWeight: 400 }}>
                  (optional)
                </span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="tel"
                  className="form-control-input"
                  style={{ paddingLeft: "32px" }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
                <Phone
                  size={15}
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
              </div>
            </div>

            {/* Password */}
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
                  placeholder="Min. 6 characters"
                />
                <Lock
                  size={15}
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group-single">
              <label>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type="password"
                  className="form-control-input"
                  style={{ paddingLeft: "32px" }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter your password"
                />
                <Shield
                  size={15}
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: "100%",
                marginTop: "12px",
                padding: "10px",
                fontSize: "13.5px",
              }}
              disabled={loading}
            >
              <UserPlus size={15} />
              <span>
                {loading ? "Creating Account..." : "Create PAIMANA Account"}
              </span>
            </button>
          </form>

          {/* Auth switch link */}
          <div className="auth-switch-link">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
