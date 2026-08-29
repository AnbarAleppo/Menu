'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastNotificationProps {
  message: string | null;
}

export default function ToastNotification({ message }: ToastNotificationProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 bg-anbar-dark text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-white/10">
      <CheckCircle2 className="w-4 h-4 text-anbar-amber shrink-0" />
      <span>{message}</span>
    </div>
  );
}
