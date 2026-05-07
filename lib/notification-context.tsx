import { createContext, useContext, useState, ReactNode } from "react";

interface Notification {
  id: string;
  txId: string;
  message: string;
  sender: string;
  status: 'pending' | 'confirmed';
  timestamp: string;
}

const NotificationContext = createContext<{
  notifications: Notification[];
  sendNotification: (txId: string, agentName: string) => void;
  confirmNotification: (id: string) => void;
}>({
  notifications: [],
  sendNotification: () => {},
  confirmNotification: () => {},
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const sendNotification = (txId: string, agentName: string) => {
    const newNotif = {
      id: Math.random().toString(36),
      txId,
      message: `Demande de confirmation pour la transaction ${txId}`,
      sender: "Système",
      status: 'pending' as const,
      timestamp: new Date().toLocaleString("fr-FR"),
    };
    setNotifications(prev => [...prev, newNotif]);
  };

  const confirmNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? {...n, status: 'confirmed'} : n));
  };

  return (
    <NotificationContext.Provider value={{ notifications, sendNotification, confirmNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
