"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface AuthState {
  isAuthenticated: boolean;
  username: string;
}

interface AuthControllerValue extends AuthState {
  isBootstrapping: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const STORAGE_KEY = "cryptoagent-auth";
const AuthControllerContext = createContext<AuthControllerValue | null>(null);

export function AuthControllerProvider({ children }: { children: React.ReactNode }) {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    username: "",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthState;
        setState(parsed);
      }
    } finally {
      setIsBootstrapping(false);
    }
  }, []);

  const login = (username: string, password: string) => {
    if (!username.trim() || !password.trim()) {
      return false;
    }

    const nextState = {
      isAuthenticated: true,
      username: username.trim(),
    };

    setState(nextState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    return true;
  };

  const logout = () => {
    const nextState = { isAuthenticated: false, username: "" };
    setState(nextState);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      ...state,
      isBootstrapping,
      login,
      logout,
    }),
    [state, isBootstrapping],
  );

  return <AuthControllerContext.Provider value={value}>{children}</AuthControllerContext.Provider>;
}

export function useAuthController() {
  const context = useContext(AuthControllerContext);
  if (!context) {
    throw new Error("useAuthController must be used inside AuthControllerProvider");
  }
  return context;
}
