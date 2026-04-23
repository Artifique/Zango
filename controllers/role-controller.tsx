"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { Role } from "../types/crypto";

interface RoleControllerValue {
  role: Role;
  setRole: (nextRole: Role) => void;
}

const RoleControllerContext = createContext<RoleControllerValue | null>(null);

export function RoleControllerProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("AGENT_PRINCIPAL");

  const value = useMemo(
    () => ({
      role,
      setRole,
    }),
    [role],
  );

  return <RoleControllerContext.Provider value={value}>{children}</RoleControllerContext.Provider>;
}

export function useRoleController() {
  const context = useContext(RoleControllerContext);
  if (!context) {
    throw new Error("useRoleController must be used inside RoleControllerProvider");
  }

  return context;
}
