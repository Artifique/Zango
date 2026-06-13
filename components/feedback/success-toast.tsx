import { useEffect } from "react";
import { Check, X } from "lucide-react";

export interface ToastProps {
  show: boolean;
  message: string;
  title?: string;
  onClose: () => void;
}

export function SuccessToast({ show, message, title = "Succès !", onClose }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <>
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateY(-20px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        @keyframes scale-up {
          from {
            transform: scale(0.5);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes shrink-width {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-scale-up {
          animation: scale-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
        }
        .animate-shrink-width {
          animation: shrink-width 4s linear forwards;
        }
      `}</style>
      <div className="fixed top-5 right-5 z-50 animate-slide-in flex items-center gap-4 bg-[#141517]/80 border border-teal/30 backdrop-blur-md rounded-2xl p-4 shadow-2xl max-w-sm w-[90vw] overflow-hidden">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal/20 text-teal border border-teal/30 shadow-inner">
          <Check className="w-5 h-5 animate-scale-up" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-syne font-bold text-white leading-tight">{title}</h4>
          <p className="text-xs text-white/60 font-mono mt-1 truncate">{message}</p>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1">
          <X className="w-4 h-4" />
        </button>
        <div className="absolute bottom-0 left-0 h-[2px] bg-teal animate-shrink-width w-full" />
      </div>
    </>
  );
}
