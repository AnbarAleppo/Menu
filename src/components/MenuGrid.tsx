'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, Minus, ChevronLeft, Star, Utensils } from 'lucide-react';
import { MenuItem, CartItem } from '@/lib/types';

interface MenuGridProps {
  items: MenuItem[];
  cart: CartItem[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateCartQty: (itemId: string, delta: number) => void;
  onOpenDishModal: (item: MenuItem) => void;
  onResetFilters: () => void;
}

export default function MenuGrid({
  items,
  cart,
  onAddToCart,
  onUpdateCartQty,
  onOpenDishModal,
  onResetFilters,
}: MenuGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white/80 rounded-3xl border border-dashed border-anbar-subtle my-6">
        <Utensils className="w-10 h-10 text-anbar-amber/50 mx-auto mb-3" />
        <h3 className="font-cairo font-bold text-xl text-anbar-dark">لا توجد أطباق تطابق اختيارك</h3>
        <p className="text-xs text-anbar-dark/60 mt-1 font-medium">جرب تغيير كلمات البحث أو استعراض الأقسام الأخرى.</p>
        <button
          onClick={onResetFilters}
          className="mt-4 px-6 py-2.5 rounded-full bg-anbar-dark text-white text-xs font-bold hover:bg-anbar-rust transition-colors shadow-xs"
        >
          إعادة ضبط القائمة
        </button>
      </div>
    );
  }

  return (
    <div id="menu-grid" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 scroll-mt-36">
      {items.map((item) => {
        const cartItem = cart.find((c) => c.id === item.id);
        const qtyInCart = cartItem ? cartItem.qty : 0;

        return (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-4 sm:p-5 border border-anbar-subtle shadow-soft hover:shadow-elevated hover:border-anbar-amber/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden"
          >
            <div>
              {/* Card Image Box with Hover Zoom & Subtle Vignette */}
              <div
                className="relative rounded-2xl overflow-hidden aspect-[16/10] mb-4 bg-anbar-bg shadow-inner cursor-pointer"
                onClick={() => onOpenDishModal(item)}
              >
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                {item.badge && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-3 py-1 rounded-full bg-anbar-dark/85 text-white border border-white/20 text-[10px] font-bold backdrop-blur-md flex items-center gap-1 shadow-sm">
                      <Star className="w-2.5 h-2.5 text-anbar-amber fill-anbar-amber" />
                      <span>{item.badge}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Title and Price */}
              <div className="flex justify-between items-start gap-2 mb-1.5">
                <h3
                  onClick={() => onOpenDishModal(item)}
                  className="font-cairo font-bold text-base sm:text-lg text-anbar-dark group-hover:text-anbar-amber transition-colors cursor-pointer leading-snug"
                >
                  {item.title}
                </h3>
                <span className="font-black text-anbar-dark text-sm sm:text-base whitespace-nowrap">
                  {item.price.toLocaleString('ar-SY')} ل.س
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-anbar-dark/65 leading-relaxed mb-4 font-medium line-clamp-2">
                {item.description}
              </p>
            </div>

            {/* Card Action Footer */}
            <div className="pt-3.5 border-t border-anbar-subtle/70 flex items-center justify-between">
              <button
                onClick={() => onOpenDishModal(item)}
                className="text-xs font-bold text-anbar-dark/60 hover:text-anbar-dark flex items-center gap-1.5 transition-colors"
              >
                <span>التفاصيل</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {qtyInCart > 0 ? (
                <div className="flex items-center gap-2 bg-anbar-bg px-2.5 py-1 rounded-full border border-anbar-subtle shadow-2xs" dir="ltr">
                  <button
                    onClick={() => onUpdateCartQty(item.id, -1)}
                    className="w-6 h-6 rounded-full bg-white text-anbar-dark flex items-center justify-center font-bold text-xs hover:bg-anbar-rust hover:text-white transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-black w-4 text-center text-anbar-dark">
                    {qtyInCart.toLocaleString('ar-SY')}
                  </span>
                  <button
                    onClick={() => onUpdateCartQty(item.id, 1)}
                    className="w-6 h-6 rounded-full bg-white text-anbar-dark flex items-center justify-center font-bold text-xs hover:bg-anbar-amber hover:text-white transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onAddToCart(item)}
                  className="px-4 py-2 rounded-full bg-anbar-bg hover:bg-anbar-dark hover:text-white border border-anbar-subtle text-anbar-dark text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs group-hover:border-anbar-amber/30"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>أضف للطلب</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
