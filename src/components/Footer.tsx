'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Phone, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onShowToast: (msg: string) => void;
}

export default function Footer({ onShowToast }: FooterProps) {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setEmail('');
      onShowToast('شكراً لانضمامك إلى مجتمع عنبر!');
    }
  };

  return (
    <footer className="bg-anbar-dark text-white pt-16 pb-12 relative overflow-hidden mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center">
              <Image
                src="/Anbar Logo.svg"
                alt="عنبر"
                width={120}
                height={48}
                className="h-11 w-auto object-contain brightness-0 invert opacity-95"
              />
            </div>
            <p className="text-xs text-white/60 leading-relaxed font-medium">
              مطبخ عصري ومساحة هادئة لتناول الأطعمة الصحية والمشروبات الدافئة تحت شمس الطبيعة.
            </p>
          </div>

          <div>
            <h4 className="font-cairo font-bold text-sm tracking-wide text-anbar-amber mb-4">ساعات العمل</h4>
            <ul className="space-y-2 text-xs text-white/70 font-medium">
              <li className="flex justify-between">
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

          <div>
            <h4 className="font-cairo font-bold text-sm tracking-wide text-anbar-amber mb-4">النشرة البريدية</h4>
            <p className="text-xs text-white/60 mb-3 font-medium">
              انضم إلى مجتمع عنبر للحصول على التحديثات الموسمية والأطباق الحصرية.
            </p>
            <form onSubmit={handleNewsletter} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                className="bg-white/10 text-white placeholder-white/40 text-xs px-3.5 py-2.5 rounded-s-xl rounded-e-none focus:outline-none w-full border border-white/10 font-medium"
                required
              />
              <button
                type="submit"
                className="bg-anbar-amber hover:bg-anbar-amber-dark text-white px-4 rounded-e-xl rounded-s-none text-xs font-bold transition-colors shrink-0"
              >
                انضم
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40 font-medium">
          <p>© 2026 مطعم ومقهى عنبر Anbar. جميع الحقوق محفوظة.</p>
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
