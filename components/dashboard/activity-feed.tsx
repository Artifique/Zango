"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, UserCheck, Image as ImageIcon, Send, PlusCircle } from "lucide-react";
import { ActivityEvent } from "../../types/crypto";
import { MOCK_EVENTS } from "../../data/mock-data";

const ICON_MAP = {
  CONFIRMATION: UserCheck,
  CAPTURE: ImageIcon,
  SEND: Send,
  NEW_TX: PlusCircle,
};

const COLOR_MAP = {
  CONFIRMATION: "text-blue-400 bg-blue-400/10",
  CAPTURE: "text-amber bg-amber/10",
  SEND: "text-success bg-success/10",
  NEW_TX: "text-teal bg-teal/10",
};

export function ActivityFeed() {
  const [events, setEvents] = useState<ActivityEvent[]>(MOCK_EVENTS);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent: ActivityEvent = {
        id: Math.random().toString(36).substr(2, 9),
        type: ["CONFIRMATION", "CAPTURE", "SEND", "NEW_TX"][Math.floor(Math.random() * 4)] as any,
        message: [
          "Agent Marc a validé la transaction #TXN-0051",
          "Nouvelle capture uploadée par Agent Thomas",
          "Transaction #TXN-0050 validée et envoyée au wallet",
          "Nouvelle transaction créée par Agent Julie",
        ][Math.floor(Math.random() * 4)],
        timestamp: "À l'instant",
      };
      setEvents(prev => [newEvent, ...prev.slice(0, 7)]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card rounded-2xl h-full flex flex-col">
      <div className="p-6 border-b border-white/5">
        <h3 className="font-syne font-bold text-lg">Activité en temps réel</h3>
      </div>
      
      <div className="flex-1 p-6 space-y-6 overflow-hidden relative">
        <AnimatePresence initial={false}>
          {events.map((event, idx) => {
            const Icon = ICON_MAP[event.type];
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex gap-4 relative"
              >
                {idx !== events.length - 1 && (
                  <div className="absolute left-[17px] top-8 bottom-[-24px] w-px bg-white/5" />
                )}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 ${COLOR_MAP[event.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="pt-1">
                  <p className="text-xs font-medium text-white/80 leading-relaxed">
                    {event.message}
                  </p>
                  <span className="text-[10px] font-mono text-white/20 uppercase tracking-wider">{event.timestamp}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Gradient overlay for fade effect */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-charcoal/50 to-transparent pointer-events-none" />
      </div>

      <div className="p-4 border-t border-white/5 mt-auto">
        <button className="w-full py-2 text-[10px] font-mono font-bold uppercase tracking-widest text-white/20 hover:text-teal hover:bg-white/5 rounded-lg transition-all">
          Voir tout l'historique
        </button>
      </div>
    </div>
  );
}
