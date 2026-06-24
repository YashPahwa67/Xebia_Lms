import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const STYLES = {
  success: 'border-teal/30 bg-teal/10 text-teal-soft',
  error: 'border-cta/30 bg-cta/10 text-cta',
  info: 'border-plum/20 bg-plum/[0.06] text-plum',
};

let toastSeed = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message, type = 'info', timeout = 4000) => {
      const id = ++toastSeed;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (timeout) setTimeout(() => dismiss(id), timeout);
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({
      toast: {
        success: (m) => show(m, 'success'),
        error: (m) => show(m, 'error'),
        info: (m) => show(m, 'info'),
      },
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed top-4 right-4 z-[100] flex flex-col gap-2"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map(({ id, message, type }) => {
          const Icon = ICONS[type] || Info;
          return (
            <div
              key={id}
              role="alert"
              className={cn(
                'flex items-start gap-2 rounded-lg border px-4 py-3 shadow-md w-80',
                STYLES[type],
              )}
            >
              <Icon className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="flex-1 text-sm">{message}</p>
              <button
                onClick={() => dismiss(id)}
                className="shrink-0 opacity-70 hover:opacity-100"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx.toast;
}
