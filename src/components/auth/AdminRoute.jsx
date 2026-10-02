import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user } = useAuth();
  return user?.app_metadata?.role === "admin" ? children : <Navigate to="/dashboard" replace />;
}
