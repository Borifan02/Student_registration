import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => {
          let styles = {
            bg: 'bg-white border-blue-200 text-slate-800',
            icon: <Info size={18} className="text-blue-600 shrink-0" />,
          };

          if (toast.type === 'success') {
            styles = {
              bg: 'bg-white border-emerald-200 text-slate-800',
              icon: <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />,
            };
          } else if (toast.type === 'error') {
            styles = {
              bg: 'bg-white border-rose-200 text-slate-800',
              icon: <AlertCircle size={18} className="text-rose-600 shrink-0" />,
            };
          } else if (toast.type === 'warning') {
            styles = {
              bg: 'bg-white border-amber-200 text-slate-800',
              icon: <AlertTriangle size={18} className="text-amber-600 shrink-0" />,
            };
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border ${styles.bg} transition-all duration-200 animate-in slide-in-from-bottom-5`}
              role="alert"
            >
              {styles.icon}
              <div className="flex-1 text-sm font-medium leading-snug">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-slate-400"
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;

