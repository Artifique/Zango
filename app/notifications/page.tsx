"use client";

import { useState, useEffect } from "react";
import { AppShell } from "../../views/layout/app-shell";
import { NotificationService } from "../../controllers/data-services";
import { TransactionService } from "../../controllers/transaction-controller";
import { useAuthController } from "../../controllers/auth-controller";
import { Check } from "lucide-react";

export default function NotificationsPage() {
  const { user } = useAuthController();
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifs = async () => {
    if (user) {
      const data = await NotificationService.getAllForUser(user.id);
      setNotifications(data);
    }
  };

  useEffect(() => { 
    if (user) fetchNotifs(); 
  }, [user]);

  const handleConfirm = async (notif: any) => {
    try {
      // 1. Confirmer la notification
      await NotificationService.confirm(notif.id);
      // 2. Mettre à jour le statut de la transaction
      await TransactionService.updateStatus(notif.tx_id, 'VALIDE');
      // 3. Envoyer la notif de retour à l'initiateur
      await NotificationService.send(
        notif.tx_id, 
        notif.sender_id,
        user.id,
        `Transaction ${notif.tx_id} confirmée.`
      );
      fetchNotifs();
    } catch (err) {
      console.error("Erreur confirmation:", err);
      alert("Erreur lors de la confirmation.");
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-2xl mx-auto" suppressHydrationWarning={true}>
        <h2 className="text-2xl font-syne font-bold text-white">Notifications</h2>
        <div className="space-y-4">
          {notifications.map((n) => {
            const isIncoming = n.recipient_id === user?.id;
            // On s'assure que le statut est bien comparé en chaîne de caractères
            const isPending = n.status === 'pending';
            
            return (
              <div key={n.id} className="glass-card p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">{n.message}</p>
                  <p className="text-xs text-white/60">
                    Montant: {n.transactions?.montant || 0} XOF | 
                    Date: {n.transactions ? new Date(n.transactions.date_transaction).toLocaleString() : "N/A"}
                  </p>
                  <span className={`text-[10px] font-mono ${n.status === 'confirmed' ? 'text-teal' : 'text-amber'}`}>
                    {n.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                  </span>
                  <span className="text-[10px] text-white/40 ml-2">{isIncoming ? "(Reçu)" : "(Envoyé)"}</span>
                </div>
                {/* Le bouton ne s'affiche que si c'est entrant ET que c'est en attente */}
                {isIncoming && isPending && (
                  <button 
                    onClick={() => handleConfirm(n)}
                    className="bg-teal/20 text-teal px-3 py-1 rounded-lg flex items-center gap-2 hover:bg-teal/30"
                  >
                    <Check className="w-4 h-4" /> Confirmer
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
