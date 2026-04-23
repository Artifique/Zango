"use client";

import { AppShell } from "../layout/app-shell";

interface SectionPageProps {
  title: string;
  description: string;
}

export function SectionPage({ title, description }: SectionPageProps) {
  return (
    <AppShell>
      <section className="glass-card rounded-2xl p-8 border border-teal/10">
        <h2 className="text-2xl font-syne font-extrabold tracking-tight mb-2">{title}</h2>
        <p className="text-white/50 text-sm font-mono">{description}</p>
      </section>
    </AppShell>
  );
}
