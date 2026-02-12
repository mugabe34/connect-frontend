import { useAuth } from "../providers/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "./Loader";

export function ProtectedRoute({ roles }: { roles: string[] }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!user || !roles.includes(user.role)) {
    const fallback = roles.includes('admin') ? '/auth/admin' : roles.includes('buyer') ? '/auth/buyer' : '/auth/seller';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
