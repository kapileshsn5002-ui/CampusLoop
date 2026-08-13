import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CalendarDays, CalendarPlus, Search, Filter, CheckCircle2, Clock3, XCircle, FileText, MessageSquare } from "lucide-react";

function MyLeaves() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
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
      console.error("Failed to fetch leave history:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="status approved">
            <CheckCircle2 size={13} /> APPROVED
          </span>
        );
      case "REJECTED":
        return (
          <span className="status rejected">
            <XCircle size={13} /> REJECTED
          </span>
        );
      default:
        return (
          <span className="status pending">
            <Clock3 size={13} /> PENDING
          </span>
        );
    }
  };

  const filteredLeaves = leaves.filter((item) => {
    const matchesSearch =
      (item.leaveType && item.leaveType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.reason && item.reason.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container">
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent-cyan)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            EMPLOYEE PORTAL
          </span>
          <h1 style={{ margin: "4px 0 0", fontSize: "28px", fontWeight: 800, color: "#fff" }}>
            My Leave Requests 📅
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "14px", color: "var(--text-muted)" }}>
            Track your leave history and request status.
          </p>
        </div>

        <button className="primary-button" onClick={() => navigate("/apply-leave")}>
          <CalendarPlus size={16} /> Request Time Away
        </button>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="panel" style={{ padding: "18px 24px", marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          {/* SEARCH INPUT */}
          <div className="search-box" style={{ width: "320px", background: "rgba(255,255,255,0.04)" }}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by leave type or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* STATUS PILLS */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Filter size={15} color="var(--text-subtle)" />
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, marginRight: "4px" }}>Filter:</span>

            {["ALL", "PENDING", "APPROVED", "REJECTED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 600,
                  border: "1px solid",
                  cursor: "pointer",
                  background: statusFilter === st ? "rgba(99, 102, 241, 0.2)" : "transparent",
                  borderColor: statusFilter === st ? "rgba(99, 102, 241, 0.4)" : "rgba(255,255,255,0.08)",
                  color: statusFilter === st ? "#818cf8" : "var(--text-muted)"
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LEAVES TABLE PANEL */}
      <div className="panel">
        <div className="panel-header" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "14px", marginBottom: "18px" }}>
          <div>
            <h3>Submitted Leave Records ({filteredLeaves.length})</h3>
            <p>Historical time-off submissions and approval status</p>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Loading your leave records...</div>
        ) : filteredLeaves.length === 0 ? (
          <div className="empty-state">
            <FileText size={36} color="var(--text-subtle)" style={{ marginBottom: "12px" }} />
            <p style={{ margin: 0, fontWeight: 600, color: "#fff" }}>No leave requests yet.</p>
            <small style={{ color: "var(--text-muted)" }}>Submit your first time-off request using the button above.</small>
          </div>
        ) : (
          <div className="request-table">
            <div className="table-head">
              <span>LEAVE TYPE & REASON</span>
              <span>DATES</span>
              <span>DURATION</span>
              <span>STATUS & MANAGER NOTE</span>
            </div>

            {filteredLeaves.map((item) => (
              <div className="request-row" key={item.id} style={{ gridTemplateColumns: "2fr 1.5fr 1fr 1.5fr" }}>
                <div className="leave-name">
                  <div className="table-icon">
                    <CalendarDays size={18} />
                  </div>
                  <div>
                    <strong>{item.leaveType}</strong>
                    <small>{item.reason || "No reason specified"}</small>
                  </div>
                </div>

                <span style={{ fontSize: "13px" }}>
                  {item.startDate} → {item.endDate}
                </span>

                <span style={{ fontWeight: 600, color: "#fff" }}>
                  {item.days || 1} {item.days === 1 ? "Day" : "Days"}
                </span>

                <div>
                  {getStatusBadge(item.status)}
                  {item.managerComment && (
                    <div style={{ marginTop: "6px", fontSize: "11px", color: "var(--text-muted)", display: "flex", gap: "4px", alignItems: "center" }}>
                      <MessageSquare size={12} color="#a5b4fc" /> {item.managerComment}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyLeaves;