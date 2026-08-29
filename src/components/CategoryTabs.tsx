'use client';

import React from 'react';
import { Category } from '@/lib/types';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
  itemsCount?: number;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  const handleClick = (slug: string, e: React.MouseEvent<HTMLButtonElement>) => {
    onSelectCategory(slug);

    // Scroll active button into view in the horizontal carousel
    try {
      e.currentTarget.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    } catch {
      // ignore
    }

    // Smooth scroll down to the first dish in this category
    setTimeout(() => {
      const target = document.getElementById('menu-grid');
      if (target) {
        const yOffset = -145; // Height of sticky navbar (80px) + sticky category bar (65px)
        const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 40);
  };

  return (
    <div className="sticky top-20 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 mb-8 glass-nav border-y border-anbar-subtle/80 shadow-xs transition-all">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Scrollable Categories List */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 flex-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={(e) => handleClick(cat.slug, e)}
                className={`px-4 py-2.5 rounded-full text-xs whitespace-nowrap transition-all duration-300 font-bold shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-anbar-dark text-white shadow-md scale-105'
                    : 'bg-white/80 text-anbar-dark/80 border border-anbar-subtle hover:border-anbar-amber hover:text-anbar-dark hover:bg-white shadow-2xs'
                }`}
              >
                {cat.name_ar}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
