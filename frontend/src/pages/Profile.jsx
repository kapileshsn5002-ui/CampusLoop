import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield, Check, Pencil, Calendar, Building, ShieldCheck, Award } from "lucide-react";

function Profile() {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(user?.name || user?.fullName || "Kapilesh Sharma");
  const [email, setEmail] = useState(user?.email || "employee@campusloop.edu");
  const [role, setRole] = useState(user?.role || "EMPLOYEE");
  const [department, setDepartment] = useState(user?.department || "Software Engineering");

  useEffect(() => {
    if (user) {
      setName(user.name || user.fullName || "Kapilesh Sharma");
      setEmail(user.email || "employee@campusloop.edu");
      setRole(user.role || "EMPLOYEE");
      setDepartment(user.department || "Software Engineering");
    }
  }, [user]);

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name,
      fullName: name,
      email,
      role,
      department,
    };
    setUser(updatedUser);
    localStorage.setItem("campusloop_user", JSON.stringify(updatedUser));
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const avatarChar = name.charAt(0).toUpperCase();

  return (
    <div className="page-container">
      {/* HEADER */}
      <div style={{ marginBottom: "28px" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent-cyan)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          ACCOUNT OVERVIEW
        </span>
        <h1 style={{ margin: "4px 0 0", fontSize: "26px", fontWeight: 800, color: "#fff" }}>
          Employee Profile 👤
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-muted)" }}>
          Manage your personal information, department assignment, and leave balance quota.
        </p>
      </div>

      {saved && (
        <div className="alert-banner success" style={{ marginBottom: "20px" }}>
          <Check size={18} />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* PROFILE GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
        {/* AVATAR CARD LEFT */}
        <div className="panel" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div className="avatar" style={{ width: "80px", height: "80px", fontSize: "32px", borderRadius: "20px", marginBottom: "16px" }}>
            {avatarChar}
          </div>
          <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 800, color: "#fff" }}>{name}</h2>
          <p style={{ margin: "0 0 16px", fontSize: "13px", color: "var(--text-muted)" }}>{email}</p>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            <span className="status approved" style={{ fontSize: "11px" }}>
              <ShieldCheck size={12} /> Role: {role}
            </span>
            <span className="trend" style={{ fontSize: "11px" }}>
              <Building size={12} /> {department}
            </span>
          </div>

          <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-color)", width: "100%", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>
              <span>Leave Balance Available:</span>
              <strong style={{ color: "#34d399", fontWeight: 700 }}>
                {user?.leaveBalance !== undefined ? user.leaveBalance : 11} Days
              </strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--text-muted)" }}>
              <span>Annual Allocation:</span>
              <strong style={{ color: "#fff" }}>20 Days</strong>
            </div>
          </div>
        </div>

        {/* DETAILS PANEL RIGHT */}
        <div className="panel">
          <div className="panel-header" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "14px", marginBottom: "20px" }}>
            <div>
              <h3>Profile Information</h3>
              <p>Personal credentials & organization details</p>
            </div>

            {!editing && (
              <button className="secondary-button" onClick={() => setEditing(true)}>
                <Pencil size={14} /> Edit Profile
              </button>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="form-group">
              <label><User size={14} /> Full Name</label>
              <input
                type="text"
                value={name}
                readOnly={!editing}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label><Mail size={14} /> Work Email Address</label>
              <input
                type="email"
                value={email}
                readOnly={!editing}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label><Shield size={14} /> Access Role Perspective</label>
              <input type="text" value={role} readOnly />
            </div>

            <div className="form-group">
              <label><Building size={14} /> Department</label>
              <input
                type="text"
                value={department}
                readOnly={!editing}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label><Calendar size={14} /> Available Leave Quota</label>
              <input
                type="text"
                value={`${user?.leaveBalance !== undefined ? user.leaveBalance : 12} Days Remaining`}
                readOnly
              />
            </div>

            {editing && (
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
                <button className="secondary-button" onClick={() => setEditing(false)}>Cancel</button>
                <button className="primary-button" onClick={handleSave}>Save Profile</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
