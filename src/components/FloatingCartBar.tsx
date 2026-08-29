'use client';

import React from 'react';
import { ChevronUp } from 'lucide-react';
import { CartItem } from '@/lib/types';

interface FloatingCartBarProps {
  cart: CartItem[];
  onOpenCart: () => void;
}

export default function FloatingCartBar({ cart, onOpenCart }: FloatingCartBarProps) {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (totalCount === 0) return null;

  return (
    <div className="fixed bottom-5 left-4 right-4 md:left-8 md:right-auto z-30 animate-in slide-in-from-bottom-6 fade-in duration-300">
      <button
        onClick={onOpenCart}
        className="w-full md:w-auto bg-anbar-dark text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center justify-between gap-6 border border-anbar-amber/40 hover:bg-anbar-rust hover:border-anbar-rust transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-anbar-amber text-anbar-dark flex items-center justify-center font-black text-xs group-hover:bg-white transition-colors">
            {totalCount.toLocaleString('ar-SY')}
          </div>
          <div className="text-right">
            <p className="text-xs font-bold leading-none">سلة الأطباق المختارة</p>
            <p className="text-[10px] text-white/60 leading-tight mt-1">اضغط لمراجعة الطلب والفاتورة</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold text-anbar-amber group-hover:text-white transition-colors">
            {totalPrice.toLocaleString('ar-SY')} ل.س
          </span>
          <ChevronUp className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
}
