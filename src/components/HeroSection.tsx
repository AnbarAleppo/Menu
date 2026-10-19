'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="pt-0 pb-8 sm:py-12 md:py-20 px-0 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-12 gap-6 sm:gap-8 lg:gap-14 items-center">
        {/* 1. Image Showcase (Placed BEFORE Text) */}
        <div className="md:col-span-5 relative w-full">
          <div className="relative w-full max-w-md mx-auto aspect-[16/10] sm:aspect-square">
            {/* Layered Rotated Backdrops (Hidden on mobile) */}
            <div className="hidden sm:block absolute inset-0 bg-anbar-slate rounded-[3rem] -rotate-3 opacity-75 transition-transform hover:-rotate-6 duration-500 shadow-lg"></div>
            <div className="hidden sm:block absolute inset-0 bg-anbar-amber rounded-[3rem] rotate-3 opacity-75 transition-transform hover:rotate-6 duration-500 shadow-lg"></div>

            {/* Main Image Frame: Full size without borders or effects on mobile */}
            <div className="relative h-full w-full rounded-none sm:rounded-[3rem] overflow-hidden border-0 sm:border sm:border-anbar-subtle shadow-none sm:shadow-2xl group">
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

        {/* 2. Hero Intro Text (Placed AFTER Image) */}
        <div className="md:col-span-7 space-y-5 sm:space-y-6 text-start px-4 sm:px-0">
          <h1 className="font-cairo text-3xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-anbar-dark leading-[1.18]">
            حيث يلتقي الدفء <br />
            <span className="text-anbar-amber font-black">بالمذاق العصري.</span>
          </h1>

          <p className="text-anbar-dark/75 text-sm sm:text-lg max-w-xl font-medium leading-relaxed">
            عنبر هو وجهتك الأولى للوجبات السريعة المحضرة بشغف، نكهات غنية، قرمشة لا تُقاوم، وتجربة طعام استثنائية تأتيك بأعلى جودة وأسرع وقت.
          </p>

          <div className="pt-1 sm:pt-2">
            <a
              href="#menu-section"
              className="inline-flex items-center gap-3 px-7 sm:px-8 py-3 sm:py-3.5 rounded-full bg-anbar-dark text-white font-bold text-sm hover:bg-anbar-rust transition-all shadow-xl shadow-anbar-dark/20 group cursor-pointer"
            >
              <span>استكشف القائمة الكاملة</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
