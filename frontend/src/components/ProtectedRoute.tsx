import { useContext } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

interface Props {
  children: ReactNode;
  role?: "ADMIN" | "ANALYST";
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user } = useContext(AuthContext);

  // Wait until user loads
  const token = localStorage.getItem("token");

  // If no token → not logged in → go to login
  if (!token) return <Navigate to="/login" />;

  // If token exists but user not loaded yet → loading
  if (user === null) return <div>Loading...</div>;

  // Not logged in
  if (!user) return <Navigate to="/login" />;

  // Role mismatch
  if (role && user.role !== role) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}
