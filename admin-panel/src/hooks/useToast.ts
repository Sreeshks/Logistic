import { useState, useEffect } from 'react';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
let listeners: Listener[] = [];

const notify = () => {
  listeners.forEach((listener) => listener([...toasts]));
};

export const toast = {
  success: (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    toasts = [...toasts, { id, type: 'success', message }];
    notify();
    setTimeout(() => toast.dismiss(id), 4000);
  },
  error: (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    toasts = [...toasts, { id, type: 'error', message }];
    notify();
    setTimeout(() => toast.dismiss(id), 5000);
  },
  info: (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    toasts = [...toasts, { id, type: 'info', message }];
    notify();
    setTimeout(() => toast.dismiss(id), 4000);
  },
  dismiss: (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  },
};

export const useToast = () => {
  const [currentToasts, setCurrentToasts] = useState<ToastItem[]>(toasts);

  useEffect(() => {
    const listener = (newToasts: ToastItem[]) => {
      setCurrentToasts(newToasts);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return { toasts: currentToasts, toast };
};
