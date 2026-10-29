import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user } = useAuth();
  const isAdmin =
    user?.app_metadata?.role === "admin" ||
    String(user?.email || "").toLowerCase() === "ahmet@ahmetcotur.com";
  return isAdmin ? children : <Navigate to="/dashboard" replace />;
}
