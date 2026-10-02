import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_DURATION_MS = 4000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(({ type = 'info', title, message }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast = { id, type, title, message };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, TOAST_DURATION_MS);
  }, [removeToast]);

  const showSuccess = useCallback((title, message) => {
    showToast({ type: 'success', title, message });
  }, [showToast]);

  const showWarning = useCallback((title, message) => {
    showToast({ type: 'warning', title, message });
  }, [showToast]);

  const showError = useCallback((title, message) => {
    showToast({ type: 'error', title, message });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showWarning, showError }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastCard({ toast, onClose }) {
  const config = {
    success: {
      border: 'border-emerald-500/40',
      bg: 'bg-slate-900/95 shadow-emerald-950/20',
      iconContainer: 'bg-emerald-500/15 text-emerald-400',
      icon: CheckCircle2,
    },
    warning: {
      border: 'border-amber-500/40',
      bg: 'bg-slate-900/95 shadow-amber-950/20',
      iconContainer: 'bg-amber-500/15 text-amber-400',
      icon: AlertTriangle,
    },
    error: {
      border: 'border-rose-500/40',
      bg: 'bg-slate-900/95 shadow-rose-950/20',
      iconContainer: 'bg-rose-500/15 text-rose-400',
      icon: AlertCircle,
    },
  }[toast.type] || {
    border: 'border-slate-700',
    bg: 'bg-slate-900/95 shadow-slate-950/20',
    iconContainer: 'bg-slate-800 text-slate-300',
    icon: AlertCircle,
  };

  const IconComponent = config.icon;

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-md shadow-xl transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${config.border} ${config.bg}`}
      role="alert"
    >
      <div className={`p-1.5 rounded-lg shrink-0 ${config.iconContainer}`}>
        <IconComponent className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        <h5 className="text-xs font-semibold text-slate-100 tracking-tight leading-snug">
          {toast.title}
        </h5>
        {toast.message && (
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed break-words">
            {toast.message}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors shrink-0 -mr-1 -mt-1"
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
