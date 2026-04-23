import { AppShell } from "../../views/layout/app-shell";

export default function SettingsPage() {
  return (
    <AppShell>
      <section className="glass-card rounded-2xl p-6 max-w-3xl">
        <h2 className="text-2xl font-syne font-extrabold mb-6">Paramètres</h2>
        <div className="space-y-4">
          <div className="border border-white/10 rounded-xl p-4">
            <p className="font-semibold mb-1">Notifications temps réel</p>
            <p className="text-sm text-white/50">Activer les alertes de capture, confirmations et envoi.</p>
          </div>
          <div className="border border-white/10 rounded-xl p-4">
            <p className="font-semibold mb-1">Sécurité de session</p>
            <p className="text-sm text-white/50">Expiration automatique après 30 minutes d’inactivité.</p>
          </div>
          <div className="border border-white/10 rounded-xl p-4">
            <p className="font-semibold mb-1">Préférences d’affichage</p>
            <p className="text-sm text-white/50">Densité des tableaux et format monétaire en temps réel.</p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
