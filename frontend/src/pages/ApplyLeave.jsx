import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CalendarPlus, CheckCircle2, AlertCircle, ArrowLeft, Send, CheckSquare, CalendarDays } from "lucide-react";

function ApplyLeave() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    employeeName: user?.name || user?.fullName || "Kapilesh Sharma",
    leaveType: "Casual Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        employeeName: user.name || user.fullName || prev.employeeName,
      }));
    }
  }, [user]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess(false);
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return null;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = end - start;
    if (diffTime < 0) return null;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (
      !formData.employeeName.trim() ||
      !formData.leaveType.trim() ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.reason.trim()
    ) {
      setError("Please fill out all required fields.");
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("End date cannot be earlier than start date.");
      return;
    }

    const today = new Date();
    today.setHours(0,0,0,0);
    const selectedStart = new Date(formData.startDate);
    selectedStart.setHours(0,0,0,0);
    if (selectedStart < today) {
      setError("Cannot apply for leave dates in the past.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: user?.id || 1,
          employeeName: formData.employeeName,
          leaveType: formData.leaveType,
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason,
          department: user?.department || "Software Engineering",
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const errorMsg = data?.message || data?.error || "Failed to submit leave request.";
        throw new Error(errorMsg);
      }

      setSuccess(true);
      setFormData({
        employeeName: user?.name || user?.fullName || "Kapilesh Sharma",
        leaveType: "Casual Leave",
        startDate: "",
        endDate: "",
        reason: "",
      });
    } catch (err) {
      setError(err.message || "An error occurred while submitting your leave.");
    } finally {
      setSubmitting(false);
    }
  };

  const calculatedDays = calculateDays();
  const currentBalance = user?.leaveBalance !== undefined ? user.leaveBalance : 12;
  const remainingAfterDeduction = calculatedDays ? Math.max(0, currentBalance - calculatedDays) : currentBalance;

  return (
    <div className="page-container">
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent-cyan)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            EMPLOYEE WORKFLOW
          </span>
          <h1 style={{ margin: "4px 0 0", fontSize: "28px", fontWeight: 800, color: "#fff" }}>
            Request time away 📝
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "14px", color: "var(--text-muted)" }}>
            Submit your leave request and keep your team informed.
          </p>
        </div>

        <button className="secondary-button" onClick={() => navigate("/my-leaves")}>
          <ArrowLeft size={16} /> View My Leaves
        </button>
      </div>

      {/* TWO COLUMN WORKFLOW LAYOUT */}
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "24px" }}>
        {/* FORM PANEL LEFT */}
        <div className="panel">
          <div className="panel-header" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "16px", marginBottom: "24px" }}>
            <div>
              <h3>Leave Request Details</h3>
              <p>Fill out the parameters for your absence</p>
            </div>
            <div className="stat-icon purple">
              <CalendarPlus size={20} />
            </div>
          </div>

          {error && (
            <div className="alert-banner error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert-banner success">
              <CheckCircle2 size={18} />
              <div>
                <strong>Success! Your leave request has been submitted.</strong>
                <p style={{ margin: "2px 0 0", fontSize: "12px" }}>
                  Your request is PENDING manager approval. Track status in My Leaves.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "18px" }}>
              {/* EMPLOYEE NAME */}
              <div className="form-group">
                <label htmlFor="employeeName">Applicant Name *</label>
                <input
                  id="employeeName"
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* LEAVE TYPE */}
              <div className="form-group">
                <label htmlFor="leaveType">Leave Type *</label>
                <select
                  id="leaveType"
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  required
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Maternity/Paternity Leave">Maternity / Paternity Leave</option>
                </select>
              </div>

              {/* START DATE */}
              <div className="form-group">
                <label htmlFor="startDate">Start Date *</label>
                <input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* END DATE */}
              <div className="form-group">
                <label htmlFor="endDate">End Date *</label>
                <input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* REASON */}
            <div className="form-group" style={{ marginBottom: "24px" }}>
              <label htmlFor="reason">Reason for Leave *</label>
              <textarea
                id="reason"
                name="reason"
                rows={4}
                value={formData.reason}
                onChange={handleChange}
                placeholder="State the purpose for your time away request..."
                required
              />
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
              <button type="button" className="secondary-button" onClick={() => navigate("/")}>
                Cancel
              </button>

              <button type="submit" className="primary-button" disabled={submitting}>
                {submitting ? "Submitting..." : (
                  <>
                    <Send size={16} /> Submit Leave Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* REQUEST SUMMARY PANEL RIGHT */}
        <div>
          <div className="panel" style={{ position: "sticky", top: "90px" }}>
            <div className="panel-header" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "14px", marginBottom: "18px" }}>
              <div>
                <h3 style={{ textTransform: "uppercase", fontSize: "14px", letterSpacing: "0.05em", color: "#a5b4fc" }}>REQUEST SUMMARY</h3>
                <p>Live request duration & balance preview</p>
              </div>
              <CheckSquare size={20} color="var(--accent-cyan)" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Leave Type</span>
                <strong style={{ display: "block", fontSize: "15px", color: "#fff", marginTop: "2px" }}>{formData.leaveType}</strong>
              </div>

              <div style={{ padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Dates</span>
                <strong style={{ display: "block", fontSize: "14px", color: "#fff", marginTop: "2px" }}>
                  {formData.startDate && formData.endDate ? `${formData.startDate} → ${formData.endDate}` : "Select dates above"}
                </strong>
              </div>

              <div style={{ padding: "14px", background: "rgba(99, 102, 241, 0.14)", borderRadius: "10px", border: "1px solid rgba(99, 102, 241, 0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "11px", color: "#a5b4fc", textTransform: "uppercase", fontWeight: 700 }}>Duration</span>
                  <p style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#fff" }}>
                    {calculatedDays !== null ? `${calculatedDays} ${calculatedDays === 1 ? "Day" : "Days"}` : "0 Days"}
                  </p>
                </div>
                <CalendarDays size={28} color="#818cf8" />
              </div>

              <div style={{ padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
                  <span>Current Available Balance</span>
                  <strong style={{ color: "#fff" }}>{currentBalance} Days</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)" }}>
                  <span>Remaining Balance</span>
                  <strong style={{ color: calculatedDays && calculatedDays > currentBalance ? "#f87171" : "#34d399" }}>
                    {remainingAfterDeduction} Days
                  </strong>
                </div>
              </div>

              {calculatedDays !== null && calculatedDays > currentBalance && (
                <div className="alert-banner error" style={{ padding: "8px 12px", fontSize: "12px" }}>
                  <AlertCircle size={14} /> Duration exceeds available balance!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyLeave;