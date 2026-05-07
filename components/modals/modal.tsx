import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-charcoal border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-syne font-bold mb-4">{title}</h2>
        {children}
        <button onClick={onClose} className="mt-4 w-full text-sm text-white/50 hover:text-white">Fermer</button>
      </div>
    </div>
  );
}
