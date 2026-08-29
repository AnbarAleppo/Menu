'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, GlassWater, UtensilsCrossed } from 'lucide-react';
import { MenuItem } from '@/lib/types';

interface DishModalProps {
  dish: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCartWithQty: (item: MenuItem, qty: number) => void;
  initialQty?: number;
}

export default function DishModal({
  dish,
  isOpen,
  onClose,
  onAddToCartWithQty,
  initialQty = 1,
}: DishModalProps) {
  const [qty, setQty] = useState(initialQty);

  useEffect(() => {
    setQty(initialQty || 1);
  }, [dish, initialQty]);

  if (!isOpen || !dish) return null;

  const handleAdd = () => {
    onAddToCartWithQty(dish, qty);
    onClose();
  };

  const getCategoryLabel = (slug: string) => {
    const map: Record<string, string> = {
      'small-plates': 'أطباق صغيرة ومقبلات',
      'mains': 'الأطباق الرئيسية',
      'flatbreads': 'مناقيش ومعجنات',
      'sweets': 'حلويات',
      'drinks': 'مشروبات وعصائر',
    };
    return map[slug] || 'عنبر';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-anbar-dark/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-anbar-subtle shadow-2xl overflow-hidden transform transition-transform duration-300 max-h-[90vh] flex flex-col z-10 animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur border border-anbar-subtle flex items-center justify-center text-anbar-dark hover:bg-anbar-dark hover:text-white transition-all shadow-md"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dish Image Banner */}
        <div className="relative h-60 sm:h-68 w-full shrink-0 overflow-hidden bg-anbar-bg">
          <Image
            src={dish.image_url}
            alt={dish.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 512px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/35"></div>
          <div className="absolute bottom-4 right-6 z-10">
            <span className="text-xs font-bold tracking-wider text-white bg-anbar-rust/95 px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md">
              {getCategoryLabel(dish.category_slug)}
            </span>
          </div>
        </div>

        {/* Details Content */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-anbar-dark">{dish.title}</h3>
            </div>
            <span className="text-xl font-black text-anbar-rust whitespace-nowrap">
              {dish.price.toLocaleString('ar-SY')} ل.س
            </span>
          </div>

          <p className="mt-4 text-anbar-dark/70 text-xs sm:text-sm leading-relaxed font-medium">
            {dish.description}
          </p>

          <div className="mt-6 pt-4 border-t border-anbar-subtle/80 space-y-3.5 text-xs">
            {dish.ingredients && (
              <div className="flex items-start gap-2">
                <UtensilsCrossed className="w-4 h-4 text-anbar-amber mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-anbar-dark block mb-0.5">المكونات الأساسية والتحضير:</span>
                  <p className="text-anbar-dark/60 leading-relaxed font-medium">{dish.ingredients}</p>
                </div>
              </div>
            )}

            {dish.pairing && (
              <div className="flex items-start gap-2">
                <GlassWater className="w-4 h-4 text-anbar-slate mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-anbar-dark block mb-0.5">المشروب المقترح للتقديم:</span>
                  <p className="text-anbar-dark/60 font-medium">{dish.pairing}</p>
                </div>
              </div>
            )}
          </div>

          {/* Quantity and Add to Cart Action */}
          <div className="mt-8 flex items-center justify-between gap-4 pt-4 border-t border-anbar-subtle">
            <div className="flex items-center gap-3 bg-anbar-bg p-1.5 rounded-full border border-anbar-subtle" dir="ltr">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-7 h-7 rounded-full bg-white text-anbar-dark flex items-center justify-center hover:bg-anbar-amber hover:text-white font-bold transition-all shadow-xs"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-xs font-black text-anbar-dark">
                {qty.toLocaleString('ar-SY')}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-7 h-7 rounded-full bg-white text-anbar-dark flex items-center justify-center hover:bg-anbar-amber hover:text-white font-bold transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="flex-1 py-3.5 bg-anbar-dark text-white rounded-full font-bold text-xs hover:bg-anbar-rust transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة للطلب ({(dish.price * qty).toLocaleString('ar-SY')} ل.س)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
