import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Users, AlertTriangle } from "lucide-react";
import api from "../api/axios";

const ROLES = ["Admin", "Ministry", "Viewer"];

const ROLE_COLORS = {
  Admin: { bg: "#fef3c7", color: "#92400e", border: "#fcd34d" },
  Ministry: { bg: "#dbeafe", color: "#1e40af", border: "#93c5fd" },
  Viewer: { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" },
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  useEffect(() => {
    // Redirect non-admin users
    if (!userInfo || userInfo.role !== "Admin") {
      navigate("/");
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/auth/users");
      setUsers(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, userName, newRole, currentRole) => {
    if (newRole === currentRole) return;

    const confirmed = window.confirm(
      `Are you sure you want to change ${userName}'s role from "${currentRole}" to "${newRole}"?`
    );
    if (!confirmed) return;

    setUpdatingId(userId);
    setError("");
    setSuccessMsg("");

    try {
      const { data } = await api.put(`/auth/users/${userId}/role`, {
        role: newRole,
      });

      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: data.role } : u))
      );
      setSuccessMsg(
        `${userName}'s role updated to "${data.role}" successfully.`
      );

      // Auto-clear success message
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update role."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const isSelf = (userId) => userInfo && userInfo._id === userId;

  return (
    <div style={{ padding: "32px 16px" }}>
      <div className="admin-panel-container">
        {/* Header */}
        <div className="admin-panel-header">
          <div className="admin-panel-title-row">
            <div
              style={{
                display: "inline-flex",
                background: "rgba(255,153,51,0.15)",
                padding: "10px",
                borderRadius: "50%",
              }}
            >
              <ShieldCheck size={24} color="#ff9933" />
            </div>
            <div>
              <h2>User Role Management</h2>
              <p>Manage officer roles across the PAIMANA platform</p>
            </div>
          </div>
          <div className="admin-panel-stats">
            <Users size={16} color="#64748b" />
            <span>{users.length} registered users</span>
          </div>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="admin-msg admin-msg-error">
            <AlertTriangle size={14} />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="admin-msg admin-msg-success">
            <ShieldCheck size={14} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Users Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
            Loading users...
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className={isSelf(user._id) ? "admin-row-self" : ""}
                  >
                    <td className="admin-col-index">{index + 1}</td>
                    <td className="admin-col-name">
                      {user.name}
                      {isSelf(user._id) && (
                        <span className="admin-you-badge">You</span>
                      )}
                    </td>
                    <td className="admin-col-email">{user.email}</td>
                    <td className="admin-col-role">
                      {isSelf(user._id) ? (
                        <span
                          className="role-badge-static"
                          style={{
                            background: ROLE_COLORS[user.role]?.bg,
                            color: ROLE_COLORS[user.role]?.color,
                            border: `1px solid ${ROLE_COLORS[user.role]?.border}`,
                          }}
                          title="You cannot change your own role"
                        >
                          {user.role}
                        </span>
                      ) : (
                        <select
                          className="role-select"
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(
                              user._id,
                              user.name,
                              e.target.value,
                              user.role
                            )
                          }
                          disabled={updatingId === user._id}
                          style={{
                            background: ROLE_COLORS[user.role]?.bg,
                            color: ROLE_COLORS[user.role]?.color,
                            borderColor: ROLE_COLORS[user.role]?.border,
                          }}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
