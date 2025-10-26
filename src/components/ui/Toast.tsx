'use client';
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  type?: 'info' | 'success' | 'error';
  onClose?: () => void;
}

export default function Toast({ message, visible, type = 'info', onClose }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => onClose && onClose(), 3000);
    return () => clearTimeout(t);
  }, [visible, onClose]);

  if (!visible) return null;

  const base =
    'fixed right-6 bottom-6 z-50 px-4 py-2 rounded-xl shadow-lg text-sm flex items-center gap-3';
  const colors: Record<string, string> = {
    info: 'bg-white/90 text-foreground',
    success: 'bg-gradient-to-r from-green-400 to-green-300 text-white',
    error: 'bg-red-500 text-white',
  };

  return (
    <div className={`${base} ${colors[type] || colors.info}`} role="status" aria-live="polite">
      <div className="font-medium">{message}</div>
    </div>
  );
}
