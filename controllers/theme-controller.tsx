"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeMode = "dark" | "light";

interface ThemeControllerValue {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const STORAGE_KEY = "cryptoagent-theme";
const ThemeControllerContext = createContext<ThemeControllerValue | null>(null);

export function ThemeControllerProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const initial = saved === "light" ? "light" : "dark";
    setTheme(initial);
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(initial);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
    }),
    [theme],
  );

  return <ThemeControllerContext.Provider value={value}>{children}</ThemeControllerContext.Provider>;
}

export function useThemeController() {
  const context = useContext(ThemeControllerContext);
  if (!context) {
    throw new Error("useThemeController must be used inside ThemeControllerProvider");
  }
  return context;
}
