import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HeroFuturistic from "../components/ui/hero-futuristic";
import {
  CalendarPlus,
  CalendarDays,
  Clock3,
  CheckCircle2,
  MoreHorizontal,
  CalendarClock,
  XCircle,
  TrendingUp,
  ChevronRight,
  Sparkles,
  ArrowUpRight
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshUser();
    fetchLeaves();
  }, [user?.id]);

  const fetchLeaves = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/leaves/employee/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setLeaves(data);
      } else {
        const resAll = await fetch("/api/leaves");
        if (resAll.ok) {
          const allData = await resAll.json();
          const filtered = allData.filter(
            (l) => l.employeeId === user.id || (l.employeeName && l.employeeName.toLowerCase().includes(user.name?.toLowerCase()))
          );
          setLeaves(filtered);
        }
      }
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalAllocated = 20;
  const remainingDays = user?.leaveBalance !== undefined && user?.leaveBalance !== null ? user.leaveBalance : 11;
  const pendingCount = leaves.filter((l) => l.status === "PENDING").length;
  const approvedCount = leaves.filter((l) => l.status === "APPROVED").length;
  const upcomingCount = leaves.filter((l) => {
    if (l.status !== "APPROVED" || !l.startDate) return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    return new Date(l.startDate) >= today;
  }).length;

  const usedPercent = Math.min(100, Math.round(((totalAllocated - remainingDays) / totalAllocated) * 100));
  const displayName = user?.name || user?.fullName || "Kapilesh";

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="status approved">
            <CheckCircle2 size={14} /> Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="status rejected">
            <XCircle size={14} /> Rejected
          </span>
        );
      default:
        return (
          <span className="status pending">
            <Clock3 size={14} /> Pending
          </span>
        );
    }
  };

  return (
    <div className="page-dashboard">
      {/* FUTURISTIC WORKSPACE HERO HEADER */}
      <HeroFuturistic
        title="CampusLoop"
        subtitle={`Good morning, ${displayName}`}
        description="Here's your workplace overview."
        onApplyClick={() => navigate("/apply-leave")}
        onExploreClick={() => navigate("/calendar")}
        compact={true}
      />

      {/* METRIC CARDS GRID */}
      <div className="stats-grid">
        {/* AVAILABLE LEAVE */}
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon green">
              <CalendarDays size={20} />
            </div>
            <span className="trend" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}>Available</span>
          </div>
          <p>AVAILABLE LEAVE</p>
          <h2>{remainingDays} Days</h2>
          <small>Out of {totalAllocated} allocated days</small>
        </div>

        {/* PENDING REQUESTS */}
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon orange">
              <Clock3 size={20} />
            </div>
            <span className="trend" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}>Review</span>
          </div>
          <p>PENDING REQUESTS</p>
          <h2>{pendingCount}</h2>
          <small>Awaiting manager review</small>
        </div>

        {/* APPROVED LEAVE */}
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon blue">
              <CheckCircle2 size={20} />
            </div>
            <span className="trend">Granted</span>
          </div>
          <p>APPROVED LEAVE</p>
          <h2>{approvedCount}</h2>
          <small>Requests approved this year</small>
        </div>

        {/* UPCOMING LEAVE */}
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon purple">
              <CalendarClock size={20} />
            </div>
            <span className="trend">Scheduled</span>
          </div>
          <p>UPCOMING LEAVE</p>
          <h2>{upcomingCount}</h2>
          <small>Scheduled future absences</small>
        </div>
      </div>

      {/* LOWER DASHBOARD GRID */}
      <div className="dashboard-grid">
        {/* OVERVIEW PANEL */}
        <div className="panel overview">
          <div className="panel-header">
            <div>
              <h3>Workforce Leave Overview</h3>
              <p>Your annual leave utilization chart</p>
            </div>
            <button className="icon-button" style={{ background: "transparent", border: 0, color: "var(--text-muted)", cursor: "pointer" }}>
              <MoreHorizontal size={19} />
            </button>
          </div>

          <div className="chart-area">
            <div className="chart">
              <div className="bar-wrapper">
                <div className="bar" style={{ height: "48%" }}></div>
                <span>Jan</span>
              </div>
              <div className="bar-wrapper">
                <div className="bar" style={{ height: "65%" }}></div>
                <span>Feb</span>
              </div>
              <div className="bar-wrapper">
                <div className="bar active-bar" style={{ height: "82%" }}></div>
                <span>Mar</span>
              </div>
              <div className="bar-wrapper">
                <div className="bar" style={{ height: "55%" }}></div>
                <span>Apr</span>
              </div>
              <div className="bar-wrapper">
                <div className="bar" style={{ height: "38%" }}></div>
                <span>May</span>
              </div>
              <div className="bar-wrapper">
                <div className="bar" style={{ height: "28%" }}></div>
                <span>Jun</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI LEAVE BALANCE SUMMARY */}
        <div className="ai-card">
          <div className="ai-header">
            <div className="ai-logo">
              <TrendingUp size={20} />
            </div>
            <span>Leave Balance Summary</span>
          </div>
          <h3>
            You've used {usedPercent}%
            <br />
            of your annual leave balance.
          </h3>
          <p>
            {remainingDays} day{remainingDays === 1 ? "" : "s"} remaining out of {totalAllocated} allocated this year.
            {pendingCount > 0 ? ` You have ${pendingCount} request${pendingCount === 1 ? "" : "s"} awaiting approval.` : " No pending requests right now."}
          </p>
          <button onClick={() => navigate("/apply-leave")}>
            Apply for Leave <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* RECENT REQUESTS */}
      <div className="panel requests">
        <div className="panel-header">
          <div>
            <h3>Recent Leave Requests</h3>
            <p>Track your latest leave applications and manager status</p>
          </div>
          <button className="secondary-button" onClick={() => navigate("/my-leaves")} style={{ fontSize: "12px", padding: "6px 12px" }}>
            View all <ChevronRight size={15} />
          </button>
        </div>

        <div className="request-table">
          <div className="table-head">
            <span>LEAVE TYPE & APPLICANT</span>
            <span>DATES</span>
            <span>DURATION</span>
            <span>STATUS</span>
          </div>

          {loading ? (
            <div className="empty-state">Loading your leave requests...</div>
          ) : leaves.length === 0 ? (
            <div className="empty-state">
              No leave requests submitted yet. Click "Apply for Leave" to create one!
            </div>
          ) : (
            leaves.slice(0, 5).map((item) => (
              <div className="request-row" key={item.id}>
                <div className="leave-name">
                  <div className="table-icon">
                    <CalendarClock size={17} />
                  </div>
                  <div>
                    <strong>{item.leaveType}</strong>
                    <small>{item.employeeName || displayName}</small>
                  </div>
                </div>

                <span>
                  {item.startDate} – {item.endDate}
                </span>

                <span>{item.days || 1} {item.days === 1 ? "Day" : "Days"}</span>

                {getStatusBadge(item.status)}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
