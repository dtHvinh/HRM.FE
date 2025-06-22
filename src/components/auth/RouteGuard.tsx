"use client";

import { useRoleBasedAccess } from "@/hooks/useRoleBasedAccess";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user" | "anonymous";
  redirectTo?: string;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  requiredRole = "user",
  redirectTo = "/",
}) => {
  const router = useRouter();
  const { userRole, canAccessRoute, isLoading } = useRoleBasedAccess();

  useEffect(() => {
    if (isLoading) return;

    // Get current path
    const currentPath = window.location.pathname;

    // Check if user can access current route
    if (!canAccessRoute(currentPath)) {
      console.log(
        `Access denied to ${currentPath} for role ${userRole}. Redirecting to ${redirectTo}`
      );
      router.replace(redirectTo);
      return;
    } // Check specific role requirement if provided
    if (requiredRole === "admin" && userRole !== "admin") {
      console.log(
        `Admin access required for ${currentPath}. Current role: ${userRole}. Redirecting to ${redirectTo}`
      );
      router.replace(redirectTo);
      return;
    }

    if (requiredRole === "user" && userRole === "anonymous") {
      console.log(
        `User access required for ${currentPath}. Current role: ${userRole}. Redirecting to login`
      );
      router.replace("/auth/login");
      return;
    }
  }, [userRole, isLoading, canAccessRoute, requiredRole, redirectTo, router]);

  // Show loading state while checking permissions
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};
