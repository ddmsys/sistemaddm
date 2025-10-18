'use client';
import { createContext, ReactNode, useContext, useState } from 'react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface Ctx {
  toasts: Toast[];
  push: (t: Omit<Toast, 'id'>) => void;
  remove: (id: string) => void;
}

const NotificationContext = createContext<Ctx | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, set] = useState<Toast[]>([]);
  const push = ({ type, message, duration = 5000 }: Omit<Toast, 'id'>) =>
    set((t) => [...t, { id: crypto.randomUUID(), type, message, duration }]);
  const remove = (id: string) => set((t) => t.filter((x) => x.id !== id));
  return (
    <NotificationContext.Provider value={{ toasts, push, remove }}>
      {children /* render componente ToastList aqui */}
    </NotificationContext.Provider>
  );
};

export const useNotify = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotify fora do provider');
  return ctx;
};
