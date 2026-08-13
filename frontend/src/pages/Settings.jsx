import { useState } from "react";
import { Settings as SettingsIcon, Bell, Lock, Globe, Check, ShieldCheck, Moon, Laptop } from "lucide-react";

const TIMEZONES = [
  "Asia/Kolkata (IST)",
  "Asia/Dubai (GST)",
  "Europe/London (GMT)",
  "America/New_York (EST)",
  "America/Los_Angeles (PST)",
  "Asia/Singapore (SGT)",
  "Australia/Sydney (AEST)",
];

function Settings() {
  const [emailNotifs, setEmailNotifs] = useState(
    () => localStorage.getItem("campusloop_emailNotifs") !== "false"
  );
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    () => localStorage.getItem("campusloop_2fa") === "true"
  );
  const [timezone, setTimezone] = useState(
    () => localStorage.getItem("campusloop_timezone") || "Asia/Kolkata (IST)"
  );

  const [show2FAPanel, setShow2FAPanel] = useState(false);
  const [showTimezonePanel, setShowTimezonePanel] = useState(false);
  const [saved, setSaved] = useState("");

  const toggleEmailNotifs = () => {
    const newVal = !emailNotifs;
    setEmailNotifs(newVal);
    localStorage.setItem("campusloop_emailNotifs", String(newVal));
    flashSaved("Notification preference updated");
  };

  const confirm2FA = (enable) => {
    setTwoFactorEnabled(enable);
    localStorage.setItem("campusloop_2fa", String(enable));
    setShow2FAPanel(false);
    flashSaved(enable ? "Two-Factor Authentication enabled" : "Two-Factor Authentication disabled");
  };

  const confirmTimezone = (tz) => {
    setTimezone(tz);
    localStorage.setItem("campusloop_timezone", tz);
    setShowTimezonePanel(false);
    flashSaved("Timezone updated to " + tz);
  };

  const flashSaved = (msg) => {
    setSaved(msg);
    setTimeout(() => setSaved(""), 2500);
  };

  return (
    <div className="page-container">
      {/* HEADER */}
      <div style={{ marginBottom: "28px" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent-cyan)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          SYSTEM CONFIGURATION
        </span>
        <h1 style={{ margin: "4px 0 0", fontSize: "26px", fontWeight: 800, color: "#fff" }}>
          Settings & Preferences ⚙️
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-muted)" }}>
          Configure notification preferences, security options, and regional portal settings.
        </p>
      </div>

      {saved && (
        <div className="alert-banner success" style={{ marginBottom: "20px" }}>
          <Check size={18} />
          <span>{saved}</span>
        </div>
      )}

      {/* SETTINGS PANEL */}
      <div className="panel" style={{ maxWidth: "840px" }}>
        <div className="panel-header" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "14px", marginBottom: "20px" }}>
          <div>
            <h3>Account & System Preferences</h3>
            <p>Tailor your leave management portal experience</p>
          </div>
          <div className="stat-icon purple">
            <SettingsIcon size={20} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* EMAIL NOTIFICATIONS */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(99, 102, 241, 0.15)", color: "#818cf8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bell size={18} />
              </div>
              <div>
                <strong style={{ color: "#fff", fontSize: "14px" }}>Email Notifications</strong>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0" }}>Receive automatic email alerts when manager approves or rejects leave</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={toggleEmailNotifs}
              style={{ width: "20px", height: "20px", accentColor: "#6366f1", cursor: "pointer" }}
            />
          </div>

          {/* TWO-FACTOR AUTH */}
          <div style={{ padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Lock size={18} />
                </div>
                <div>
                  <strong style={{ color: "#fff", fontSize: "14px" }}>Two-Factor Security (2FA)</strong>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0" }}>
                    Status: <span style={{ color: twoFactorEnabled ? "#34d399" : "var(--text-muted)", fontWeight: 600 }}>{twoFactorEnabled ? "Enabled ✅" : "Disabled"}</span>
                  </p>
                </div>
              </div>
              <button className="secondary-button" onClick={() => setShow2FAPanel(!show2FAPanel)}>
                {show2FAPanel ? "Cancel" : "Configure"}
              </button>
            </div>

            {show2FAPanel && (
              <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--border-color)", display: "flex", gap: "10px" }}>
                <button className="primary-button" onClick={() => confirm2FA(true)}>Enable 2FA</button>
                <button className="secondary-button" onClick={() => confirm2FA(false)}>Disable 2FA</button>
              </div>
            )}
          </div>

          {/* TIMEZONE */}
          <div style={{ padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(6, 182, 212, 0.15)", color: "#38bdf8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Globe size={18} />
                </div>
                <div>
                  <strong style={{ color: "#fff", fontSize: "14px" }}>Timezone & Region</strong>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0" }}>Active timezone: {timezone}</p>
                </div>
              </div>
              <button className="secondary-button" onClick={() => setShowTimezonePanel(!showTimezonePanel)}>
                {showTimezonePanel ? "Cancel" : "Change"}
              </button>
            </div>

            {showTimezonePanel && (
              <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--border-color)" }}>
                <div className="form-group">
                  <select value={timezone} onChange={(e) => confirmTimezone(e.target.value)}>
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Settings;
