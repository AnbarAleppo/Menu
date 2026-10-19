'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Star, QrCode, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { MenuItem } from '@/lib/types';

interface DishModalProps {
  dish: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCartWithQty: (item: MenuItem, qty: number) => void;
  initialQty?: number;
  isQrDetected?: boolean;
  onRateDish?: (dishId: string, score: number) => Promise<void> | void;
}

export default function DishModal({
  dish,
  isOpen,
  onClose,
  onAddToCartWithQty,
  initialQty = 1,
  isQrDetected = false,
  onRateDish,
}: DishModalProps) {
  const [qty, setQty] = useState(initialQty);
  const [selectedScore, setSelectedScore] = useState<number>(0);
  const [hoverScore, setHoverScore] = useState<number>(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState<boolean>(false);
  const [userRating, setUserRating] = useState<number | null>(null);

  useEffect(() => {
    setQty(initialQty || 1);
    setSelectedScore(0);
    setHoverScore(0);

    // Check if user already rated this dish
    if (dish && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('anbar_user_ratings');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed[dish.id]) {
            setUserRating(parsed[dish.id]);
          } else {
            setUserRating(null);
          }
        } else {
          setUserRating(null);
        }
      } catch (e) {
        setUserRating(null);
      }
    }
  }, [dish, initialQty, isOpen]);

  if (!isOpen || !dish) return null;

  const handleAdd = () => {
    onAddToCartWithQty(dish, qty);
    onClose();
  };

  const handleRatingSubmit = async (scoreToSubmit?: number) => {
    const score = scoreToSubmit || selectedScore;
    if (!dish || score < 1 || score > 5 || isSubmittingRating) return;

    setIsSubmittingRating(true);
    try {
      if (onRateDish) {
        await onRateDish(dish.id, score);
      } else {
        await fetch('/api/ratings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: dish.id, score }),
        });
      }

      // Save user's rating locally so they see their rating
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('anbar_user_ratings');
        const parsed = stored ? JSON.parse(stored) : {};
        parsed[dish.id] = score;
        localStorage.setItem('anbar_user_ratings', JSON.stringify(parsed));
      }

      setUserRating(score);
    } catch (err) {
      console.error('Failed to submit rating:', err);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const getScoreLabel = (score: number) => {
    switch (score) {
      case 5:
        return 'ممتاز جداً وفوق التوقعات 🌟';
      case 4:
        return 'لذيذ جداً ومميز 👍';
      case 3:
        return 'جيد وطيب ☕';
      case 2:
        return 'مقبول';
      case 1:
        return 'يحتاج إلى تحسين';
      default:
        return 'اختر عدد النجوم للتقييم';
    }
  };

  const getCategoryLabel = (slug: string) => {
    const map: Record<string, string> = {
      'hot-drinks': 'مشروبات ساخنة',
      'latte': 'لاتيه وقهاوي',
      'fresh-juices': 'عصائر فريش',
      'cold-mixes': 'خلطات باردة',
      'smoothies': 'سموزيات',
      'milkshake': 'ميلك شيك',
      'cocktails': 'كوكتيلات',
      'ice-cream': 'بوظة ومثلجات',
      'crepe': 'كريب فرنسي',
      'special-sweets': 'حلويات خاصة',
      'salads': 'سلطات طازجة',
      'sandwiches': 'سندويشات',
      'beef': 'لحم عجل وستيك',
      'appetizers': 'مقبلات وسناكات',
      'pasta': 'باستا إيطالية',
      'plomi': 'أطباق بلومي',
      'burgers': 'برغر مشوي',
      'pizza': 'بيتزا إيطالية',
      'family-meals': 'وجبات عائلية',
      'main-meals': 'وجبات رئيسية',
    };
    return map[slug] || 'عنبر';
  };

  const currentAvgRating = dish.rating || 4.8;
  const currentReviewCount = dish.rating_count || 18;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-anbar-dark/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-anbar-subtle shadow-2xl overflow-hidden transform transition-transform duration-300 max-h-[90vh] flex flex-col z-10 animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur border border-anbar-subtle flex items-center justify-center text-anbar-dark hover:bg-anbar-dark hover:text-white transition-all shadow-md cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dish Image Banner */}
        <div className="relative h-56 sm:h-64 w-full shrink-0 overflow-hidden bg-anbar-bg">
          <Image
            src={dish.image_url}
            alt={dish.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 512px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/35"></div>
          <div className="absolute bottom-4 right-6 z-10 flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-white bg-anbar-rust/95 px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md">
              {getCategoryLabel(dish.category_slug)}
            </span>
          </div>

          {/* Star Rating Badge on Banner */}
          <div className="absolute bottom-4 left-6 z-10">
            <span className="px-3 py-1 rounded-full bg-black/60 text-white border border-white/30 text-xs font-bold backdrop-blur-md flex items-center gap-1.5 shadow-md">
              <Star className="w-3.5 h-3.5 text-anbar-amber fill-anbar-amber" />
              <span>{currentAvgRating.toFixed(1)}</span>
              <span className="text-white/70 text-[10px]">({currentReviewCount} تقييم)</span>
            </span>
          </div>
        </div>

        {/* Details Content */}
        <div className="p-6 md:p-7 overflow-y-auto flex-1 space-y-6">
          {/* Title and Price */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-anbar-dark leading-snug">{dish.title}</h3>
            </div>
            <span className="text-xl font-black text-anbar-rust whitespace-nowrap">
              {dish.price.toLocaleString('ar-SY')} ل.س
            </span>
          </div>

          {/* Description */}
          <p className="text-anbar-dark/75 text-xs sm:text-sm leading-relaxed font-medium">
            {dish.description}
          </p>

          {/* ========================================================================= */}
          {/* RATING SECTION (Exclusive for Table QR Scanned Customers) */}
          {/* ========================================================================= */}
          <div className="p-4 rounded-3xl bg-anbar-bg border border-anbar-subtle space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-anbar-amber" />
                <span className="font-bold text-xs text-anbar-dark">تقييم هذا الطبق</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-anbar-dark/60">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{currentAvgRating.toFixed(1)} من 5</span>
                <span className="text-[10px] text-anbar-dark/40">({currentReviewCount} زبون)</span>
              </div>
            </div>

            {/* Case 1: Customer scanned the Table QR Code (Rating Allowed) */}
            {isQrDetected ? (
              <div className="space-y-2.5 pt-1">
                {userRating ? (
                  /* Already Rated State */
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>شكراً لتقييمك! تقييمك: {userRating}/5 نجوم ⭐</span>
                    </div>
                    <button
                      onClick={() => setUserRating(null)}
                      className="text-[10px] text-emerald-700 underline hover:text-emerald-900 cursor-pointer"
                    >
                      تعديل التقييم
                    </button>
                  </div>
                ) : (
                  /* Interactive Star Rating Form */
                  <>
                    <div className="flex items-center justify-center gap-2 py-1" dir="ltr">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const active = (hoverScore || selectedScore) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverScore(star)}
                            onMouseLeave={() => setHoverScore(0)}
                            onClick={() => {
                              setSelectedScore(star);
                              handleRatingSubmit(star);
                            }}
                            className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                            title={`${star} من 5`}
                          >
                            <Star
                              className={`w-7 h-7 transition-colors ${
                                active
                                  ? 'text-amber-500 fill-amber-500 filter drop-shadow-xs'
                                  : 'text-anbar-slate/30 fill-transparent hover:text-amber-400'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-center text-[11px] font-bold text-anbar-dark/70">
                      {getScoreLabel(hoverScore || selectedScore)}
                    </p>
                  </>
                )}
              </div>
            ) : (
              /* Case 2: Direct Website Visitor without Table QR (Rating Locked) */
              <div className="p-3 rounded-2xl bg-white border border-anbar-subtle text-anbar-dark flex items-start gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-anbar-amber/15 text-anbar-rust flex items-center justify-center shrink-0 mt-0.5">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-anbar-dark">التقييم متاح لزبائن المطعم فقط 📱</p>
                  <p className="text-[10px] text-anbar-dark/60 font-medium mt-0.5 leading-relaxed">
                    قم بمسح رمز الـ QR الموجود على طاولتك لتتمكن من تقييم الأطباق ومشاركة رأيك معنا مباشرة.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quantity and Add to Cart Action */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-anbar-subtle">
            <div className="flex items-center gap-3 bg-anbar-bg p-1.5 rounded-full border border-anbar-subtle" dir="ltr">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-7 h-7 rounded-full bg-white text-anbar-dark flex items-center justify-center hover:bg-anbar-amber hover:text-white font-bold transition-all shadow-xs cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-xs font-black text-anbar-dark">
                {qty.toLocaleString('ar-SY')}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-7 h-7 rounded-full bg-white text-anbar-dark flex items-center justify-center hover:bg-anbar-amber hover:text-white font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="flex-1 py-3.5 bg-anbar-dark text-white rounded-full font-bold text-xs hover:bg-anbar-rust transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة للطلب ({(dish.price * qty).toLocaleString('ar-SY')} ل.س)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
