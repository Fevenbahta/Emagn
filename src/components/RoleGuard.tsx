// components/RoleGuard.tsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

const RoleGuard = ({ 
  children, 
  allowedRoles, 
  redirectTo = "/unauthorized" 
}: RoleGuardProps) => {
  const auth = useSelector((state: RootState) => state.auth);
  const { user, token } = auth;
  
  // Check authentication based on token presence
  const isAuthenticated = !!token && !!user;

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/signin" replace />;
  }

  // Check if user has required role
  const hasRequiredRole = allowedRoles.includes(user.role);

  if (!hasRequiredRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;