"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

interface AuthState {
  user: any;
  loading: boolean;
}

interface AuthControllerValue extends AuthState {
  username: string | null;
  login: (email: string, password: string) => Promise<{ data: any; error: any }>;
  logout: () => Promise<void>;
}

const AuthControllerContext = createContext<AuthControllerValue | null>(null);

export function AuthControllerProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Initialiser l'état de l'utilisateur
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Écouter les changements de session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (!result.error) {
      setUser(result.data.user);
    }
    return result;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  const username = user?.email || null;

  const value = useMemo(
    () => ({
      user,
      loading,
      username,
      login,
      logout,
    }),
    [user, loading, username],
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
