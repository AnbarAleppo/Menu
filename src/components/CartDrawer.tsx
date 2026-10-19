'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle2,
  Trash2,
  Clock,
  History,
  RotateCcw,
  Receipt,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { CartItem } from '@/lib/types';
import {
  saveCustomerOrderToStorage,
  getCustomerOrdersFromStorage,
  StoredCustomerOrder
} from '@/lib/orderStorage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  tableNumber?: string;
  onTableNumberChange?: (tbl: string) => void;
  isQrDetected?: boolean;
  onUpdateCartQty: (itemId: string, delta: number) => void;
  onClearCart: () => void;
  onOrderSuccess: (orderData: any) => void;
  onReorderItems?: (items: CartItem[]) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  tableNumber,
  onTableNumberChange,
  isQrDetected,
  onUpdateCartQty,
  onClearCart,
  onOrderSuccess,
  onReorderItems,
}: CartDrawerProps) {
  const [activeTab, setActiveTab] = useState<'cart' | 'history'>('cart');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentOrders, setRecentOrders] = useState<StoredCustomerOrder[]>([]);

  // Load 4-hour cached orders whenever drawer is opened or tab changed
  useEffect(() => {
    if (isOpen) {
      const stored = getCustomerOrdersFromStorage();
      setRecentOrders(stored);
    }
  }, [isOpen, activeTab]);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleConfirmOrder = async () => {
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const resolvedTable = tableNumber && tableNumber.trim() ? tableNumber.trim() : 'طلب مباشر';
      const orderDataToSave = {
        id: `order-${Date.now()}`,
        order_number: Math.floor(1000 + Math.random() * 9000),
        table_number: resolvedTable,
        items: [...cart],
        total,
        notes,
        status: 'new' as const,
      };

      // Also attempt background sync if API is available
      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderDataToSave),
        });
      } catch (e) {
        // Safe offline fallback
      }

      // Save order to browser storage for 4 hours
      saveCustomerOrderToStorage(orderDataToSave);

      const updatedOrders = getCustomerOrdersFromStorage();
      setRecentOrders(updatedOrders);

      onOrderSuccess({ message: 'تم تثبيت الطلب! يرجى التوجه إلى الكاش لتثبيت طلباتك' });
      onClearCart();
      setNotes('');
      setActiveTab('history'); // Show the confirmed orders tab immediately
    } catch (err) {
      console.error('Order confirm error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-anbar-dark/40 backdrop-blur-sm"
      />

      {/* Drawer Panel */}
      <div
        className={`absolute top-0 left-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-anbar-subtle bg-anbar-bg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-anbar-amber/15 text-anbar-rust flex items-center justify-center shadow-inner">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cairo font-black text-base text-anbar-dark">طلبات مطعم عنبر</h3>
                <p className="text-[11px] text-anbar-dark/55 font-medium">سلة الأطباق وتثبيت الطلب</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-anbar-subtle flex items-center justify-center text-anbar-dark hover:bg-anbar-dark hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs: Current Cart vs Confirmed Orders */}
          <div className="grid grid-cols-2 gap-2 bg-white/80 p-1 rounded-2xl border border-anbar-subtle shadow-2xs">
            <button
              onClick={() => setActiveTab('cart')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'cart'
                  ? 'bg-anbar-dark text-white shadow-xs'
                  : 'text-anbar-dark/70 hover:text-anbar-dark'
                }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>السلة الحالية ({cart.reduce((s, i) => s + i.qty, 0)})</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'history'
                  ? 'bg-anbar-dark text-white shadow-xs'
                  : 'text-anbar-dark/70 hover:text-anbar-dark'
                }`}
            >
              <Receipt className="w-3.5 h-3.5 text-anbar-amber" />
              <span>طلباتك المثبتة ({recentOrders.length})</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: CURRENT CART CONTENT */}
        {/* ========================================================================= */}
        {activeTab === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-anbar-dark/50 font-medium">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-2.5 text-anbar-slate/40" />
                  <p className="text-xs font-bold text-anbar-dark">سلة الطلب الحالية فارغة</p>
                  <p className="text-[11px] text-anbar-dark/50 mt-1 max-w-xs mx-auto">
                    تصفح قائمة الطعام وأضف ما تشتهي من الأطباق والمشروبات ثم انقر على تثبيت الطلب.
                  </p>
                  {recentOrders.length > 0 && (
                    <button
                      onClick={() => setActiveTab('history')}
                      className="mt-4 px-4 py-2 rounded-full bg-anbar-amber/15 border border-anbar-amber/30 text-anbar-rust text-xs font-black hover:bg-anbar-amber hover:text-white transition-all inline-flex items-center gap-1.5"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>عرض طلباتك المثبتة ({recentOrders.length})</span>
                    </button>
                  )}
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
                          {item.price.toLocaleString('ar-SY')} ل.س للواحد
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

                      <span className="font-black text-xs text-anbar-rust w-20 text-left">
                        {(item.price * item.qty).toLocaleString('ar-SY')} ل.س
                      </span>
                    </div>
                  </div>
                ))
              )}

              {/* Notes */}
              {cart.length > 0 && (
                <div className="mt-4 pt-4 border-t border-anbar-subtle space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-anbar-dark/70 mb-1">
                      ملاحظات خاصة (اختياري):
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="مثال: بدون سكر، زيادة ثوم، تسخين خفيف..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-anbar-subtle text-xs bg-anbar-bg focus:outline-none focus:border-anbar-amber font-medium"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Current Cart Footer with 'تثبيت الطلب' */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-anbar-subtle bg-white space-y-3 font-medium">
                <div className="flex justify-between items-center text-sm font-bold text-anbar-dark">
                  <span>الإجمالي الكلي</span>
                  <span className="text-lg font-black text-anbar-rust">
                    {total.toLocaleString('ar-SY')} ل.س
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleConfirmOrder}
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 rounded-2xl bg-anbar-dark text-white font-bold text-xs hover:bg-anbar-rust transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>جاري تثبيت الطلب...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-anbar-amber" />
                        <span className="text-sm font-extrabold">تثبيت الطلب</span>
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
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CONFIRMED ORDERS & CASHIER NOTICE */}
        {/* ========================================================================= */}
        {activeTab === 'history' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Prominent Cashier Notice Banner */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-500/15 via-anbar-amber/20 to-amber-500/10 border-2 border-anbar-amber/50 text-anbar-dark space-y-2 text-center shadow-soft animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-anbar-amber text-anbar-dark mx-auto flex items-center justify-center font-black shadow-md">
                <Receipt className="w-6 h-6" />
              </div>
              <h4 className="font-cairo font-black text-base text-anbar-dark">
                توجه إلى الكاش لتثبيت طلباتك
              </h4>
              <p className="text-xs text-anbar-dark/80 font-medium leading-relaxed">
                يرجى التوجه إلى نقطة المحاسبة (الكاش) وإظهار طلبك لتأكيد التجهيز فوراً ودفع الحساب.
              </p>
            </div>

            {/* Info Notice about the 1-Hour browser cache */}
            <div className="p-3 rounded-2xl bg-white border border-anbar-subtle text-anbar-dark/70 text-[11px] font-medium flex items-center gap-2 shadow-2xs">
              <Clock className="w-4 h-4 text-anbar-amber shrink-0" />
              <span>تُحفظ كافة تفاصيل طلباتك هنا لمدة ساعة واحدة لسهولة المراجعة.</span>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-12 text-anbar-dark/50">
                <History className="w-12 h-12 mx-auto mb-2 text-anbar-slate/40" />
                <p className="text-xs font-bold text-anbar-dark">لا توجد طلبات مثبتة حالياً</p>
                <p className="text-[11px] text-anbar-dark/50 mt-1 max-w-xs mx-auto">
                  اختر أطباقك من القائمة واضغط على "تثبيت الطلب" لتظهر كافة تفاصيلها هنا.
                </p>
              </div>
            ) : (
              recentOrders.map((order, idx) => (
                <div
                  key={order.id || idx}
                  className="p-4 rounded-3xl bg-anbar-bg border border-anbar-subtle shadow-2xs space-y-3.5"
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between border-b border-anbar-subtle pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-cairo font-black text-xs text-anbar-dark">
                          طلب #{order.order_number || (order.id ? String(order.id).slice(-4) : idx + 1)}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          مثبت بانتظار الكاش
                        </span>
                      </div>
                      <span className="text-[10px] text-anbar-dark/50 font-medium block mt-1">
                        {new Date(order.timestamp).toLocaleTimeString('ar-SY', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Complete Items Breakdown */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-anbar-dark/70">تفاصيل الأصناف ({order.items.reduce((s, i) => s + (i.qty || 1), 0)}):</p>
                    <div className="space-y-1.5 bg-white p-3 rounded-2xl border border-anbar-subtle">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-anbar-subtle/50 last:border-0">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-anbar-amber/20 text-anbar-rust text-[10px] font-black flex items-center justify-center shrink-0">
                              {item.qty}×
                            </span>
                            <span className="font-bold text-xs text-anbar-dark">{item.title}</span>
                          </div>
                          <span className="font-bold text-xs text-anbar-rust shrink-0">
                            {((item.price || 0) * (item.qty || 1)).toLocaleString('ar-SY')} ل.س
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes if any */}
                  {order.notes && (
                    <div className="text-[11px] p-2.5 rounded-xl bg-white border border-anbar-subtle text-anbar-dark/80">
                      <strong className="text-anbar-dark">الملاحظات:</strong> {order.notes}
                    </div>
                  )}

                  {/* Order Total & Reorder Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-anbar-subtle">
                    <div className="text-xs font-bold text-anbar-dark">
                      <span>الإجمالي للحساب: </span>
                      <span className="font-black text-anbar-rust text-base">
                        {order.total.toLocaleString('ar-SY')} ل.س
                      </span>
                    </div>

                    {onReorderItems && (
                      <button
                        onClick={() => {
                          onReorderItems(order.items);
                          setActiveTab('cart');
                        }}
                        className="px-3 py-1.5 rounded-full bg-white border border-anbar-subtle text-anbar-dark hover:border-anbar-amber hover:text-anbar-amber text-[11px] font-bold transition-all flex items-center gap-1 shadow-2xs"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>طلب مرة أخرى</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
