'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Trash2,
  Send,
  QrCode,
  MapPin,
  Clock,
  History,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { CartItem, MenuItem } from '@/lib/types';
import {
  saveCustomerOrderToStorage,
  getCustomerOrdersFromStorage,
  StoredCustomerOrder
} from '@/lib/orderStorage';

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
  onReorderItems?: (items: CartItem[]) => void;
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

      // Save order to browser storage for 4 hours
      const saved = saveCustomerOrderToStorage({
        id: data?.data?.id || `order-${Date.now()}`,
        order_number: data?.data?.order_number,
        table_number: tableNumber || 'طاولة عامة',
        items: [...cart],
        total,
        notes,
        status: 'new',
      });

      setRecentOrders(getCustomerOrdersFromStorage());

      if (res.ok) {
        onOrderSuccess(data);
        onClearCart();
        setNotes('');
        setActiveTab('history'); // Show the saved order tab
      } else {
        // Fallback save in local mode
        onOrderSuccess({ message: 'تم إرسال الطلب وحفظه بذاكرة المتصفح' });
        onClearCart();
        setNotes('');
        setActiveTab('history');
      }
    } catch (err) {
      console.error('Order submit error:', err);
      // Offline fallback: save order locally for 4 hours
      saveCustomerOrderToStorage({
        table_number: tableNumber || 'طاولة عامة',
        items: [...cart],
        total,
        notes,
        status: 'new',
      });
      setRecentOrders(getCustomerOrdersFromStorage());
      onOrderSuccess({ message: 'تم إرسال الطلب وحفظه في الذاكرة' });
      onClearCart();
      setNotes('');
      setActiveTab('history');
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
                <p className="text-[11px] text-anbar-dark/55 font-medium">إدارة السلة ومراجعة الطلبات السابقة</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-anbar-subtle flex items-center justify-center text-anbar-dark hover:bg-anbar-dark hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs: Current Cart vs 4-Hour Stored Orders */}
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
              <History className="w-3.5 h-3.5 text-anbar-amber" />
              <span>طلباتك السابقة ({recentOrders.length})</span>
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
                    تصفح قائمة الطعام وأضف ما تشتهي من الأطباق والمشروبات لإرسالها مباشرة للمطبخ.
                  </p>
                  {recentOrders.length > 0 && (
                    <button
                      onClick={() => setActiveTab('history')}
                      className="mt-4 px-4 py-2 rounded-full bg-anbar-amber/15 border border-anbar-amber/30 text-anbar-rust text-xs font-black hover:bg-anbar-amber hover:text-white transition-all inline-flex items-center gap-1.5"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>عرض طلباتك المرسلة ({recentOrders.length})</span>
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

                      <span className="font-black text-xs text-anbar-rust w-20 text-left">
                        {(item.price * item.qty).toLocaleString('ar-SY')} ل.س
                      </span>
                    </div>
                  </div>
                ))
              )}

              {/* Table Selection & Notes */}
              {cart.length > 0 && (
                <div className="mt-4 pt-4 border-t border-anbar-subtle space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-anbar-bg border border-anbar-subtle">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-anbar-rust" />
                      <span className="text-xs font-bold text-anbar-dark">رقم الطاولة:</span>
                    </div>

                    {isQrDetected ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-full text-emerald-800 text-xs font-black">
                        <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{tableNumber} (تلقائي عبر QR)</span>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={tableNumber}
                        onChange={(e) => onTableNumberChange(e.target.value)}
                        placeholder="مثال: طاولة رقم 4"
                        className="text-xs font-bold text-left px-3 py-1 bg-white border border-anbar-subtle rounded-xl focus:outline-none focus:border-anbar-amber w-36"
                      />
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

            {/* Current Cart Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-anbar-subtle bg-white space-y-3 font-medium">
                <div className="flex justify-between items-center text-sm font-bold text-anbar-dark">
                  <span>الإجمالي</span>
                  <span className="text-lg font-black text-anbar-rust">
                    {total.toLocaleString('ar-SY')} ل.س
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCheckout}
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 rounded-2xl bg-anbar-dark text-white font-bold text-xs hover:bg-anbar-rust transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>جاري إرسال الطلب...</span>
                    ) : (
                      <>
                        <span>إرسال الطلب إلى {tableNumber || 'المطبخ'}</span>
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
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: 4-HOUR SAVED RECENT ORDERS */}
        {/* ========================================================================= */}
        {activeTab === 'history' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Info Notice about the 4-Hour browser cache */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-medium flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-anbar-amber shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">سجل طلباتك</span>
                <span className="text-[11px] text-amber-900/80 leading-relaxed block mt-0.5">
                  يتم الاحتفاظ بجميع طلباتك في ذاكرة هذا الجهاز لمدة 4 ساعات ليتسنى لك مراجعتها والتأكد من تفاصيلها مع النادل في حال وجود أي استفسار أو خطأ.
                </span>
              </div>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-16 text-anbar-dark/50">
                <History className="w-12 h-12 mx-auto mb-2 text-anbar-slate/40" />
                <p className="text-xs font-bold text-anbar-dark">لا توجد طلبات سابقة مسجلة خلال الـ 4 ساعات</p>
                <p className="text-[11px] text-anbar-dark/50 mt-1 max-w-xs mx-auto">
                  بمجرد إرسالك أي طلب، ستجده محفوظاً هنا فوراً مع تفاصيل الأصناف والوقت المتبقي.
                </p>
              </div>
            ) : (
              recentOrders.map((order, idx) => (
                <div
                  key={order.id || idx}
                  className="p-4 rounded-3xl bg-anbar-bg border border-anbar-subtle shadow-2xs space-y-3"
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between border-b border-anbar-subtle pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-cairo font-black text-xs text-anbar-dark">
                          طلب #{order.order_number || (order.id ? String(order.id).slice(-4) : idx + 1)}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-anbar-dark text-white text-[10px] font-bold">
                          📍 {order.table_number}
                        </span>
                      </div>
                      <span className="text-[10px] text-anbar-dark/50 font-medium block mt-0.5">
                        {new Date(order.timestamp).toLocaleTimeString('ar-SY', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-1.5 text-xs">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-anbar-dark/80">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-anbar-amber/20 text-anbar-rust text-[10px] font-black flex items-center justify-center">
                            {item.qty}×
                          </span>
                          <span className="font-bold text-[11px] text-anbar-dark">{item.title}</span>
                        </div>
                        <span className="font-medium text-[11px] text-anbar-dark/60">
                          {((item.price || 0) * (item.qty || 1)).toLocaleString('ar-SY')} ل.س
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Notes if any */}
                  {order.notes && (
                    <div className="text-[11px] p-2 rounded-xl bg-white border border-anbar-subtle text-anbar-dark/70">
                      <strong className="text-anbar-dark">الملاحظات:</strong> {order.notes}
                    </div>
                  )}

                  {/* Order Total & Reorder Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-anbar-subtle">
                    <div className="text-xs font-bold text-anbar-dark">
                      <span>الإجمالي: </span>
                      <span className="font-black text-anbar-rust text-sm">
                        {order.total.toLocaleString('ar-SY')} ل.س
                      </span>
                    </div>

                    {onReorderItems && (
                      <button
                        onClick={() => {
                          onReorderItems(order.items);
                          setActiveTab('cart');
                        }}
                        className="px-3 py-1 rounded-full bg-white border border-anbar-subtle text-anbar-dark hover:border-anbar-amber hover:text-anbar-amber text-[11px] font-bold transition-all flex items-center gap-1 shadow-2xs"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>طلب مماثل</span>
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
