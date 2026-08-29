'use client';

import React from 'react';
import { Category } from '@/lib/types';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
  itemsCount: number;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onSelectCategory,
  itemsCount,
}: CategoryTabsProps) {
  return (
    <div className="mb-8 border-b border-anbar-subtle/80 pb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
        <div>
          <h2 className="font-cairo font-black text-3xl sm:text-4xl text-anbar-dark">قائمة الطعام الكاملة</h2>
          <p className="text-anbar-dark/60 text-xs sm:text-sm mt-1 font-medium">
            أطباق طازجة محضرة بأجود المكونات المحلية وزيوت العصر البارد.
          </p>
        </div>

        {/* Categories Pills Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pt-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => onSelectCategory(cat.slug)}
                className={`px-4 py-2.5 rounded-full text-xs whitespace-nowrap transition-all duration-300 font-bold ${
                  isActive
                    ? 'bg-anbar-dark text-white shadow-md'
                    : 'bg-white text-anbar-dark/80 border border-anbar-subtle hover:border-anbar-amber hover:text-anbar-dark'
                }`}
              >
                {cat.name_ar}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Items Counter */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-anbar-dark/60 font-bold bg-white px-3.5 py-1.5 rounded-full border border-anbar-subtle shadow-2xs">
          عرض {itemsCount.toLocaleString('ar-SY')} طبق
        </span>
      </div>
    </div>
  );
}
