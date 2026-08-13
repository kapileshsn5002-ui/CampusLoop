import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AlertCircle, Lock, Mail, ShieldCheck, ArrowRight, User, Sparkles, CheckCircle2 } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();
  const canvasRef = useRef(null);

  const [email, setEmail] = useState("employee@campusloop.edu");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState("EMPLOYEE");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "MANAGER") {
        navigate("/manager", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Interactive particle grid & scan beam canvas animation on login left hero
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.offsetWidth || 600);
    let height = (canvas.height = canvas.parentElement.offsetHeight || 800);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const particleCount = 50;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.3
    }));

    let scanY = 0;
    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    canvas.parentElement.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Radial glowing ambient light
      const radialGlow = ctx.createRadialGradient(mouseX, mouseY, 10, width / 2, height / 2, width * 0.8);
      radialGlow.addColorStop(0, "rgba(99, 102, 241, 0.3)");
      radialGlow.addColorStop(0.5, "rgba(6, 182, 212, 0.12)");
      radialGlow.addColorStop(1, "rgba(7, 10, 18, 0)");
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // Vertical Scan Beam Effect
      scanY = (scanY + 1) % height;
      const scanGradient = ctx.createLinearGradient(0, scanY - 25, 0, scanY + 25);
      scanGradient.addColorStop(0, "rgba(6, 182, 212, 0)");
      scanGradient.addColorStop(0.5, "rgba(6, 182, 212, 0.4)");
      scanGradient.addColorStop(1, "rgba(6, 182, 212, 0)");
      ctx.fillStyle = scanGradient;
      ctx.fillRect(0, scanY - 25, width, 50);

      // Particle mesh connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129, 140, 248, ${p1.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - dist / 100) * 0.22})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email address and password.");
      return;
    }

    setSubmitting(true);
    const result = await login(email, password, role);
    setSubmitting(false);

    if (!result.success) {
      setError(result.error || "Login failed. Please check your credentials.");
    } else {
      const loggedInRole = result.user.role;
      if (loggedInRole === "MANAGER") {
        navigate("/manager");
      } else {
        navigate("/");
      }
    }
  };

  const handleFillDemo = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword("password123");
    setRole(demoRole);
    setError("");
  };

  return (
    <div className="login-page-split">
      {/* LEFT CINEMATIC HERO SIDE */}
      <div className="login-hero-side">
        {/* INTERACTIVE WEBGL CANVAS LAYER */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1,
            opacity: 0.85
          }}
        />

        {/* BRAND TOP */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", position: "relative", zIndex: 10 }}>
          <div className="brand-logo" style={{ width: "46px", height: "46px", fontSize: "24px" }}>C</div>
          <div>
            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
              Campus<span style={{ color: "#818cf8" }}>Loop</span>
            </h2>
            <p style={{ margin: "2px 0 0", fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
              Intelligent Workplace Platform
            </p>
          </div>
        </div>

        {/* CINEMATIC HERO CONTENT */}
        <div style={{ maxWidth: "580px", margin: "auto 0", position: "relative", zIndex: 10 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "20px",
            background: "rgba(99, 102, 241, 0.18)",
            border: "1px solid rgba(99, 102, 241, 0.35)",
            color: "#a5b4fc",
            fontSize: "13px",
            fontWeight: 700,
            marginBottom: "24px",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.25)"
          }}>
            <Sparkles size={16} color="#818cf8" />
            <span>Future-Ready HR Platform</span>
          </div>

          <h1 style={{
            fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)",
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: "-0.03em",
            color: "#ffffff",
            marginBottom: "16px",
            textTransform: "uppercase"
          }}>
            CampusLoop
          </h1>

          <h2 style={{
            fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
            fontWeight: 700,
            color: "#818cf8",
            lineHeight: 1.3,
            marginBottom: "20px"
          }}>
            Smarter leave management.<br />
            Better employee experiences.
          </h2>

          <p style={{
            fontSize: "15px",
            color: "#cbd5e1",
            lineHeight: 1.6,
            marginBottom: "36px"
          }}>
            Manage employee leave, approvals and workforce visibility through one intelligent workplace platform.
          </p>

          {/* FEATURE HIGHLIGHTS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#e2e8f0", fontSize: "14px" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399" }}>
                <CheckCircle2 size={16} />
              </div>
              <span>Real-time leave balance calculations & conflict checks</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#e2e8f0", fontSize: "14px" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399" }}>
                <CheckCircle2 size={16} />
              </div>
              <span>Manager Command Center with automated balance deduction</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#e2e8f0", fontSize: "14px" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399" }}>
                <CheckCircle2 size={16} />
              </div>
              <span>SHA-256 salted encryption & role-based security</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ fontSize: "12px", color: "var(--text-subtle)", position: "relative", zIndex: 10 }}>
          © 2026 CampusLoop Systems. All rights reserved.
        </div>
      </div>

      {/* RIGHT FORM SIDE */}
      <div className="login-form-side">
        <div className="login-card-v2">

          <div className="login-card-header">
            <div className="brand-logo" style={{ margin: "0 auto 12px", width: "50px", height: "50px", fontSize: "26px" }}>C</div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#fff" }}>Welcome Back</h2>
            <p>Sign in to your CampusLoop leave management portal</p>
          </div>

          {error && (
            <div className="alert-banner error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {location.state?.message && !error && (
            <div className="alert-banner warning">
              <AlertCircle size={18} />
              <span>{location.state.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* ROLE PILLS */}
            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label>Select Login Perspective</label>
              <div className="role-pills">
                <button
                  type="button"
                  className={`role-pill-btn ${role === "EMPLOYEE" ? "active" : ""}`}
                  onClick={() => setRole("EMPLOYEE")}
                >
                  <User size={15} /> Employee
                </button>
                <button
                  type="button"
                  className={`role-pill-btn ${role === "MANAGER" ? "active" : ""}`}
                  onClick={() => setRole("MANAGER")}
                >
                  <ShieldCheck size={15} /> Manager
                </button>
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Mail size={14} /> Email Address
              </label>
              <input
                type="email"
                placeholder="name@campusloop.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: "24px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Lock size={14} /> Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="primary-button"
              style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: "14.5px" }}
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign In to CampusLoop"}
              <ArrowRight size={16} />
            </button>

          </form>

          {/* QUICK DEMO ACCOUNTS HELPER */}
          <div style={{
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid var(--border-color)",
            textAlign: "left"
          }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Quick Demo Login:
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <button
                type="button"
                className="secondary-button"
                onClick={() => handleFillDemo("employee@campusloop.edu", "EMPLOYEE")}
                style={{ padding: "8px 10px", fontSize: "12px", justifyContent: "center" }}
              >
                👤 Employee
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => handleFillDemo("manager@campusloop.edu", "MANAGER")}
                style={{ padding: "8px 10px", fontSize: "12px", justifyContent: "center" }}
              >
                🛡️ Manager
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;