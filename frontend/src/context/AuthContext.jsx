import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("campusloop_user");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      localStorage.removeItem("campusloop_user");
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password, requestedRole) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: requestedRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Authentication failed.");
      }

      setUser(data);
      localStorage.setItem("campusloop_user", JSON.stringify(data));
      return { success: true, user: data };
    } catch (err) {
      return { success: false, error: err.message || "Unable to connect to login service." };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("campusloop_user");
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("campusloop")) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.error("Error clearing session:", e);
    }
  };

  const refreshUser = async () => {
    if (!user || !user.id) return;
    try {
      const res = await fetch(`/api/auth/me/${user.id}`);
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        localStorage.setItem("campusloop_user", JSON.stringify(updated));
      }
    } catch (e) {
      console.error("Failed to refresh user profile:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
        refreshUser,
        isAuthenticated: !!user && !!user.id,
        isManager: user?.role === "MANAGER" || user?.role === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
