"use client";

import { deleteCookie, getCookie, setCookie } from "cookies-next/client";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

type AuthContextType = {
  accessToken: string;
  authSetter: (accessToken: string) => void;
};

export const getAuth = () => {
  return getCookie("accessToken");
};

export const setAuth = (accessToken: string) => {
  setCookie("accessToken", accessToken);
};

export const clearAuth = () => {
  deleteCookie("accessToken");
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const route = usePathname();
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string>("");
  const auth = getAuth();
  useEffect(() => {
    if (!auth && !route.startsWith("/auth/login")) {
      router.push("/auth/login");
    }
  }, [auth, router, route]);

  const authSetter = (accessToken: string) => {
    setAccessToken(accessToken);
  };

  if (route.startsWith("/auth/login")) return children;

  return (
    <AuthContext.Provider value={{ accessToken, authSetter }}>
      {children}
    </AuthContext.Provider>
  );
}
