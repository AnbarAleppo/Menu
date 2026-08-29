'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingBag, X } from 'lucide-react';

interface NavbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenMobileSearch: () => void;
  activeTable?: string | null;
}

export default function Navbar({
  searchTerm,
  onSearchChange,
  cartCount,
  onOpenCart,
  onOpenMobileSearch,
  activeTable,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-anbar-subtle/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Active Table Badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <Image
              src="/Anbar Logo.svg"
              alt="عنبر"
              width={120}
              height={48}
              className="h-11 sm:h-12 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
              priority
            />
          </Link>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex items-center relative w-80 lg:w-96">
          <Search className="absolute right-4 text-anbar-dark/40 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث عن طبق، مكونات، أو مشروب..."
            className="w-full pr-11 pl-9 py-2.5 text-xs bg-white/90 border border-anbar-subtle rounded-full focus:outline-none focus:border-anbar-amber focus:ring-2 focus:ring-anbar-amber/20 transition-all font-semibold placeholder:text-anbar-dark/40 shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute left-3.5 text-anbar-dark/40 hover:text-anbar-dark transition-colors"
              title="مسح البحث"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Mobile Search Trigger */}
          <button
            onClick={onOpenMobileSearch}
            className="md:hidden w-10 h-10 rounded-full bg-white border border-anbar-subtle flex items-center justify-center text-anbar-dark hover:bg-anbar-amber hover:text-white hover:border-anbar-amber transition-all shadow-xs"
            aria-label="بحث في القائمة"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Cart Trigger Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full bg-anbar-dark text-white font-bold text-xs hover:bg-anbar-rust transition-all shadow-md shadow-anbar-dark/15 group"
          >
            <ShoppingBag className="w-4 h-4 text-anbar-amber group-hover:text-white transition-colors" />
            <span className="hidden sm:inline">سلة الطلبات</span>
            <span className="w-5 h-5 bg-anbar-amber text-anbar-dark text-[11px] font-black rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
              {cartCount.toLocaleString('ar-SY')}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
