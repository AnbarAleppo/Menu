'use client';

import React from 'react';
import { UtensilsCrossed, Coffee, Sparkles } from 'lucide-react';
import { Category, MenuSection } from '@/lib/types';
import { getCategorySection } from '@/lib/initialData';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
  activeSection: MenuSection;
  onSelectSection: (section: MenuSection) => void;
  itemsCount?: number;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onSelectCategory,
  activeSection,
  onSelectSection,
  itemsCount,
}: CategoryTabsProps) {
  // Separate categories by section
  const validCategories = categories.filter((c) => c.slug !== 'all' && c.is_active);
  const foodCategories = validCategories.filter((c) => getCategorySection(c) === 'food');
  const drinksCategories = validCategories.filter((c) => getCategorySection(c) === 'drinks');

  const visibleCategories = activeSection === 'food' ? foodCategories : drinksCategories;

  const handleSectionSwitch = (section: MenuSection) => {
    onSelectSection(section);
    const targetCats = section === 'food' ? foodCategories : drinksCategories;
    if (targetCats.length > 0) {
      onSelectCategory(targetCats[0].slug);
    }
  };

  const handleCategoryClick = (slug: string, e: React.MouseEvent<HTMLButtonElement>) => {
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

    // Smooth scroll down to menu grid
    setTimeout(() => {
      const target = document.getElementById('menu-grid');
      if (target) {
        const yOffset = -170;
        const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 40);
  };

  return (
    <div className="sticky top-20 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 mb-6 transition-all">
      <div className="p-2 sm:p-3 rounded-3xl glass-nav border border-anbar-subtle/80 shadow-soft backdrop-blur-xl flex flex-col gap-2.5">
        
        {/* Tier 1: Main Section Selector (المأكولات vs المشروبات) */}
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-2 p-1 bg-anbar-bg/90 rounded-2xl border border-anbar-subtle shadow-inner w-full max-w-md">
            
            {/* Food Button */}
            <button
              type="button"
              onClick={() => handleSectionSwitch('food')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-cairo font-black text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
                activeSection === 'food'
                  ? 'bg-anbar-dark text-white shadow-md scale-[1.02]'
                  : 'text-anbar-dark/70 hover:text-anbar-dark hover:bg-white/60'
              }`}
            >
              <UtensilsCrossed className={`w-4 h-4 transition-transform duration-300 ${activeSection === 'food' ? 'scale-110 text-anbar-amber' : ''}`} />
              <span>المأكولات</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeSection === 'food' ? 'bg-white/20 text-white' : 'bg-anbar-subtle text-anbar-dark/60'
              }`}>
                {foodCategories.length}
              </span>
            </button>

            {/* Drinks Button */}
            <button
              type="button"
              onClick={() => handleSectionSwitch('drinks')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-cairo font-black text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
                activeSection === 'drinks'
                  ? 'bg-anbar-dark text-white shadow-md scale-[1.02]'
                  : 'text-anbar-dark/70 hover:text-anbar-dark hover:bg-white/60'
              }`}
            >
              <Coffee className={`w-4 h-4 transition-transform duration-300 ${activeSection === 'drinks' ? 'scale-110 text-anbar-amber' : ''}`} />
              <span>المشروبات</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeSection === 'drinks' ? 'bg-white/20 text-white' : 'bg-anbar-subtle text-anbar-dark/60'
              }`}>
                {drinksCategories.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tier 2: Sub-categories Carousel under Active Section */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full border-t border-anbar-subtle/50 pt-2">
          {visibleCategories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={(e) => handleCategoryClick(cat.slug, e)}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs whitespace-nowrap transition-all duration-300 font-bold shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-anbar-amber text-anbar-dark font-black shadow-sm scale-105 border border-anbar-amber'
                    : 'bg-white/80 text-anbar-dark/80 border border-anbar-subtle hover:border-anbar-amber hover:text-anbar-dark hover:bg-white shadow-2xs'
                }`}
              >
                <span>{cat.name_ar}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
