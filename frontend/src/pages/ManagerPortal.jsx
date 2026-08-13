import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  CheckCircle2,
  XCircle,
  Clock3,
  Users,
  MessageSquare,
  RefreshCw,
  Search,
  Check,
  X,
  ShieldCheck
} from "lucide-react";

function ManagerPortal() {
  const { refreshUser } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [managerComment, setManagerComment] = useState("");
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leaves");
      if (res.ok) {
        const data = await res.json();
        setLeaves(data);
      }
    } catch (err) {
      console.error("Failed to fetch leaves for manager:", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenModal = (request, action) => {
    setActiveModal({ request, action });
    setManagerComment("");
  };

  const handleConfirmDecision = async () => {
    if (!activeModal) return;

    const { request, action } = activeModal;
    try {
      setProcessing(true);
      const res = await fetch(`/api/leaves/${request.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action,
          comment: managerComment.trim() || (action === "APPROVED" ? "Approved by manager" : "Request rejected by manager"),
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || errJson?.error || "Failed to update leave status.");
      }

      showToast(
        `Leave request for ${request.employeeName || "Employee"} was ${action.toLowerCase()} successfully!`,
        action === "APPROVED" ? "success" : "warning"
      );

      setActiveModal(null);
      refreshUser();
      fetchLeaves();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const pendingCount = leaves.filter((l) => l.status === "PENDING").length;
  const approvedCount = leaves.filter((l) => l.status === "APPROVED").length;
  const rejectedCount = leaves.filter((l) => l.status === "REJECTED").length;

  const filteredLeaves = leaves.filter((l) => {
    const matchesFilter = filter === "ALL" || l.status === filter;
    const matchesSearch =
      searchQuery === "" ||
      (l.leaveType && l.leaveType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.reason && l.reason.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.employeeName && l.employeeName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="page-container">
      {/* TOAST BANNER */}
      {toast && (
        <div className={`alert-banner ${toast.type === "success" ? "success" : "warning"}`} style={{ marginBottom: "20px" }}>
          <CheckCircle2 size={18} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent-cyan)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            MANAGER CONSOLE
          </span>
          <h1 style={{ margin: "4px 0 0", fontSize: "28px", fontWeight: 800, color: "#fff" }}>
            Manager Command Center 🛡️
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "14px", color: "var(--text-muted)" }}>
            Review employee leave requests and keep your team moving.
          </p>
        </div>

        <button className="secondary-button" onClick={fetchLeaves}>
          <RefreshCw size={15} className={loading ? "spin" : ""} /> Sync Queue
        </button>
      </div>

      {/* STATISTICS CARDS */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => setFilter("PENDING")} style={{ cursor: "pointer" }}>
          <div className="stat-top">
            <div className="stat-icon orange"><Clock3 size={20} /></div>
            <span className="trend">{pendingCount} Action Needed</span>
          </div>
          <p>Pending Approval</p>
          <h2>{pendingCount}</h2>
          <small>Awaiting your decision</small>
        </div>

        <div className="stat-card" onClick={() => setFilter("APPROVED")} style={{ cursor: "pointer" }}>
          <div className="stat-top">
            <div className="stat-icon green"><CheckCircle2 size={20} /></div>
            <span className="trend">Granted</span>
          </div>
          <p>Approved</p>
          <h2>{approvedCount}</h2>
          <small>Leave days granted</small>
        </div>

        <div className="stat-card" onClick={() => setFilter("REJECTED")} style={{ cursor: "pointer" }}>
          <div className="stat-top">
            <div className="stat-icon red" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171" }}><XCircle size={20} /></div>
            <span className="trend">Declined</span>
          </div>
          <p>Rejected</p>
          <h2>{rejectedCount}</h2>
          <small>Declined applications</small>
        </div>

        <div className="stat-card" onClick={() => setFilter("ALL")} style={{ cursor: "pointer" }}>
          <div className="stat-top">
            <div className="stat-icon purple"><Users size={20} /></div>
            <span className="trend">Active Team</span>
          </div>
          <p>Team Members</p>
          <h2>{leaves.length}</h2>
          <small>Total submitted requests</small>
        </div>
      </div>

      {/* MAIN SECTION: LEAVE REQUESTS */}
      <div className="panel">
        <div className="panel-header" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "16px", marginBottom: "20px" }}>
          <div>
            <h3>Leave Requests Queue</h3>
            <p>Review employee applications and decide on approvals</p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div className="search-box" style={{ width: "240px", background: "rgba(255,255,255,0.04)" }}>
              <Search size={15} />
              <input
                type="text"
                placeholder="Search employee or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "6px" }}>
              {["PENDING", "APPROVED", "REJECTED", "ALL"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilter(st)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                    border: "1px solid",
                    cursor: "pointer",
                    background: filter === st ? "rgba(99, 102, 241, 0.2)" : "transparent",
                    borderColor: filter === st ? "rgba(99, 102, 241, 0.4)" : "rgba(255,255,255,0.08)",
                    color: filter === st ? "#818cf8" : "var(--text-muted)"
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Loading leave queue...</div>
        ) : filteredLeaves.length === 0 ? (
          <div className="empty-state">
            <ShieldCheck size={36} color="var(--accent-teal)" style={{ marginBottom: "12px" }} />
            <p style={{ margin: 0, fontWeight: 600, color: "#fff" }}>
              {filter === "PENDING" ? "No pending approvals." : "No requests found for this filter."}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredLeaves.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.8fr 1.4fr 2fr 1.2fr 1.4fr",
                  alignItems: "center",
                  padding: "16px 20px",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "12px"
                }}
              >
                {/* EMPLOYEE & DEPT */}
                <div className="leave-name">
                  <div className="avatar" style={{ width: "38px", height: "38px", fontSize: "15px" }}>
                    {(item.employeeName || "E").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <strong style={{ color: "#fff", fontSize: "14px" }}>{item.employeeName || "Kapilesh Sharma"}</strong>
                    <small style={{ color: "var(--text-muted)" }}>{item.leaveType} • {item.department || "Software Engineering"}</small>
                  </div>
                </div>

                {/* DATES */}
                <div>
                  <strong style={{ color: "#fff", fontSize: "13px", display: "block" }}>{item.startDate} → {item.endDate}</strong>
                  <small style={{ color: "#a5b4fc", fontWeight: 600 }}>{item.days || 1} {item.days === 1 ? "Day" : "Days"}</small>
                </div>

                {/* REASON */}
                <div style={{ paddingRight: "12px" }}>
                  <p style={{ margin: 0, fontSize: "12.5px", color: "#cbd5e1", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    "{item.reason || "No reason specified"}"
                  </p>
                </div>

                {/* STATUS & COMMENT */}
                <div>
                  {item.status === "APPROVED" && (
                    <span className="status approved"><CheckCircle2 size={13} /> APPROVED</span>
                  )}
                  {item.status === "REJECTED" && (
                    <span className="status rejected"><XCircle size={13} /> REJECTED</span>
                  )}
                  {item.status === "PENDING" && (
                    <span className="status pending"><Clock3 size={13} /> PENDING</span>
                  )}
                  {item.managerComment && (
                    <div style={{ marginTop: "4px", fontSize: "11px", color: "var(--text-muted)" }}>
                      💬 {item.managerComment}
                    </div>
                  )}
                </div>

                {/* ACTIONS: APPROVE (GREEN) & REJECT (RED) */}
                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                  {item.status === "PENDING" ? (
                    <>
                      <button
                        onClick={() => handleOpenModal(item, "APPROVED")}
                        style={{
                          background: "linear-gradient(135deg, #10b981, #059669)",
                          color: "#ffffff",
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: "8px",
                          fontWeight: 700,
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
                        }}
                      >
                        <Check size={14} /> APPROVE
                      </button>
                      <button
                        onClick={() => handleOpenModal(item, "REJECTED")}
                        style={{
                          background: "linear-gradient(135deg, #ef4444, #dc2626)",
                          color: "#ffffff",
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: "8px",
                          fontWeight: 700,
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)"
                        }}
                      >
                        <X size={14} /> REJECT
                      </button>
                    </>
                  ) : (
                    <button
                      className="secondary-button"
                      onClick={() => handleOpenModal(item, item.status === "APPROVED" ? "REJECTED" : "APPROVED")}
                      style={{ padding: "6px 10px", fontSize: "11px" }}
                    >
                      Update Decision
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DECISION MODAL */}
      {activeModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px"
        }}>
          <div style={{
            background: "#151c2c", border: "1px solid var(--border-color)", borderRadius: "16px",
            width: "100%", maxWidth: "480px", padding: "24px", boxShadow: "0 20px 50px rgba(0,0,0,0.7)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#fff" }}>
                {activeModal.action === "APPROVED" ? "Approve Leave Request" : "Reject Leave Request"}
              </h3>
              <button onClick={() => setActiveModal(null)} style={{ background: "transparent", border: 0, color: "var(--text-muted)", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "14px", marginBottom: "18px", fontSize: "13px" }}>
              <p style={{ margin: "0 0 6px", color: "#fff" }}><strong>Employee:</strong> {activeModal.request.employeeName || "Kapilesh Sharma"}</p>
              <p style={{ margin: "0 0 6px", color: "#fff" }}><strong>Leave Type:</strong> {activeModal.request.leaveType}</p>
              <p style={{ margin: "0 0 6px", color: "#fff" }}><strong>Dates:</strong> {activeModal.request.startDate} → {activeModal.request.endDate} ({activeModal.request.days || 1} Days)</p>
              <p style={{ margin: 0, color: "var(--text-muted)" }}><strong>Reason:</strong> "{activeModal.request.reason}"</p>
            </div>

            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label>Manager Note / Feedback (Optional)</label>
              <textarea
                rows={3}
                value={managerComment}
                onChange={(e) => setManagerComment(e.target.value)}
                placeholder={activeModal.action === "APPROVED" ? "Approved! Enjoy your leave." : "Declined due to critical project release."}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button className="secondary-button" onClick={() => setActiveModal(null)} disabled={processing}>
                Cancel
              </button>
              <button
                className="primary-button"
                onClick={handleConfirmDecision}
                disabled={processing}
                style={{
                  background: activeModal.action === "APPROVED" ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #ef4444, #dc2626)"
                }}
              >
                {processing ? "Updating..." : `Confirm ${activeModal.action === "APPROVED" ? "Approval" : "Rejection"}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerPortal;
