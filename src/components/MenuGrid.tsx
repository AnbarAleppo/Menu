'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, Minus, ChevronLeft, Star, Utensils } from 'lucide-react';
import { MenuItem, CartItem } from '@/lib/types';

interface MenuGridProps {
  items: MenuItem[];
  cart: CartItem[];
  columns?: 1 | 2;
  onAddToCart: (item: MenuItem) => void;
  onUpdateCartQty: (itemId: string, delta: number) => void;
  onOpenDishModal: (item: MenuItem) => void;
  onResetFilters: () => void;
}

export default function MenuGrid({
  items,
  cart,
  columns = 2,
  onAddToCart,
  onUpdateCartQty,
  onOpenDishModal,
  onResetFilters,
}: MenuGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white/80 rounded-3xl border border-dashed border-anbar-subtle my-6">
        <Utensils className="w-10 h-10 text-anbar-amber/50 mx-auto mb-3" />
        <h3 className="font-cairo font-bold text-xl text-anbar-dark">لا توجد أطباق في هذا القسم حالياً</h3>
        <p className="text-xs text-anbar-dark/60 mt-1 font-medium">جرب اختيار فئة أخرى من شريط القائمة أعلاه.</p>
        <button
          onClick={onResetFilters}
          className="mt-4 px-6 py-2.5 rounded-full bg-anbar-dark text-white text-xs font-bold hover:bg-anbar-rust transition-colors shadow-xs cursor-pointer"
        >
          العودة للقسم الأول
        </button>
      </div>
    );
  }

  return (
    <div
      id="menu-grid"
      className={`grid scroll-mt-36 transition-all duration-300 ${
        columns === 1
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6'
          : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6'
      }`}
    >
      {items.map((item) => {
        const cartItem = cart.find((c) => c.id === item.id);
        const qtyInCart = cartItem ? cartItem.qty : 0;

        return (
          <div
            key={item.id}
            className={`bg-white rounded-3xl border border-anbar-subtle shadow-soft hover:shadow-elevated hover:border-anbar-amber/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group overflow-hidden ${
              columns === 2 ? 'p-2.5 sm:p-4.5' : 'p-4 sm:p-5'
            }`}
          >
            <div>
              {/* Perfectly Proportioned Responsive Image Box */}
              <div
                className={`relative rounded-2xl overflow-hidden bg-anbar-bg shadow-inner cursor-pointer w-full ${
                  columns === 1
                    ? 'aspect-[16/9] mb-3.5'
                    : 'aspect-[16/10] sm:aspect-[16/9] mb-2.5 sm:mb-3'
                }`}
                onClick={() => onOpenDishModal(item)}
              >
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes={
                    columns === 1
                      ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                      : '(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw'
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                {/* Rating Badge Overlay */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="px-2 py-0.5 rounded-full bg-white/90 text-anbar-dark border border-white/40 text-[9px] sm:text-[10px] font-black backdrop-blur-md flex items-center gap-1 shadow-xs">
                    <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                    <span>{(item.rating || 4.8).toFixed(1)}</span>
                    <span className="text-anbar-dark/50 text-[8px] sm:text-[9px] font-medium">({item.rating_count || 18})</span>
                  </span>
                </div>
              </div>

              {/* Title and Price */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1.5">
                <h3
                  onClick={() => onOpenDishModal(item)}
                  className={`font-cairo font-bold text-anbar-dark group-hover:text-anbar-amber transition-colors cursor-pointer leading-snug ${
                    columns === 1 ? 'text-sm sm:text-base' : 'text-xs sm:text-base truncate sm:whitespace-normal'
                  }`}
                >
                  {item.title}
                </h3>
                <span
                  className={`font-black text-anbar-rust sm:text-anbar-dark whitespace-nowrap ${
                    columns === 1 ? 'text-xs sm:text-sm' : 'text-[11px] sm:text-sm'
                  }`}
                >
                  {item.price.toLocaleString('ar-SY')} ل.س
                </span>
              </div>

              {/* Description */}
              <p
                className={`text-anbar-dark/65 leading-relaxed font-medium line-clamp-2 ${
                  columns === 1 ? 'text-xs mb-3.5' : 'text-[10px] sm:text-xs mb-2.5 sm:mb-3'
                }`}
              >
                {item.description}
              </p>
            </div>

            {/* Card Action Footer */}
            <div className="pt-2.5 sm:pt-3 border-t border-anbar-subtle/70 flex items-center justify-between gap-1">
              <button
                onClick={() => onOpenDishModal(item)}
                className="text-[11px] sm:text-xs font-bold text-anbar-dark/60 hover:text-anbar-dark flex items-center gap-0.5 transition-colors cursor-pointer"
              >
                <span>التفاصيل</span>
                <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>

              {qtyInCart > 0 ? (
                <div className="flex items-center gap-1 sm:gap-2 bg-anbar-bg px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-anbar-subtle shadow-2xs" dir="ltr">
                  <button
                    onClick={() => onUpdateCartQty(item.id, -1)}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-anbar-dark flex items-center justify-center font-bold text-xs hover:bg-anbar-rust hover:text-white transition-colors cursor-pointer"
                  >
                    <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </button>
                  <span className="text-[11px] sm:text-xs font-black w-3.5 sm:w-4 text-center text-anbar-dark">
                    {qtyInCart.toLocaleString('ar-SY')}
                  </span>
                  <button
                    onClick={() => onUpdateCartQty(item.id, 1)}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-anbar-dark flex items-center justify-center font-bold text-xs hover:bg-anbar-amber hover:text-white transition-colors cursor-pointer"
                  >
                    <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onAddToCart(item)}
                  className={`rounded-full bg-anbar-bg hover:bg-anbar-dark hover:text-white border border-anbar-subtle text-anbar-dark font-bold transition-all flex items-center gap-1 shadow-2xs group-hover:border-anbar-amber/30 cursor-pointer ${
                    columns === 1
                      ? 'px-3.5 py-1.5 text-xs'
                      : 'px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[10px] sm:text-xs'
                  }`}
                >
                  <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden xs:inline">أضف للطلب</span>
                  <span className="xs:hidden">أضف</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
