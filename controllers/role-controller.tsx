"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthController } from "./auth-controller";

interface RoleControllerValue {
  role: string | null;
  loading: boolean;
}

const RoleControllerContext = createContext<RoleControllerValue | null>(null);

export function RoleControllerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthController();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from("agents")
        .select("role")
        .eq("id", user.id)
        .single();
        
      if (data) {
        setRole(data.role);
      } else {
        console.error("Erreur de récupération du rôle:", error);
      }
      setLoading(false);
    }

    fetchRole();
  }, [user]);

  const value = useMemo(() => ({ role, loading }), [role, loading]);

  return <RoleControllerContext.Provider value={value}>{children}</RoleControllerContext.Provider>;
}

export function useRoleController() {
  const context = useContext(RoleControllerContext);
  if (!context) {
    throw new Error("useRoleController must be used inside RoleControllerProvider");
  }
  return context;
}
