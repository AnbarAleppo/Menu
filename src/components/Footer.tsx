'use client';

import React from 'react';
import Image from 'next/image';
import { Phone } from 'lucide-react';

interface FooterProps {
  onShowToast?: (msg: string) => void;
}

export default function Footer({}: FooterProps) {
  return (
    <footer className="bg-anbar-dark text-white pt-16 pb-12 relative overflow-hidden mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-white/10">
          <div className="space-y-4">
            <div className="flex items-center">
              <Image
                src="/Anbar Logo.svg"
                alt="عنبر"
                width={120}
                height={48}
                className="h-11 w-auto object-contain brightness-0 invert opacity-95"
              />
            </div>
            <p className="text-xs text-white/60 leading-relaxed font-medium max-w-sm">
              مطبخ عصري ومساحة هادئة لتناول الأطعمة الصحية والمشروبات الدافئة تحت شمس الطبيعة.
            </p>
          </div>

          <div>
            <h4 className="font-cairo font-bold text-sm tracking-wide text-anbar-amber mb-4">ساعات العمل</h4>
            <ul className="space-y-2 text-xs text-white/70 font-medium">
              <li className="flex justify-between max-w-xs">
                <span>طيلة أيام الأسبوع:</span>
                <span className="text-white">11:00 ص – 11:00 م</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-cairo font-bold text-sm tracking-wide text-anbar-amber mb-4">تواصل معنا</h4>
            <p className="text-xs text-white/70 leading-relaxed font-medium">
              حلب، المنشية، مول عضومية
            </p>
            <p className="text-xs text-white/70 mt-3 font-medium flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-anbar-amber" />
              <span>+963 11 000 0000</span>
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40 font-medium">
          <p>© 2026 Anbar. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">إنستغرام</a>
            <a href="#" className="hover:text-white transition-colors">موقعنا</a>
            <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
