"use client";

import { useRoleBasedAccess } from "@/hooks/useRoleBasedAccess";
import Link from "next/link";
import MainLayout from "../layout/MainLayout";

interface AccessDeniedProps {
  activePath?: string;
  message?: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  activePath = "/",
  message = "You do not have permission to access this page.",
}) => {
  const { userRole } = useRoleBasedAccess();

  return (
    <MainLayout activePath={activePath}>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="text-sm text-gray-500 mb-6">
            Current role:{" "}
            <span className="font-medium capitalize">{userRole}</span>
          </div>
          <div className="space-x-4">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Employees
            </Link>
            {userRole === "anonymous" && (
              <Link
                href="/auth/login"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
