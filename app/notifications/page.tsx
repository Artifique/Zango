import { AppShell } from "../../views/layout/app-shell";
import { MOCK_EVENTS } from "../../data/mock-data";

export default function NotificationsPage() {
  return (
    <AppShell>
      <section className="glass-card rounded-2xl p-6">
        <h2 className="text-2xl font-syne font-extrabold mb-2">Notifications récentes</h2>
        <p className="text-xs font-mono uppercase tracking-wider text-white/40 mb-6">
          Alertes de captures uploadées, confirmations croisées et envois validés.
        </p>
        <div className="space-y-3">
          {MOCK_EVENTS.map((event) => (
            <div key={event.id} className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
              <p className="text-sm font-semibold">{event.message}</p>
              <p className="text-[11px] text-white/40 font-mono mt-1">{event.timestamp}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
