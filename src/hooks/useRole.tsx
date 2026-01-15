// hooks/useRole.tsx
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const useRole = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const { user, token } = auth;
  
  // Derive isAuthenticated from token
  const isAuthenticated = !!token && !!user;

  const hasRole = (role: string) => {
    return isAuthenticated && user?.role === role;
  };

  const hasAnyRole = (roles: string[]) => {
    return isAuthenticated && roles.includes(user?.role || "");
  };

  return {
    user,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    role: user?.role,
  };
};