import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export const NotificationToast = ({ toast, onClose }) => {
  if (!toast) return null;

  const { type = "info", message, title } = toast;

  const styles = {
    success: {
      bg: "bg-emerald-50 border-emerald-200 text-emerald-900",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
      titleColor: "text-emerald-800",
    },
    error: {
      bg: "bg-rose-50 border-rose-200 text-rose-900",
      icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
      titleColor: "text-rose-800",
    },
    info: {
      bg: "bg-blue-50 border-blue-200 text-blue-900",
      icon: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
      titleColor: "text-blue-800",
    },
  }[type] || styles.info;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className={`p-4 rounded-2xl border shadow-xl flex items-start gap-3 ${styles.bg}`}>
        {styles.icon}
        <div className="flex-1 min-w-0">
          {title && <h4 className={`text-sm font-bold ${styles.titleColor}`}>{title}</h4>}
          <p className="text-xs leading-relaxed mt-0.5">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-black/5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
