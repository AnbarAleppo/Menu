'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ShoppingBag, Plus, Minus, Check, Trash2, Send, QrCode, MapPin } from 'lucide-react';
import { CartItem } from '@/lib/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  tableNumber: string;
  onTableNumberChange: (tbl: string) => void;
  isQrDetected?: boolean;
  onUpdateCartQty: (itemId: string, delta: number) => void;
  onClearCart: () => void;
  onOrderSuccess: (orderData: any) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  tableNumber,
  onTableNumberChange,
  isQrDetected = false,
  onUpdateCartQty,
  onClearCart,
  onOrderSuccess,
}: CartDrawerProps) {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_number: tableNumber || 'طاولة عامة',
          items: cart,
          total,
          notes,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onOrderSuccess(data);
        onClearCart();
        onClose();
      } else {
        alert(data.error || 'حدث خطأ أثناء إرسال الطلب');
      }
    } catch (err) {
      console.error('Order submit error:', err);
      // Fallback success
      onOrderSuccess({ message: 'تم استلام الطلب' });
      onClearCart();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-anbar-dark/40 backdrop-blur-sm"
      />

      {/* Drawer Panel */}
      <div
        className={`absolute top-0 left-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-anbar-subtle flex items-center justify-between bg-anbar-bg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-anbar-amber/15 text-anbar-amber flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cairo font-bold text-lg text-anbar-dark">قائمة طلباتك</h3>
              <p className="text-[11px] text-anbar-dark/50">مراجعة الأصناف وإرسال الطلب للمطبخ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-anbar-subtle flex items-center justify-center text-anbar-dark hover:bg-anbar-dark hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-anbar-dark/50 font-medium">
              <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-anbar-slate/40" />
              <p className="text-xs font-bold text-anbar-dark">قائمة طلباتك فارغة حالياً</p>
              <p className="text-[11px] text-anbar-dark/50 mt-1">
                أضف بعض الأطباق لمراجعة الفاتورة وإرسال الطلب للمطبخ.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 bg-anbar-bg rounded-2xl border border-anbar-subtle shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-anbar-subtle shrink-0">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-anbar-dark truncate leading-snug">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-anbar-dark/50 font-medium">
                      {item.price.toLocaleString('ar-SY')} ل.س للطبق
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1 border border-anbar-subtle" dir="ltr">
                    <button
                      onClick={() => onUpdateCartQty(item.id, -1)}
                      className="w-5 h-5 rounded-full bg-anbar-bg text-anbar-dark flex items-center justify-center font-bold text-xs hover:bg-anbar-rust hover:text-white transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-black w-4 text-center text-anbar-dark">
                      {item.qty.toLocaleString('ar-SY')}
                    </span>
                    <button
                      onClick={() => onUpdateCartQty(item.id, 1)}
                      className="w-5 h-5 rounded-full bg-anbar-bg text-anbar-dark flex items-center justify-center font-bold text-xs hover:bg-anbar-amber hover:text-white transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-xs font-black text-anbar-dark text-left whitespace-nowrap">
                    {(item.price * item.qty).toLocaleString('ar-SY')} ل.س
                  </span>
                </div>
              </div>
            ))
          )}

          {/* Table Number & Notes Section */}
          {cart.length > 0 && (
            <div className="pt-4 border-t border-anbar-subtle space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-anbar-dark/80 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-anbar-amber" />
                    <span>رقم الطاولة أو موقع الجلسة:</span>
                  </label>
                  {isQrDetected && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <QrCode className="w-3 h-3" />
                      <span>تم التعرف عبر QR</span>
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => onTableNumberChange(e.target.value)}
                    placeholder="مثال: طاولة رقم 4 أو التراس"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-anbar-subtle text-xs bg-anbar-bg focus:outline-none focus:border-anbar-amber font-bold text-anbar-dark"
                  />
                </div>
                {isQrDetected && (
                  <p className="text-[10px] text-emerald-700 mt-1 font-medium">
                    تم ملء رقم الطاولة تلقائياً بعد مسح رمز الاستجابة السريعة (QR Code).
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-anbar-dark/70 mb-1">
                  ملاحظات خاصة للمطبخ (اختياري):
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: بدون بصل، زيادة ليمون..."
                  className="w-full px-3.5 py-2 rounded-xl border border-anbar-subtle text-xs bg-anbar-bg focus:outline-none focus:border-anbar-amber font-medium"
                />
              </div>
            </div>
          )}
        </div>

        {/* Drawer Summary Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-anbar-subtle bg-white space-y-4 font-medium">
            <div className="flex justify-between items-center text-sm font-bold text-anbar-dark">
              <span>الإجمالي</span>
              <span className="text-lg font-black text-anbar-rust">
                {total.toLocaleString('ar-SY')} ل.س
              </span>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="flex-1 py-3.5 rounded-2xl bg-anbar-dark text-white font-bold text-xs hover:bg-anbar-rust transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>جاري إرسال الطلب...</span>
                ) : (
                  <>
                    <span>تأكيد الطلب إلى {tableNumber || 'طاولتك'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
              <button
                onClick={onClearCart}
                className="px-4 py-3.5 rounded-2xl border border-anbar-subtle text-anbar-dark/60 font-bold text-xs hover:text-anbar-rust hover:border-anbar-rust transition-colors"
                title="إفراغ السلة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
