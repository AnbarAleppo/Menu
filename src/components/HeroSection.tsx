'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Hero Intro Text */}
        <div className="md:col-span-7 space-y-6 text-start">
          <h1 className="font-cairo text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-anbar-dark leading-[1.18]">
            حيث يلتقي الدفء <br />
            <span className="text-anbar-amber font-black">بالمذاق العصري.</span>
          </h1>

          <p className="text-anbar-dark/75 text-base sm:text-lg max-w-xl font-medium leading-relaxed">
            عنبر هو ملاذ هادئ صُمم للصباحات الهادئة، التجمعات النابضة بالحياة، والوصفات المحضرة بحرفية من الفرن الحجري وتحت شمس الطبيعة.
          </p>

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
