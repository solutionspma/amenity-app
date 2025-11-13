'use client';

import { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

// Toast system state
let toasts: ToastProps[] = [];
let listeners: (() => void)[] = [];

export const toast = {
  success: (message: string) => addToast(message, 'success'),
  error: (message: string) => addToast(message, 'error'),
  info: (message: string) => addToast(message, 'info'),
  warning: (message: string) => addToast(message, 'warning'),
};

const addToast = (message: string, type: ToastProps['type']) => {
  const toast = { message, type, onClose: () => {} };
  toasts.push(toast);
  listeners.forEach(listener => listener());
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    toasts = toasts.filter(t => t !== toast);
    listeners.forEach(listener => listener());
  }, 5000);
};

export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState(toasts);

  useEffect(() => {
    const updateToasts = () => setCurrentToasts([...toasts]);
    listeners.push(updateToasts);
    
    return () => {
      listeners = listeners.filter(l => l !== updateToasts);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {currentToasts.map((toast, index) => (
        <Toast 
          key={index}
          {...toast}
          onClose={() => {
            toasts = toasts.filter(t => t !== toast);
            listeners.forEach(listener => listener());
          }}
        />
      ))}
    </div>
  );
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-black';
      case 'info':
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${getToastStyles()}`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-lg font-bold hover:opacity-70"
        >
          ×
        </button>
      </div>
    </div>
  );
}