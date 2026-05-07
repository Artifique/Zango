"use client";

import { AppShell } from "../../views/layout/app-shell";
import { useNotifications } from "../../lib/notification-context";
import { Check } from "lucide-react";

export default function NotificationsPage() {
  const { notifications, confirmNotification } = useNotifications();

  return (
    <AppShell>
      <div className="space-y-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-syne font-bold text-white">Notifications</h2>
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-white/40">Aucune notification.</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="glass-card p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm">{n.message}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/40">{n.timestamp}</span>
                    <span className="text-[10px] text-teal font-mono">{n.status}</span>
                  </div>
                </div>
                {n.status === 'pending' && (
                  <button 
                    onClick={() => confirmNotification(n.id)}
                    className="bg-teal/20 text-teal px-3 py-1 rounded-lg flex items-center gap-2 hover:bg-teal/30"
                  >
                    <Check className="w-4 h-4" /> Confirmer
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
