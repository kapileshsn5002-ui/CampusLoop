import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import {
  LayoutDashboard,
  CalendarPlus,
  CalendarDays,
  User,
  Settings,
  LogOut,
  Sparkles,
  ArrowUpRight,
  Search,
  Bell,
  ShieldCheck,
  Calendar,
  BarChart3,
  UserCheck,
  Menu,
  X
} from "lucide-react";
import "./App.css";

function Layout() {
  const navigate = useNavigate();
  const { user, logout, isManager } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      logout();
      navigate("/login", { replace: true, state: { message: "You've been logged out successfully." } });
    }
  };

  const displayName = user?.name || user?.fullName || "Employee";
  const displayRole = user?.role === "MANAGER" ? "Manager / HR Lead" : "Software Engineer";
  const avatarChar = displayName.charAt(0).toUpperCase();

  return (
    <div className="app">

      {/* MOBILE BACKDROP */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 95
          }}
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>

        <div className="brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <div className="brand-logo">C</div>
          <div className="brand-text">
            <h2>Campus<span>Loop</span></h2>
            <p>{isManager ? "Manager Portal" : "Employee Portal"}</p>
          </div>
        </div>

        <nav className="navigation">

          <p className="nav-title">MAIN MENU</p>

          <NavLink
            to="/"
            end
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/apply-leave"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <CalendarPlus size={18} />
            Apply Leave
          </NavLink>

          <NavLink
            to="/my-leaves"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <CalendarDays size={18} />
            My Leaves
          </NavLink>

          <p className="nav-title settings-title">MANAGEMENT & HR</p>

          <NavLink
            to="/manager"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <ShieldCheck size={18} />
            Manager Portal
            <span className={`ai-badge ${isManager ? "manager-badge" : ""}`}>
              {isManager ? "Active" : "HR"}
            </span>
          </NavLink>

          <NavLink
            to="/calendar"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Calendar size={18} />
            Team Calendar
          </NavLink>

          <NavLink
            to="/analytics"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <BarChart3 size={18} />
            HR Analytics
          </NavLink>

          <p className="nav-title settings-title">ACCOUNT</p>

          <NavLink
            to="/profile"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <User size={18} />
            Employee Profile
          </NavLink>

          <NavLink
            to="/settings"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Settings size={18} />
            Settings
          </NavLink>

        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">
              <Sparkles size={16} />
            </div>
            <h4>Need assistance?</h4>
            <p>Check leave policy guidelines or contact HR lead.</p>
            <button onClick={() => navigate("/settings")}>
              View Policy <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="nav-item logout" style={{ cursor: "pointer" }} onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </div>
        </div>

      </aside>

      {/* MAIN LAYOUT WRAPPER */}
      <main className="main-content">

        {/* TOP BAR */}
        <header className="topbar">

          <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="search-box">
            <Search size={16} />
            <input type="text" placeholder="Search leave records, dates, employees..." />
            <span>⌘ K</span>
          </div>

          <div className="top-actions">

            {/* ROLE INDICATOR */}
            <div className="role-switcher" style={{ cursor: "default" }}>
              <UserCheck size={15} />
              <span>Role: <strong>{user?.role || "EMPLOYEE"}</strong></span>
              <span className="switch-pill" style={{ background: isManager ? "#10b981" : "var(--primary-indigo)", color: "#fff" }}>
                {isManager ? "Manager" : "Employee"}
              </span>
            </div>

            <button className="notification" title="Notifications">
              <Bell size={18} />
              <span></span>
            </button>

            <div className="profile-widget" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
              <div className="avatar">
                {avatarChar}
              </div>
              <div className="profile-info">
                <strong>{displayName}</strong>
                <small>{displayRole}</small>
              </div>
            </div>

          </div>

        </header>

        {/* PAGE CONTENT OUTLET */}
        <section className="content">
          <Outlet />
        </section>

      </main>

    </div>
  );
}

export default Layout;
