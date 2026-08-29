'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Leaf, Flame, Heart, ArrowDown, MapPin } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Hero Intro Text */}
        <div className="md:col-span-7 space-y-6 text-start">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-anbar-amber/10 border border-anbar-amber/30 text-anbar-amber text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-anbar-amber animate-ping"></span>
            <Sparkles className="w-3.5 h-3.5" />
            <span>قائمة الموسم الجديد متوفرة الآن في الدار</span>
          </div>

          <h1 className="font-cairo text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-anbar-dark leading-[1.18]">
            حيث يلتقي الدفء <br />
            <span className="text-anbar-amber font-black">بالمذاق العصري.</span>
          </h1>

          <p className="text-anbar-dark/75 text-base sm:text-lg max-w-xl font-medium leading-relaxed">
            عنبر هو ملاذ هادئ صُمم للصباحات الهادئة، التجمعات النابضة بالحياة، والوصفات المحضرة بحرفية من الفرن الحجري وتحت شمس الطبيعة.
          </p>

          {/* Feature Badges Strip */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-bold text-anbar-dark/70">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-anbar-subtle shadow-2xs">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>مكونات عضوية 100%</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-anbar-subtle shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>طهي على خشب اللوز</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-anbar-subtle shadow-2xs">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>طازج يومياً</span>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="#menu-section"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-anbar-dark text-white font-bold text-sm hover:bg-anbar-rust transition-all shadow-xl shadow-anbar-dark/20 group"
            >
              <span>استكشف القائمة الكاملة</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Restaurant Interior Showcase */}
        <div className="md:col-span-5 relative">
          <div className="relative w-full max-w-md mx-auto aspect-[4/5] sm:aspect-square">
            {/* Organic Layered Rotated Backdrops */}
            <div className="absolute inset-0 bg-anbar-slate rounded-[3rem] -rotate-3 opacity-75 transition-transform hover:-rotate-6 duration-500 shadow-lg"></div>
            <div className="absolute inset-0 bg-anbar-amber rounded-[3rem] rotate-3 opacity-75 transition-transform hover:rotate-6 duration-500 shadow-lg"></div>

            {/* Main Image Frame */}
            <div className="relative h-full w-full rounded-[2.5rem] bg-white border border-anbar-subtle p-3.5 shadow-2xl overflow-hidden group">
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
                <Image
                  src="/anbar-interior.jpg"
                  alt="مطعم ومقهى عنبر"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 450px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-anbar-dark/80 via-transparent to-black/20"></div>

                {/* Floating Ambient Badges */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-anbar-dark font-bold text-xs backdrop-blur-md shadow-md flex items-center gap-2 border border-anbar-subtle">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>أجواء دافئة ومميزة</span>
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 left-4 z-10 text-white">
                  <div className="flex items-center gap-2 mb-1 text-anbar-amber text-xs font-bold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>جلسات عنبر المشرقة</span>
                  </div>
                  <p className="text-xs text-white/90 font-medium leading-relaxed">
                    تصميم معماري مستوحى من التراث بلمسة معاصرة وإطلالة مريحة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
