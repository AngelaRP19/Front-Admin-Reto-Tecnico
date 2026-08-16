import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function RequireAdminAuth({ children }) {
  const { user, clearUser } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user.role !== "ROLE_ADMIN") {
    clearUser();
    return <Navigate to="/login" state={{ from: location.pathname, forbidden: true }} replace />;
  }

  return children;
}

export default RequireAdminAuth;
