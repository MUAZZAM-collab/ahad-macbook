import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const success = (msg, duration) => addToast(msg, 'success', duration);
  const error = (msg, duration) => addToast(msg, 'error', duration);
  const info = (msg, duration) => addToast(msg, 'info', duration);

  return (
    <ToastContext.Provider value={{ addToast, success, error, info, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-apple-lg border transition-all duration-300 transform translate-y-0 backdrop-blur-xl ${
              toast.type === 'success'
                ? 'bg-white/95 dark:bg-zinc-900/95 border-emerald-500/30 text-zinc-800 dark:text-zinc-100'
                : toast.type === 'error'
                ? 'bg-white/95 dark:bg-zinc-900/95 border-rose-500/30 text-zinc-800 dark:text-zinc-100'
                : 'bg-white/95 dark:bg-zinc-900/95 border-blue-500/30 text-zinc-800 dark:text-zinc-100'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              )}
              {toast.type === 'error' && (
                <AlertCircle className="w-5 h-5 text-rose-500" />
              )}
              {toast.type === 'info' && (
                <Info className="w-5 h-5 text-apple-blue" />
              )}
            </div>
            <div className="flex-1 text-sm font-medium leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
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
