import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, CheckCircle2, Clock3, PieChart, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "../config";


function Analytics() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/leaves`);
      if (res.ok) {
        const data = await res.json();
        setLeaves(data);
      }
    } catch (err) {
      console.error("Failed to fetch leaves for analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const total = leaves.length;
  const approved = leaves.filter((l) => l.status === "APPROVED").length;
  const pending = leaves.filter((l) => l.status === "PENDING").length;
  const rejected = leaves.filter((l) => l.status === "REJECTED").length;

  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  const annualCount = leaves.filter((l) => l.leaveType === "Annual Leave" || l.leaveType === "ANNUAL").length;
  const casualCount = leaves.filter((l) => l.leaveType === "Casual Leave" || l.leaveType === "CASUAL").length;
  const sickCount = leaves.filter((l) => l.leaveType === "Sick Leave" || l.leaveType === "SICK").length;
  const otherCount = total - (annualCount + casualCount + sickCount);

  return (
    <div className="page-container">
      {/* HEADER */}
      <div style={{ marginBottom: "28px" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent-cyan)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          EXECUTIVE DASHBOARD
        </span>
        <h1 style={{ margin: "4px 0 0", fontSize: "28px", fontWeight: 800, color: "#fff" }}>
          Workforce Insights 📊
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: "14px", color: "var(--text-muted)" }}>
          Understand leave trends across your organization.
        </p>
      </div>

      {/* METRICS ROW */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon purple"><BarChart3 size={20} /></div>
            <span className="trend">System Wide</span>
          </div>
          <p>Leave Utilization</p>
          <h2>{total} Requests</h2>
          <small>Total submissions recorded</small>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon green"><TrendingUp size={20} /></div>
            <span className="trend">Efficiency</span>
          </div>
          <p>Approval Rate</p>
          <h2>{approvalRate}%</h2>
          <small>{approved} approved out of {total}</small>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon orange"><Clock3 size={20} /></div>
            <span className="trend">Queue</span>
          </div>
          <p>Pending Requests</p>
          <h2>{pending}</h2>
          <small>Awaiting manager review</small>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon blue"><Users size={20} /></div>
            <span className="trend">Department Trends</span>
          </div>
          <p>Active Workflows</p>
          <h2>3</h2>
          <small>Software, Product, HR</small>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="dashboard-grid">
        {/* LEAVE TYPE DISTRIBUTION */}
        <div className="panel">
          <div className="panel-header" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "14px", marginBottom: "20px" }}>
            <div>
              <h3>Leave Category Breakdown</h3>
              <p>Categorized employee leave applications</p>
            </div>
            <PieChart size={20} color="var(--accent-cyan)" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#fff", marginBottom: "6px" }}>
                <span>Casual Leave</span>
                <strong>{casualCount} Requests</strong>
              </div>
              <div style={{ height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${total > 0 ? (casualCount / total) * 100 : 0}%`, height: "100%", background: "#06b6d4" }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#fff", marginBottom: "6px" }}>
                <span>Annual Leave</span>
                <strong>{annualCount} Requests</strong>
              </div>
              <div style={{ height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${total > 0 ? (annualCount / total) * 100 : 0}%`, height: "100%", background: "#6366f1" }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#fff", marginBottom: "6px" }}>
                <span>Sick Leave</span>
                <strong>{sickCount} Requests</strong>
              </div>
              <div style={{ height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${total > 0 ? (sickCount / total) * 100 : 0}%`, height: "100%", background: "#fbbf24" }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#fff", marginBottom: "6px" }}>
                <span>Maternity / Paternity / Other</span>
                <strong>{otherCount} Requests</strong>
              </div>
              <div style={{ height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${total > 0 ? (otherCount / total) * 100 : 0}%`, height: "100%", background: "#8b5cf6" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* DECISION DISTRIBUTION */}
        <div className="ai-card">
          <div className="ai-header">
            <div className="ai-logo"><ShieldCheck size={20} /></div>
            <span>Governance Insights</span>
          </div>

          <h3>Approval Velocity</h3>
          <p>
            Out of {total} total submitted applications, {approved} ({approvalRate}%) have been approved, {rejected} declined, and {pending} remain in the active review queue.
          </p>

          <div style={{ padding: "16px", background: "rgba(0,0,0,0.2)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "12px", color: "#a5b4fc", marginBottom: "4px" }}>System Status</div>
            <strong style={{ fontSize: "16px", color: "#fff" }}>MySQL Data Operational</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
