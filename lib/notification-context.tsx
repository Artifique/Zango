import { createContext, useContext, useState, ReactNode } from "react";
import { useAuthController } from "../controllers/auth-controller";

interface Notification {
  id: string;
  txId: string;
  message: string;
  senderId: string;
  targetAgentId: string;
  status: 'pending' | 'confirmed';
  timestamp: string;
}

const NotificationContext = createContext<{
  notifications: Notification[];
  sendNotification: (txId: string, agentId: string, message: string, senderId: string) => void;
  confirmNotification: (notif: Notification) => void;
}>({
  notifications: [],
  sendNotification: () => {},
  confirmNotification: () => {},
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const sendNotification = (txId: string, agentId: string, message: string, senderId: string) => {
    const newNotif = {
      id: Math.random().toString(36),
      txId,
      message,
      senderId,
      status: 'pending' as const,
      timestamp: new Date().toLocaleString("fr-FR"),
      targetAgentId: agentId
    };
    setNotifications(prev => [...prev, newNotif]);
  };

  const confirmNotification = (notif: Notification) => {
    // 1. Marquer la demande initiale comme confirmée
    setNotifications(prev => prev.map(n => n.id === notif.id ? {...n, status: 'confirmed'} : n));

    // 2. Envoyer la notification de retour à l'initiateur
    const confirmNotif = {
      id: Math.random().toString(36),
      txId: notif.txId,
      message: `Transaction ${notif.txId} confirmée par l'agent.`,
      senderId: "Système",
      status: 'confirmed' as const,
      timestamp: new Date().toLocaleString("fr-FR"),
      targetAgentId: notif.senderId
    };
    setNotifications(prev => [...prev, confirmNotif]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, sendNotification, confirmNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  const { user } = useAuthController();
  
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  
  // L'utilisateur voit :
  // 1. Les demandes de confirmation qu'il a reçues (targetAgentId === user.id)
  // 2. Les confirmations de retour des transactions qu'il a initiées (senderId === user.id)
  const myNotifications = context.notifications.filter(n => 
    n.targetAgentId === user?.id || n.senderId === user?.id
  );
  
  return { ...context, notifications: myNotifications };
};
