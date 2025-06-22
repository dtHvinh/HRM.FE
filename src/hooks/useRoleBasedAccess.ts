"use client";

import { getAuth } from "@/context/AuthProvider";
import useGetUserInfo from "./get-user-info-hook";

export type UserRole = "admin" | "user" | "anonymous";

export const useRoleBasedAccess = () => {
  const { userInfo, isLoading, error } = useGetUserInfo();
  const token = getAuth();

  // Determine user role
  const getUserRole = (): UserRole => {
    if (!token) return "anonymous";
    if (token === "anonymous") return "anonymous";
    if (userInfo?.isAdmin) return "admin";
    return "user";
  };

  const userRole = getUserRole();
  const isAnonymous = userRole === "anonymous";
  const isUser = userRole === "user";
  const isAdmin = userRole === "admin";

  // Check if user can access a specific route
  const canAccessRoute = (route: string): boolean => {
    // Anonymous users can only access employee page
    if (isAnonymous) {
      return route === "/" || route === "/employees";
    }

    // Regular users can only access employee page
    if (isUser) {
      return route === "/" || route === "/employees";
    }

    // Admin users can access everything
    if (isAdmin) {
      return true;
    }

    return false;
  };

  // Check if user can edit/modify data
  const canEdit = (): boolean => {
    // Anonymous users cannot edit anything
    if (isAnonymous) return false;

    // Users and admins can edit
    return isUser || isAdmin;
  };

  // Check if user can access admin features
  const canAccessAdminFeatures = (): boolean => {
    return isAdmin;
  }; // Get allowed navigation items based on role
  const getAllowedNavItems = () => {
    const navigationItems = [
      {
        href: "/",
        label: "Nhân Viên",
        iconName: "users",
      },
      {
        href: "/departments",
        label: "Phòng Ban",
        iconName: "department",
      },
      {
        href: "/benefits",
        label: "Phúc Lợi",
        iconName: "benefits",
      },
      {
        href: "/positions",
        label: "Chức Vụ",
        iconName: "positions",
      },
      {
        href: "/notifications",
        label: "Thông Báo",
        iconName: "notifications",
      },
      {
        href: "/accounts",
        label: "Tài Khoản",
        iconName: "accounts",
      },
      {
        href: "/location",
        label: "Địa điểm",
        iconName: "location",
      },
    ];

    // Anonymous and regular users only see employee page
    if (isAnonymous || isUser) {
      return [navigationItems[0]]; // Only employees page
    }

    // Admin sees all navigation items
    if (isAdmin) {
      return navigationItems;
    }

    return [navigationItems[0]];
  };

  return {
    userRole,
    isAnonymous,
    isUser,
    isAdmin,
    isLoading,
    error,
    userInfo,
    canAccessRoute,
    canEdit,
    canAccessAdminFeatures,
    getAllowedNavItems,
  };
};
