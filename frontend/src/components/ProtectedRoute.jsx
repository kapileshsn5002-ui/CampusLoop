import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children, requireManager = false }) => {
  const { user, isAuthenticated, isManager } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, message: "Please log in to access this page." }}
      />
    );
  }

  if (requireManager && !isManager) {
    return (
      <Navigate
        to="/"
        replace
        state={{ unauthorized: true, message: "Manager access required." }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
