'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function MobileSearchModal({
  isOpen,
  onClose,
  searchTerm,
  onSearchChange,
}: MobileSearchModalProps) {
  if (!isOpen) return null;

  const quickRecommendations = ['باذنجان', 'موزة', 'زعتر', 'غروب', 'كيكة'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div onClick={onClose} className="absolute inset-0 bg-anbar-dark/40 backdrop-blur-sm" />

      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-4 z-10 border border-anbar-subtle animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3 px-3 py-2 border-b border-anbar-subtle">
          <Search className="w-4 h-4 text-anbar-amber" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث عن الأطباق، المشروبات، المكونات..."
            className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-anbar-dark font-bold"
            autoFocus
          />
          <button
            onClick={onClose}
            className="text-xs text-anbar-dark/50 hover:text-anbar-dark font-bold"
          >
            إلغاء
          </button>
        </div>

        <div className="mt-3 p-2">
          <p className="text-[11px] font-bold text-anbar-dark/40 tracking-wide mb-2">توصيات سريعة:</p>
          <div className="flex flex-wrap gap-2">
            {quickRecommendations.map((rec) => (
              <button
                key={rec}
                onClick={() => {
                  onSearchChange(rec);
                  onClose();
                }}
                className="px-3 py-1 rounded-full bg-anbar-bg hover:bg-anbar-amber hover:text-white text-xs font-bold text-anbar-dark border border-anbar-subtle transition-colors"
              >
                {rec}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
