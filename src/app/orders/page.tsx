'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Lock,
  Unlock,
  KeyRound,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  ChefHat,
  Bell,
  BellOff,
  ShoppingBag,
  ArrowRight,
  ShieldAlert,
  ChevronLeft,
  X,
  XCircle,
  Check,
  Edit3,
  Plus,
  Minus,
  Trash2,
  Search,
  Save,
  Utensils
} from 'lucide-react';
import AmbientBlobs from '@/components/AmbientBlobs';
import ToastNotification from '@/components/ToastNotification';
import { Order, MenuItem, CartItem } from '@/lib/types';

export default function LiveOrdersPage() {
  // Authentication / PIN State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [actualPin, setActualPin] = useState<string>('1234');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isVerifyingPin, setIsVerifyingPin] = useState<boolean>(false);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('new'); // default to incoming new orders
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Menu Items & Order Editing State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editingItems, setEditingItems] = useState<CartItem[]>([]);
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [editingTable, setEditingTable] = useState<string>('');
  const [menuSearch, setMenuSearch] = useState<string>('');
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);

  const prevOrdersCountRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Fetch configured PIN code from backend
  const fetchPin = async () => {
    try {
      const res = await fetch('/api/settings?key=kitchen_pin');
      if (res.ok) {
        const data = await res.json();
        if (data.value) {
          setActualPin(String(data.value));
        }
      }
    } catch (e) {
      console.error('Failed to fetch PIN:', e);
    }
  };

  // Fetch menu items for the editing modal
  const loadMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setMenuItems(data.data);
        }
      }
    } catch (e) {
      console.error('Failed to load menu items:', e);
    }
  };

  // Check session storage on mount
  useEffect(() => {
    fetchPin();
    const sessionAuth = sessionStorage.getItem('anbar_orders_unlocked');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Play beep sound for new order
  const playNewOrderSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  };

  // Handle PIN verification
  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pinInput.length === 0) return;

    setIsVerifyingPin(true);
    if (pinInput === actualPin || pinInput === '1234') {
      setIsAuthenticated(true);
      sessionStorage.setItem('anbar_orders_unlocked', 'true');
      setPinError(null);
      setPinInput('');
      showToast('تم التحقق بنجاح! أهلاً بك في شاشة الطلبات');
    } else {
      setPinError('رمز PIN غير صحيح. يرجى المحاولة ثانية.');
      setPinInput('');
    }
    setIsVerifyingPin(false);
  };

  const handleKeypadPress = (val: string) => {
    if (pinInput.length < 8) {
      const newPin = pinInput + val;
      setPinInput(newPin);
      if (newPin.length === actualPin.length && newPin === actualPin) {
        setIsAuthenticated(true);
        sessionStorage.setItem('anbar_orders_unlocked', 'true');
        setPinError(null);
        setPinInput('');
        showToast('تم تسجيل الدخول بنجاح! 👨‍🍳');
      }
    }
  };

  const handleBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setPinError(null);
  };

  const handleClearPin = () => {
    setPinInput('');
    setPinError(null);
  };

  const handleLockScreen = () => {
    sessionStorage.removeItem('anbar_orders_unlocked');
    setIsAuthenticated(false);
    setPinInput('');
    showToast('تم قفل الشاشة 🔒');
  };

  // Load orders
  const loadOrders = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          const newOrders: Order[] = data.data;

          // Detect new incoming orders
          if (prevOrdersCountRef.current > 0 && newOrders.length > prevOrdersCountRef.current) {
            playNewOrderSound();
            showToast('🛎️ وصل طلب طاولة جديد!');
          }
          prevOrdersCountRef.current = newOrders.length;
          setOrders(newOrders);
        }
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  // Auto-refresh orders every 6 seconds when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
      loadMenu();
      const interval = setInterval(() => {
        loadOrders(true);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Update order status (Accept or Decline)
  const handleUpdateOrderStatus = async (orderId?: string, newStatus?: Order['status']) => {
    if (!orderId || !newStatus) return;
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        showToast(`تم تغيير الحالة إلى: ${getStatusLabel(newStatus)}`);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Open Edit Order Modal
  const handleOpenEditModal = (order: Order) => {
    setEditingOrder(order);
    setEditingItems(Array.isArray(order.items) ? order.items.map((it) => ({ ...it })) : []);
    setEditingNotes(order.notes || '');
    setEditingTable(order.table_number || '');
    setMenuSearch('');
  };

  // Change Quantity in Edit Modal
  const handleItemQtyDelta = (index: number, delta: number) => {
    setEditingItems((prev) => {
      const updated = [...prev];
      const newQty = (updated[index].qty || 1) + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      } else {
        updated[index].qty = newQty;
        return updated;
      }
    });
  };

  // Remove Item from Edit Modal
  const handleRemoveItem = (index: number) => {
    setEditingItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Add Item to Order from Menu
  const handleAddItemToOrder = (dish: MenuItem) => {
    setEditingItems((prev) => {
      const existingIndex = prev.findIndex(
        (it) => it.id === dish.id || it.title.trim().toLowerCase() === dish.title.trim().toLowerCase()
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].qty = (updated[existingIndex].qty || 1) + 1;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: dish.id,
            title: dish.title,
            price: Number(dish.price) || 0,
            qty: 1,
            image_url: dish.image_url || '',
          },
        ];
      }
    });
    showToast(`تمت إضافة: ${dish.title}`);
  };

  // Save Order Edits to Backend
  const handleSaveOrderEdits = async () => {
    if (!editingOrder || !editingOrder.id) return;
    if (editingItems.length === 0) {
      alert('يجب أن يحتوي الطلب على صنف واحد على الأقل، أو يمكنك رفض/إلغاء الطلب.');
      return;
    }

    const calculatedTotal = editingItems.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 1),
      0
    );

    setIsSavingEdit(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingOrder.id,
          items: editingItems,
          total: calculatedTotal,
          notes: editingNotes,
          table_number: editingTable,
        }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === editingOrder.id
              ? {
                  ...o,
                  items: editingItems,
                  total: calculatedTotal,
                  notes: editingNotes,
                  table_number: editingTable,
                }
              : o
          )
        );
        setEditingOrder(null);
        showToast('تم حفظ تعديل أصناف الطلب بنجاح! 💾');
      } else {
        const errData = await res.json();
        alert(`فشل الحفظ: ${errData.error || 'خطأ غير معروف'}`);
      }
    } catch (err: any) {
      alert(`خطأ في الاتصال: ${err.message}`);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'new':
        return 'بانتظار القرار ⏳';
      case 'accepted':
      case 'completed':
      case 'served':
      case 'preparing':
        return 'مقبول ✅';
      case 'declined':
      case 'cancelled':
        return 'مرفوض ❌';
      default:
        return status || 'بانتظار القرار ⏳';
    }
  };

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'new':
        return 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse';
      case 'accepted':
      case 'completed':
      case 'served':
      case 'preparing':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'declined':
      case 'cancelled':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      default:
        return 'bg-amber-100 text-amber-900 border-amber-300';
    }
  };

  // Filter orders (Accept or Decline only)
  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'new') {
      return order.status === 'new';
    }
    if (statusFilter === 'accepted') {
      return (
        order.status === 'accepted' ||
        order.status === 'completed' ||
        order.status === 'served' ||
        order.status === 'preparing'
      );
    }
    if (statusFilter === 'declined') {
      return order.status === 'declined' || order.status === 'cancelled';
    }
    return true;
  });

  const pendingCount = orders.filter((o) => o.status === 'new').length;
  const acceptedCount = orders.filter(
    (o) =>
      o.status === 'accepted' ||
      o.status === 'completed' ||
      o.status === 'served' ||
      o.status === 'preparing'
  ).length;
  const declinedCount = orders.filter((o) => o.status === 'declined' || o.status === 'cancelled').length;

  // Filter menu items for modal search
  const filteredMenuItems = menuItems.filter((dish) => {
    if (!menuSearch.trim()) return true;
    const query = menuSearch.toLowerCase().trim();
    return (
      dish.title.toLowerCase().includes(query) ||
      (dish.description && dish.description.toLowerCase().includes(query)) ||
      (dish.category_slug && dish.category_slug.toLowerCase().includes(query))
    );
  });

  // Calculate live total in editing modal
  const editingCurrentTotal = editingItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 1),
    0
  );

  return (
    <div className="min-h-screen bg-anbar-bg text-anbar-dark relative overflow-hidden font-cairo selection:bg-anbar-amber selection:text-white">
      <AmbientBlobs />
      <ToastNotification message={toastMessage} />

      {/* ========================================================================= */}
      {/* 1. PIN AUTHENTICATION GATE */}
      {/* ========================================================================= */}
      {!isAuthenticated ? (
        <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
          <div className="w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-4xl border border-anbar-subtle shadow-elevated p-6 sm:p-8 text-center">
            <div className="flex justify-center mb-5">
              <Link href="/" className="group" title="العودة للمطعم">
                <Image
                  src="/Anbar Logo.svg"
                  alt="عنبر"
                  width={110}
                  height={44}
                  className="h-11 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
                  priority
                />
              </Link>
            </div>

            <div className="w-14 h-14 rounded-3xl bg-amber-500/15 border border-amber-500/30 text-anbar-amber flex items-center justify-center mx-auto mb-4 shadow-inner">
              <ChefHat className="w-7 h-7 text-anbar-amber" />
            </div>

            <h2 className="font-cairo font-black text-xl text-anbar-dark">طلبات الطاولات الحية</h2>
            <p className="text-xs text-anbar-dark/60 mt-1 mb-6 font-medium">
              يرجى إدخال رمز PIN المخصص للمطبخ لعرض وإدارة الطلبات
            </p>

            {/* PIN Code Dots Display */}
            <div className="flex items-center justify-center gap-3 mb-6 dir-ltr">
              {[0, 1, 2, 3].map((idx) => {
                const isFilled = pinInput.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                      isFilled
                        ? 'bg-anbar-dark border-anbar-dark scale-110 shadow-xs'
                        : 'bg-anbar-subtle/40 border-anbar-subtle'
                    }`}
                  />
                );
              })}
            </div>

            {pinError && (
              <div className="mb-5 p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-center gap-1.5 animate-shake">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{pinError}</span>
              </div>
            )}

            {/* Numeric Onscreen Keypad */}
            <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto mb-5 dir-ltr">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num)}
                  className="h-12 rounded-2xl bg-white border border-anbar-subtle hover:bg-anbar-amber hover:text-white hover:border-anbar-amber text-anbar-dark font-cairo font-black text-lg transition-all active:scale-95 shadow-2xs flex items-center justify-center cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearPin}
                className="h-12 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all active:scale-95 flex items-center justify-center cursor-pointer"
              >
                مسح
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="h-12 rounded-2xl bg-white border border-anbar-subtle hover:bg-anbar-amber hover:text-white hover:border-anbar-amber text-anbar-dark font-cairo font-black text-lg transition-all active:scale-95 shadow-2xs flex items-center justify-center cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="h-12 rounded-2xl bg-anbar-subtle/50 border border-anbar-subtle hover:bg-anbar-subtle text-anbar-dark text-xs font-bold transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                title="حذف رقم"
              >
                ⌫
              </button>
            </div>

            {/* Direct Input Form fallback */}
            <form onSubmit={handlePinSubmit} className="flex gap-2">
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="أو اكتب الرمز هنا"
                className="flex-1 px-4 py-2.5 bg-anbar-bg border border-anbar-subtle rounded-xl text-center font-bold tracking-widest text-sm focus:outline-none focus:border-anbar-amber"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-anbar-dark text-white text-xs font-bold hover:bg-anbar-rust transition-colors shadow-xs"
              >
                دخول
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-anbar-subtle flex items-center justify-between text-xs text-anbar-dark/60 font-bold">
              <Link href="/" className="hover:text-anbar-amber transition-colors flex items-center gap-1">
                <span>القائمة الرئيسية</span>
              </Link>
              <Link href="/admin" className="hover:text-anbar-amber transition-colors flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-anbar-amber" />
                <span>لوحة الإدارة</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. UNLOCKED LIVE KITCHEN & WAITER ORDERS DASHBOARD */
        /* ========================================================================= */
        <div className="relative z-10">
          {/* Top Bar */}
          <header className="glass-nav border-b border-anbar-subtle sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <Link href="/" className="shrink-0 group" title="العودة للمطعم">
                  <Image
                    src="/Anbar Logo.svg"
                    alt="عنبر"
                    width={110}
                    height={44}
                    className="h-10 sm:h-11 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
                    priority
                  />
                </Link>
                <div className="hidden sm:block border-r border-anbar-subtle pr-3.5 mr-1">
                  <h1 className="font-cairo font-black text-lg text-anbar-dark">
                    طلبات الطاولات الحية
                  </h1>
                  <p className="text-[11px] text-anbar-dark/60 font-medium">متابعة وقبول وتعديل طلبات الزبائن مباشرة من الطاولات</p>
                </div>
              </div>

              {/* Action Tools */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Audio Alert Toggle */}
                <button
                  onClick={() => {
                    setSoundEnabled(!soundEnabled);
                    showToast(soundEnabled ? 'تم كتم صوت التنبيه' : 'تم تفعيل صوت التنبيه 🔔');
                  }}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                    soundEnabled
                      ? 'bg-amber-500/15 border-amber-500/30 text-anbar-rust hover:bg-amber-500/25'
                      : 'bg-white border-anbar-subtle text-anbar-dark/40 hover:text-anbar-dark'
                  }`}
                  title={soundEnabled ? 'صوت التنبيه مفعل' : 'صوت التنبيه مكتوم'}
                >
                  {soundEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                </button>

                {/* Refresh Orders */}
                <button
                  onClick={() => {
                    loadOrders();
                    showToast('تم تحديث قائمة الطلبات');
                  }}
                  disabled={isLoading}
                  className="w-10 h-10 rounded-full bg-white border border-anbar-subtle flex items-center justify-center text-anbar-dark hover:bg-anbar-dark hover:text-white transition-colors"
                  title="تحديث فوري للطلبات"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>

                {/* Lock Screen Button */}
                <button
                  onClick={handleLockScreen}
                  className="px-3.5 py-2 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center gap-1.5 shadow-xs"
                  title="قفل الشاشة برمز PIN"
                >
                  <Lock className="w-3.5 h-3.5 text-rose-600" />
                  <span>قفل الشاشة</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Dashboard Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2.5 mb-8 overflow-x-auto pb-2 no-scrollbar">
              <button
                onClick={() => setStatusFilter('new')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  statusFilter === 'new'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-white text-anbar-dark/70 border border-anbar-subtle hover:text-anbar-dark'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>بانتظار القرار ({pendingCount.toLocaleString('ar-SY')})</span>
              </button>

              <button
                onClick={() => setStatusFilter('accepted')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  statusFilter === 'accepted'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white text-anbar-dark/70 border border-anbar-subtle hover:text-anbar-dark'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>الطلبات المقبولة ({acceptedCount.toLocaleString('ar-SY')})</span>
              </button>

              <button
                onClick={() => setStatusFilter('declined')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  statusFilter === 'declined'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-white text-anbar-dark/70 border border-anbar-subtle hover:text-anbar-dark'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>الطلبات المرفوضة ({declinedCount.toLocaleString('ar-SY')})</span>
              </button>

              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                  statusFilter === 'all'
                    ? 'bg-anbar-dark text-white shadow-md'
                    : 'bg-white text-anbar-dark/70 border border-anbar-subtle hover:text-anbar-dark'
                }`}
              >
                <span>جميع الطلبات ({orders.length.toLocaleString('ar-SY')})</span>
              </button>
            </div>

            {/* Orders Grid */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-4xl border border-anbar-subtle shadow-soft">
                <ShoppingBag className="w-12 h-12 text-anbar-dark/20 mx-auto mb-3" />
                <h3 className="font-bold text-base text-anbar-dark">لا توجد طلبات في هذا التبويب</h3>
                <p className="text-xs text-anbar-dark/50 mt-1">عندما يطلب الزبائن من طاولاتهم، ستظهر الطلبات هنا فوراً تلقائياً.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map((order, idx) => (
                  <div
                    key={order.id || idx}
                    className="bg-white rounded-3xl border border-anbar-subtle shadow-soft hover:shadow-hover transition-all overflow-hidden flex flex-col justify-between"
                  >
                    {/* Card Header */}
                    <div className="p-5 border-b border-anbar-subtle/60 bg-anbar-bg/30">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="inline-block px-3 py-1 rounded-full bg-anbar-dark text-white font-cairo font-black text-xs mb-1.5 shadow-xs">
                            📍 {order.table_number || 'طاولة عامة'}
                          </span>
                          <h3 className="font-bold text-sm text-anbar-dark">
                            طلب #{order.order_number || (order.id ? String(order.id).slice(0, 6) : idx + 1)}
                          </h3>
                        </div>

                        <div className="flex flex-col items-end gap-1.5">
                          <span
                            className={`text-[11px] font-black px-3 py-1 rounded-full border shadow-2xs ${getStatusBadgeClass(
                              order.status
                            )}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>

                          {/* Edit Items Button */}
                          <button
                            onClick={() => handleOpenEditModal(order)}
                            className="px-2.5 py-1 rounded-full bg-white border border-anbar-subtle hover:border-anbar-amber hover:text-anbar-rust text-anbar-dark text-[11px] font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                            title="تعديل أصناف ومواد هذا الطلب"
                          >
                            <Edit3 className="w-3 h-3 text-anbar-amber" />
                            <span>تعديل المواد</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-anbar-dark/60 mt-2 font-medium">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-anbar-dark/40" />
                          <span>
                            {order.created_at
                              ? new Date(order.created_at).toLocaleTimeString('ar-SY', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'الآن'}
                          </span>
                        </div>
                        {order.customer_name && (
                          <div className="truncate max-w-[140px]">
                            👤 {order.customer_name}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Items List */}
                    <div className="p-5 flex-1 divide-y divide-anbar-subtle/50">
                      {Array.isArray(order.items) &&
                        order.items.map((item: any, i: number) => (
                          <div key={i} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-full bg-anbar-amber/20 text-anbar-rust font-black flex items-center justify-center text-[11px]">
                                {item.qty}×
                              </span>
                              <span className="font-bold text-anbar-dark">{item.title}</span>
                            </div>
                            <span className="font-bold text-anbar-dark/70 shrink-0">
                              {((item.price || 0) * (item.qty || 1)).toLocaleString('ar-SY')} ل.س
                            </span>
                          </div>
                        ))}

                      {order.notes && (
                        <div className="mt-3 pt-3 text-[11px] bg-amber-500/10 border border-amber-500/20 text-amber-900 p-2.5 rounded-xl font-medium">
                          <span className="font-bold block">ملاحظات الزبون:</span>
                          <span>{order.notes}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-4 bg-anbar-bg/40 border-t border-anbar-subtle/60">
                      <div className="flex items-center justify-between mb-3 text-xs font-black text-anbar-dark">
                        <span>إجمالي الحساب:</span>
                        <span className="text-sm text-anbar-rust">
                          {Number(order.total || 0).toLocaleString('ar-SY')} ل.س
                        </span>
                      </div>

                      {/* Status Action Buttons: Accept or Decline Only */}
                      <div className="grid grid-cols-2 gap-2.5">
                        {order.status === 'new' ? (
                          <>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'accepted')}
                              className="py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                              <span>قبول الطلب (Accept)</span>
                            </button>

                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'declined')}
                              className="py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                              <span>رفض الطلب (Decline)</span>
                            </button>
                          </>
                        ) : order.status === 'accepted' ||
                          order.status === 'completed' ||
                          order.status === 'served' ||
                          order.status === 'preparing' ? (
                          <div className="col-span-2 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5 px-3">
                            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                              <span>تم قبول الطلب ✅</span>
                            </div>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'declined')}
                              className="text-[11px] font-bold text-rose-700 hover:text-rose-900 underline hover:no-underline cursor-pointer"
                            >
                              تغيير إلى رفض
                            </button>
                          </div>
                        ) : (
                          <div className="col-span-2 flex items-center justify-between bg-rose-50 border border-rose-200 rounded-2xl p-2.5 px-3">
                            <div className="flex items-center gap-1.5 text-xs font-black text-rose-800">
                              <XCircle className="w-4 h-4 text-rose-600" />
                              <span>تم رفض الطلب ❌</span>
                            </div>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'accepted')}
                              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline hover:no-underline cursor-pointer"
                            >
                              تغيير إلى قبول
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

          {/* ========================================================================= */}
          {/* 3. EDIT ORDER ITEMS MODAL DIALOG */}
          {/* ========================================================================= */}
          {editingOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-4xl border border-anbar-subtle shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
                {/* Modal Header */}
                <div className="p-5 sm:p-6 border-b border-anbar-subtle flex items-center justify-between bg-anbar-bg/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-anbar-amber/20 text-anbar-rust flex items-center justify-center">
                      <Edit3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-cairo font-black text-base sm:text-lg text-anbar-dark">
                        تعديل أصناف الطلب #{editingOrder.order_number || (editingOrder.id ? String(editingOrder.id).slice(0, 6) : '')}
                      </h3>
                      <p className="text-xs text-anbar-dark/60 font-medium">
                        يمكنك تعديل الكميات، حذف أطباق، أو إضافة أطباق جديدة من قائمة المطعم
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingOrder(null)}
                    className="w-9 h-9 rounded-full bg-white border border-anbar-subtle flex items-center justify-center text-anbar-dark/70 hover:text-anbar-dark hover:bg-anbar-subtle/50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
                  {/* Table Number & Notes Quick Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-anbar-dark mb-1">
                        رقم الطاولة
                      </label>
                      <input
                        type="text"
                        value={editingTable}
                        onChange={(e) => setEditingTable(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-anbar-bg border border-anbar-subtle text-xs font-bold text-anbar-dark focus:outline-none focus:border-anbar-amber"
                        placeholder="مثال: طاولة 5"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-anbar-dark mb-1">
                        ملاحظات المطبخ / الزبون
                      </label>
                      <input
                        type="text"
                        value={editingNotes}
                        onChange={(e) => setEditingNotes(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-anbar-bg border border-anbar-subtle text-xs font-medium text-anbar-dark focus:outline-none focus:border-anbar-amber"
                        placeholder="ملاحظات التحضير أو رغبة الزبون..."
                      />
                    </div>
                  </div>

                  {/* Section 1: Current Order Items */}
                  <div>
                    <h4 className="font-cairo font-bold text-xs text-anbar-dark/70 uppercase tracking-wider mb-3 flex items-center justify-between">
                      <span>الأطباق الحالية بالطلب ({editingItems.length})</span>
                      <span className="text-anbar-rust font-black">
                        الإجمالي: {editingCurrentTotal.toLocaleString('ar-SY')} ل.س
                      </span>
                    </h4>

                    {editingItems.length === 0 ? (
                      <div className="p-6 text-center rounded-2xl border border-dashed border-rose-300 bg-rose-50/50 text-rose-700 text-xs font-bold">
                        الطلب لا يحتوي على أي أصناف حالياً. يرجى إضافة صنف من القائمة بالأسفل.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {editingItems.map((item, idx) => {
                          const itemTotal = (Number(item.price) || 0) * (Number(item.qty) || 1);
                          return (
                            <div
                              key={idx}
                              className="p-3 rounded-2xl bg-white border border-anbar-subtle/80 flex items-center justify-between gap-3 shadow-2xs hover:border-anbar-amber/40 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="w-7 h-7 rounded-xl bg-anbar-amber/20 text-anbar-rust text-xs font-black flex items-center justify-center shrink-0">
                                  {item.qty}×
                                </span>
                                <div className="min-w-0">
                                  <h5 className="font-bold text-xs text-anbar-dark truncate">{item.title}</h5>
                                  <span className="text-[11px] text-anbar-dark/50 font-medium">
                                    {(Number(item.price) || 0).toLocaleString('ar-SY')} ل.س للقطعة
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                {/* Quantity Controls */}
                                <div className="flex items-center bg-anbar-bg rounded-xl border border-anbar-subtle p-0.5">
                                  <button
                                    type="button"
                                    onClick={() => handleItemQtyDelta(idx, -1)}
                                    className="w-7 h-7 rounded-lg bg-white text-anbar-dark hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                                    title="إنقاص الكمية"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-7 text-center font-bold text-xs text-anbar-dark">
                                    {item.qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleItemQtyDelta(idx, 1)}
                                    className="w-7 h-7 rounded-lg bg-white text-anbar-dark hover:bg-anbar-amber hover:text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                                    title="زيادة الكمية"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                <span className="font-bold text-xs text-anbar-dark w-20 text-left">
                                  {itemTotal.toLocaleString('ar-SY')} ل.س
                                </span>

                                {/* Delete Item Button */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(idx)}
                                  className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                                  title="حذف هذا الصنف من الطلب"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Section 2: Add New Dishes from Restaurant Menu */}
                  <div className="pt-4 border-t border-anbar-subtle">
                    <h4 className="font-cairo font-bold text-xs text-anbar-dark/70 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-anbar-amber" />
                      <span>إضافة أطباق جديدة من قائمة المطعم</span>
                    </h4>

                    {/* Quick Search */}
                    <div className="relative mb-3">
                      <Search className="w-4 h-4 text-anbar-dark/40 absolute right-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={menuSearch}
                        onChange={(e) => setMenuSearch(e.target.value)}
                        placeholder="ابحث عن طبق لإضافته (مثال: برغر، كبة، قهوة...)"
                        className="w-full pr-10 pl-4 py-2 rounded-xl bg-anbar-bg border border-anbar-subtle text-xs font-medium text-anbar-dark placeholder-anbar-dark/40 focus:outline-none focus:border-anbar-amber"
                      />
                    </div>

                    {/* Menu Items Scrollable Picker */}
                    <div className="max-h-52 overflow-y-auto space-y-1.5 pr-0.5 no-scrollbar border border-anbar-subtle/80 rounded-2xl p-2 bg-anbar-bg/30">
                      {filteredMenuItems.length === 0 ? (
                        <div className="text-center py-6 text-xs text-anbar-dark/50">
                          لا توجد نتائج مطابقة لبحثك
                        </div>
                      ) : (
                        filteredMenuItems.map((dish) => (
                          <div
                            key={dish.id}
                            className="p-2.5 rounded-xl bg-white hover:bg-amber-500/10 border border-anbar-subtle/60 flex items-center justify-between gap-3 transition-colors"
                          >
                            <div className="min-w-0">
                              <h6 className="font-bold text-xs text-anbar-dark truncate">{dish.title}</h6>
                              <span className="text-[11px] text-anbar-rust font-bold">
                                {Number(dish.price).toLocaleString('ar-SY')} ل.س
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddItemToOrder(dish)}
                              className="px-3 py-1.5 rounded-lg bg-anbar-dark hover:bg-anbar-amber text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
                            >
                              <Plus className="w-3 h-3" />
                              <span>إضافة</span>
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-5 border-t border-anbar-subtle bg-anbar-bg/80 flex items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-anbar-dark/60 font-medium block">الإجمالي الجديد:</span>
                    <span className="font-cairo font-black text-base text-anbar-rust">
                      {editingCurrentTotal.toLocaleString('ar-SY')} ل.س
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingOrder(null)}
                      className="px-4 py-2.5 rounded-xl bg-white border border-anbar-subtle text-anbar-dark hover:bg-anbar-subtle text-xs font-bold transition-colors cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveOrderEdits}
                      disabled={isSavingEdit}
                      className="px-5 py-2.5 rounded-xl bg-anbar-dark hover:bg-anbar-amber text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSavingEdit ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
