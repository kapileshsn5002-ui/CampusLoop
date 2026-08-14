import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, Users, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "../config";


function TeamCalendar() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1));
  const [deptFilter, setDeptFilter] = useState("ALL");

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
      console.error("Failed to fetch leaves for calendar:", err);
    } finally {
      setLoading(false);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const getLeavesForDay = (dayNum) => {
    const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    const targetDate = new Date(dayStr);

    return leaves.filter((l) => {
      if (!l.startDate || !l.endDate) return false;
      if (deptFilter !== "ALL" && l.department && l.department !== deptFilter) return false;
      const start = new Date(l.startDate);
      const end = new Date(l.endDate);
      return targetDate >= start && targetDate <= end;
    });
  };

  return (
    <div className="page-container">
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent-cyan)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            WORKFORCE AVAILABILITY
          </span>
          <h1 style={{ margin: "4px 0 0", fontSize: "26px", fontWeight: 800, color: "#fff" }}>
            Team Schedule Calendar 🗓️
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-muted)" }}>
            Monitor department coverage and detect potential scheduling conflicts across teams.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button className="secondary-button" onClick={prevMonth}>
            <ChevronLeft size={16} />
          </button>
          <strong style={{ fontSize: "16px", color: "#fff", minWidth: "140px", textAlign: "center" }}>
            {monthNames[month]} {year}
          </strong>
          <button className="secondary-button" onClick={nextMonth}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* FILTER & LEGEND BAR */}
      <div className="panel" style={{ padding: "16px 24px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Filter size={15} color="var(--text-subtle)" />
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>Department:</span>
            {["ALL", "Software Engineering", "Product", "HR Leadership"].map((dept) => (
              <button
                key={dept}
                onClick={() => setDeptFilter(dept)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 600,
                  border: "1px solid",
                  cursor: "pointer",
                  background: deptFilter === dept ? "rgba(99, 102, 241, 0.2)" : "transparent",
                  borderColor: deptFilter === dept ? "rgba(99, 102, 241, 0.4)" : "rgba(255,255,255,0.08)",
                  color: deptFilter === dept ? "#818cf8" : "var(--text-muted)"
                }}
              >
                {dept}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "var(--text-muted)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34d399" }}></span> Approved
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fbbf24" }}></span> Pending
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f87171" }}></span> Rejected
            </div>
          </div>
        </div>
      </div>

      {/* CALENDAR GRID */}
      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
          background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--border-color)",
          padding: "12px 0", textAlign: "center", fontSize: "11px", fontWeight: 700, color: "var(--text-subtle)", textTransform: "uppercase"
        }}>
          <span>SUN</span>
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span>SAT</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <div key={`empty-${idx}`} style={{ minHeight: "110px", borderRight: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", background: "rgba(0,0,0,0.2)" }} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dayLeaves = getLeavesForDay(dayNum);

            return (
              <div
                key={dayNum}
                style={{
                  minHeight: "110px",
                  padding: "8px",
                  borderRight: "1px solid var(--border-color)",
                  borderBottom: "1px solid var(--border-color)",
                  background: dayLeaves.length > 0 ? "rgba(99, 102, 241, 0.03)" : "transparent"
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
                  {dayNum}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {dayLeaves.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: "3px 6px",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: 600,
                        background: item.status === "APPROVED" ? "rgba(16, 185, 129, 0.2)" : item.status === "REJECTED" ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)",
                        color: item.status === "APPROVED" ? "#34d399" : item.status === "REJECTED" ? "#f87171" : "#fbbf24",
                        border: "1px solid rgba(255,255,255,0.08)",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                      }}
                      title={`${item.employeeName || "Employee"} - ${item.leaveType} (${item.status})`}
                    >
                      {item.employeeName || "Kapilesh"}: {item.leaveType}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TeamCalendar;
