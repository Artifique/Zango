"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "../../components/layout/header";
import { useAuthController } from "../../controllers/auth-controller";
import { PAGE_TITLES } from "../../models/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, loading } = useAuthController();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" suppressHydrationWarning={true}>
        <p className="text-white/40 font-mono text-sm uppercase tracking-wider">Vérification session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" suppressHydrationWarning={true}>
      <main className="flex-1 min-w-0 flex flex-col">
        <Header />
        <div className="flex-1 p-8 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
