'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Utensils,
  Database,
  RefreshCw,
  ShoppingBag,
  Eye,
  EyeOff,
  Star,
  Layers,
  ArrowUp,
  ArrowDown,
  FolderTree,
  Check,
  MoveVertical,
  QrCode
} from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import TableQrManager from '@/components/TableQrManager';
import ToastNotification from '@/components/ToastNotification';
import { MenuItem, Category, Order } from '@/lib/types';
import { INITIAL_MENU_ITEMS, INITIAL_CATEGORIES } from '@/lib/initialData';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'categories' | 'qr'>('orders');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dish Modal State
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Partial<MenuItem> | null>(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  const isConfigured = isSupabaseConfigured();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Load All Data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [menuRes, catRes, ordersRes] = await Promise.all([
        fetch('/api/menu'),
        fetch('/api/categories?all=true'),
        fetch('/api/orders'),
      ]);

      if (menuRes.ok) {
        const menuData = await menuRes.json();
        if (menuData.data) {
          const sorted = [...menuData.data].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
          setMenuItems(sorted);
        }
      }

      if (catRes.ok) {
        const catData = await catRes.json();
        if (catData.data) {
          const sortedCats = [...catData.data].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
          setCategories(sortedCats);
        }
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (ordersData.data) setOrders(ordersData.data);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =========================================================================
  // ORDERS ACTIONS
  // =========================================================================
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
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
        showToast('تم تحديث حالة الطلب');
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  // =========================================================================
  // MENU ITEMS CRUD & RE-ORDERING
  // =========================================================================
  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish || !editingDish.title) return;

    try {
      const isNew = !editingDish.id;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch('/api/menu', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingDish),
      });

      const result = await res.json();

      if (res.ok) {
        showToast(isNew ? 'تمت إضافة الطبق بنجاح!' : 'تم تحديث بيانات الطبق!');
        setIsDishModalOpen(false);
        setEditingDish(null);
        loadData();
      } else {
        alert(result.error || 'حدث خطأ أثناء الحفظ');
      }
    } catch (err: any) {
      alert(err.message || 'فشل الحفظ');
    }
  };

  const handleDeleteDish = async (id: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا الطبق؟')) return;

    try {
      const res = await fetch(`/api/menu?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMenuItems((prev) => prev.filter((i) => i.id !== id));
        showToast('تم حذف الطبق من القائمة');
      } else {
        const data = await res.json();
        alert(data.error || 'فشل الحذف');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    const updated = { ...item, is_available: !item.is_available };
    try {
      const res = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        setMenuItems((prev) =>
          prev.map((i) => (i.id === item.id ? updated : i))
        );
        showToast(updated.is_available ? 'تم تفعيل توفر الطبق' : 'تم تعطيل توفر الطبق');
      }
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  // Re-order Dish Items (Move Up / Down)
  const handleMoveDish = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= menuItems.length) return;

    const newItems = [...menuItems];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Update sort_order for each item
    const updatedWithOrder = newItems.map((item, idx) => ({
      ...item,
      sort_order: idx + 1,
    }));

    setMenuItems(updatedWithOrder);

    // Persist to Backend
    try {
      await fetch('/api/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: updatedWithOrder.map((i) => ({ id: i.id, sort_order: i.sort_order })),
        }),
      });
      showToast('تم حفظ الترتيب الجديد للأطباق ↕️');
    } catch (err) {
      console.error('Failed to save reordered items:', err);
    }
  };

  // =========================================================================
  // CATEGORIES CRUD & RE-ORDERING
  // =========================================================================
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name_ar) return;

    try {
      const isNew = !editingCategory.slug || !categories.some(c => c.slug === editingCategory.slug);
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch('/api/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory),
      });

      const result = await res.json();

      if (res.ok) {
        showToast(isNew ? 'تمت إضافة الفئة بنجاح!' : 'تم تحديث الفئة!');
        setIsCategoryModalOpen(false);
        setEditingCategory(null);
        loadData();
      } else {
        alert(result.error || 'حدث خطأ أثناء حفظ الفئة');
      }
    } catch (err: any) {
      alert(err.message || 'فشل حفظ الفئة');
    }
  };

  const handleDeleteCategory = async (slug: string) => {
    if (slug === 'all') {
      alert('لا يمكن حذف الفئة العامة الافتراضية');
      return;
    }

    const dishesInCategory = menuItems.filter(i => i.category_slug === slug).length;
    if (dishesInCategory > 0) {
      if (!confirm(`تنبيه: يوجد ${dishesInCategory} أطباق مرتبطة بهذه الفئة. هل تريد حذف الفئة بالرغم من ذلك؟`)) {
        return;
      }
    } else {
      if (!confirm('هل أنت متأكد من رغبتك في حذف هذه الفئة؟')) return;
    }

    try {
      const res = await fetch(`/api/categories?slug=${slug}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.slug !== slug));
        showToast('تم حذف الفئة بنجاح');
      } else {
        const data = await res.json();
        alert(data.error || 'فشل حذف الفئة');
      }
    } catch (err) {
      console.error('Delete category error:', err);
    }
  };

  const handleToggleCategoryActive = async (cat: Category) => {
    if (cat.slug === 'all') return;
    const updated = { ...cat, is_active: !cat.is_active };

    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) => (c.slug === cat.slug ? updated : c))
        );
        showToast(updated.is_active ? 'تم تفعيل الفئة' : 'تم تعطيل الفئة');
      }
    } catch (err) {
      console.error('Toggle category error:', err);
    }
  };

  // Re-order Categories (Move Up / Down)
  const handleMoveCategory = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newCats = [...categories];
    const temp = newCats[index];
    newCats[index] = newCats[targetIndex];
    newCats[targetIndex] = temp;

    const updatedWithOrder = newCats.map((cat, idx) => ({
      ...cat,
      sort_order: idx + 1,
    }));

    setCategories(updatedWithOrder);

    // Persist to Backend
    try {
      await fetch('/api/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: updatedWithOrder.map((c) => ({ slug: c.slug, sort_order: c.sort_order })),
        }),
      });
      showToast('تم حفظ الترتيب الجديد للفئات ↕️');
    } catch (err) {
      console.error('Failed to save reordered categories:', err);
    }
  };

  // Open modal for creating new dish
  const openNewDishModal = () => {
    setEditingDish({
      title: '',
      category_slug: selectedCategoryFilter !== 'all' ? selectedCategoryFilter : 'mains',
      price: 35000,
      description: '',
      ingredients: '',
      pairing: '',
      image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80',
      badge: '',
      tags: [],
      is_available: true,
      is_featured: false,
      sort_order: menuItems.length + 1,
    });
    setIsDishModalOpen(true);
  };

  // Open modal for editing existing dish
  const openEditDishModal = (dish: MenuItem) => {
    setEditingDish({ ...dish });
    setIsDishModalOpen(true);
  };

  // Filtered menu items for admin table
  const displayedMenuItems = selectedCategoryFilter === 'all'
    ? menuItems
    : menuItems.filter(i => i.category_slug === selectedCategoryFilter);

  return (
    <div className="min-h-screen bg-anbar-bg text-anbar-dark">
      {/* Admin Header */}
      <header className="glass-nav border-b border-anbar-subtle sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="w-10 h-10 rounded-full bg-white border border-anbar-subtle flex items-center justify-center text-anbar-dark hover:bg-anbar-dark hover:text-white transition-colors"
              title="العودة للمطعم"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-cairo font-black text-xl text-anbar-dark flex items-center gap-2">
                <span>لوحة إدارة مطبخ عنبر</span>
                <span className="text-[10px] bg-anbar-amber text-anbar-dark font-black px-2.5 py-0.5 rounded-full">
                  ADMIN
                </span>
              </h1>
              <p className="text-xs text-anbar-dark/60 font-medium">متابعة الطلبات، إدارة وتنسيق الفئات، وإعادة ترتيب الأطباق والصور</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="px-4 py-2 rounded-full bg-white border border-anbar-subtle text-xs font-bold text-anbar-dark hover:border-anbar-amber transition-all flex items-center gap-2 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-anbar-amber' : ''}`} />
              <span>تحديث</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Supabase Status Banner */}
        <div className="mb-8 p-4 sm:p-5 rounded-3xl bg-white border border-anbar-subtle shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${isConfigured ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-anbar-dark flex items-center gap-2">
                <span>حالة قاعدة البيانات وسلة الصور Supabase:</span>
                <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${isConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {isConfigured ? 'متصل ومفعل سحابياً ✅' : 'وضع المعاينة المحلي (Local Mock Mode)'}
                </span>
              </h3>
              <p className="text-xs text-anbar-dark/60 mt-0.5 font-medium">
                {isConfigured
                  ? 'يتم مزامنة الفئات والأطباق وإعادة الترتيب ورفع الصور مباشرة إلى مشروع Supabase.'
                  : 'لتفعيل التخزين السحابي الدائم، أضف مفاتيح Supabase إلى .env.local وشغّل schema.sql.'}
              </p>
            </div>
          </div>
        </div>

        {/* 3 Tab Navigation: Orders | Menu Items | Categories */}
        <div className="flex items-center gap-3 mb-8 border-b border-anbar-subtle pb-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'orders'
                ? 'bg-anbar-dark text-white shadow-md'
                : 'bg-white text-anbar-dark/70 border border-anbar-subtle hover:text-anbar-dark'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-anbar-amber" />
            <span>طلبات الطاولات الحية ({orders.length.toLocaleString('ar-SY')})</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'menu'
                ? 'bg-anbar-dark text-white shadow-md'
                : 'bg-white text-anbar-dark/70 border border-anbar-subtle hover:text-anbar-dark'
            }`}
          >
            <Layers className="w-4 h-4 text-anbar-amber" />
            <span>الأطباق وإعادة الترتيب ({menuItems.length.toLocaleString('ar-SY')})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'categories'
                ? 'bg-anbar-dark text-white shadow-md'
                : 'bg-white text-anbar-dark/70 border border-anbar-subtle hover:text-anbar-dark'
            }`}
          >
            <FolderTree className="w-4 h-4 text-anbar-amber" />
            <span>إدارة الفئات وترتيبها ({categories.length.toLocaleString('ar-SY')})</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'qr'
                ? 'bg-anbar-dark text-white shadow-md'
                : 'bg-white text-anbar-dark/70 border border-anbar-subtle hover:text-anbar-dark'
            }`}
          >
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>رموز QR للطاولات والطباعة 📱</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ORDERS TAB */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-anbar-subtle">
                <Clock className="w-12 h-12 mx-auto text-anbar-slate/40 mb-3" />
                <h3 className="font-bold text-lg text-anbar-dark">لا توجد طلبات جديدة حالياً</h3>
                <p className="text-xs text-anbar-dark/60 mt-1 font-medium">ستظهر الطلبات التي يقوم زوار المطعم بإرسالها هنا فوراً.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order, idx) => (
                  <div
                    key={order.id || idx}
                    className="bg-white rounded-3xl border border-anbar-subtle p-5 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-anbar-subtle">
                        <div>
                          <span className="text-xs font-bold text-anbar-amber block">
                            {order.table_number || 'طاولة عامة'}
                          </span>
                          <span className="text-[11px] text-anbar-dark/50 font-medium">
                            {order.created_at ? new Date(order.created_at).toLocaleTimeString('ar-SY') : 'الآن'}
                          </span>
                        </div>

                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id!, e.target.value as any)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full border border-anbar-subtle focus:outline-none ${
                            order.status === 'new'
                              ? 'bg-amber-100 text-amber-800'
                              : order.status === 'preparing'
                              ? 'bg-sky-100 text-sky-800'
                              : order.status === 'served'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-800'
                          }`}
                        >
                          <option value="new">طلب جديد 🟡</option>
                          <option value="preparing">قيد التحضير 🔵</option>
                          <option value="served">تم التقديم 🟢</option>
                          <option value="completed">مكتمل ✅</option>
                          <option value="cancelled">ملغي ❌</option>
                        </select>
                      </div>

                      {/* Order Items List */}
                      <div className="space-y-2 mb-4">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex justify-between items-center text-xs py-1 border-b border-anbar-subtle/50">
                            <span className="font-bold text-anbar-dark">
                              {item.title} <span className="text-anbar-amber">x{item.qty}</span>
                            </span>
                            <span className="font-semibold text-anbar-dark/70">
                              {(item.price * item.qty).toLocaleString('ar-SY')} ل.س
                            </span>
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <div className="p-2.5 rounded-xl bg-anbar-bg text-[11px] font-medium text-anbar-dark/70 mb-4 border border-anbar-subtle">
                          <span className="font-bold text-anbar-dark block mb-0.5">ملاحظات:</span>
                          {order.notes}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-anbar-subtle flex justify-between items-center">
                      <span className="text-xs font-bold text-anbar-dark/70">الإجمالي:</span>
                      <span className="text-base font-black text-anbar-rust">
                        {order.total?.toLocaleString('ar-SY')} ل.س
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MENU ITEMS TAB (WITH RE-ORDERING ⬆️ ⬇️) */}
        {/* ========================================================================= */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-anbar-dark">إدارة وترتيب أطباق القائمة</h3>
                <p className="text-xs text-anbar-dark/60 font-medium">
                  استخدم أسهم (⬆️ / ⬇️) لإعادة ترتيب موضع ظهور الأطباق فوراً، أو عدّل الأسعار والصور.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Filter By Category in Table */}
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-full bg-white border border-anbar-subtle text-xs font-bold text-anbar-dark focus:outline-none focus:border-anbar-amber"
                >
                  <option value="all">جميع الفئات</option>
                  {categories.filter(c => c.slug !== 'all').map(c => (
                    <option key={c.slug} value={c.slug}>{c.name_ar}</option>
                  ))}
                </select>

                <button
                  onClick={openNewDishModal}
                  className="px-5 py-2.5 rounded-full bg-anbar-dark text-white text-xs font-bold hover:bg-anbar-rust transition-all flex items-center gap-2 shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4 text-anbar-amber" />
                  <span>إضافة طبق جديد</span>
                </button>
              </div>
            </div>

            {/* Menu Items Table */}
            <div className="bg-white rounded-3xl border border-anbar-subtle shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-anbar-bg text-anbar-dark/70 font-bold border-b border-anbar-subtle">
                    <tr>
                      <th className="p-4 w-16 text-center">الترتيب</th>
                      <th className="p-4">الطبق</th>
                      <th className="p-4">الفئة</th>
                      <th className="p-4">السعر</th>
                      <th className="p-4">الشارة</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-anbar-subtle font-medium">
                    {displayedMenuItems.map((item, index) => (
                      <tr key={item.id} className="hover:bg-anbar-bg/50 transition-colors">
                        {/* Sort Re-order Steppers */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleMoveDish(index, 'up')}
                              disabled={index === 0}
                              className="w-7 h-7 rounded-lg bg-anbar-bg hover:bg-anbar-amber hover:text-white flex items-center justify-center text-anbar-dark/70 disabled:opacity-30 disabled:hover:bg-anbar-bg disabled:hover:text-anbar-dark/70 transition-colors shadow-2xs"
                              title="تحريك لأعلى"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleMoveDish(index, 'down')}
                              disabled={index === displayedMenuItems.length - 1}
                              className="w-7 h-7 rounded-lg bg-anbar-bg hover:bg-anbar-amber hover:text-white flex items-center justify-center text-anbar-dark/70 disabled:opacity-30 disabled:hover:bg-anbar-bg disabled:hover:text-anbar-dark/70 transition-colors shadow-2xs"
                              title="تحريك لأسفل"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-anbar-bg border border-anbar-subtle shrink-0">
                              <Image
                                src={item.image_url}
                                alt={item.title}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-anbar-dark">{item.title}</h4>
                              <p className="text-[11px] text-anbar-dark/50 line-clamp-1 max-w-xs">{item.description}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-anbar-bg border border-anbar-subtle text-[11px] font-bold text-anbar-dark">
                            {categories.find((c) => c.slug === item.category_slug)?.name_ar || item.category_slug}
                          </span>
                        </td>

                        <td className="p-4 font-black text-sm text-anbar-dark whitespace-nowrap">
                          {item.price.toLocaleString('ar-SY')} ل.س
                        </td>

                        <td className="p-4">
                          {item.badge ? (
                            <span className="px-2.5 py-1 rounded-full bg-anbar-amber/15 text-anbar-amber text-[10px] font-black">
                              {item.badge}
                            </span>
                          ) : (
                            <span className="text-anbar-dark/30">—</span>
                          )}
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => handleToggleAvailability(item)}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                              item.is_available
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.is_available ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <span>{item.is_available ? 'متوفر' : 'غير متوفر'}</span>
                          </button>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditDishModal(item)}
                              className="w-8 h-8 rounded-xl bg-white border border-anbar-subtle flex items-center justify-center text-anbar-dark hover:bg-anbar-dark hover:text-white transition-colors"
                              title="تعديل الطبق والصورة"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDish(item.id)}
                              className="w-8 h-8 rounded-xl bg-white border border-anbar-subtle flex items-center justify-center text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CATEGORIES CRUD & RE-ORDERING TAB */}
        {/* ========================================================================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-anbar-dark">إدارة وترتيب فئات القائمة</h3>
                <p className="text-xs text-anbar-dark/60 font-medium">
                  يمكنك إضافة فئات جديدة، إعادة ترتيبها (⬆️ / ⬇️)، أو تعديل أسمائها لظهورها في القائمة.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingCategory({
                    name_ar: '',
                    name_en: '',
                    slug: '',
                    sort_order: categories.length + 1,
                    is_active: true,
                  });
                  setIsCategoryModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-full bg-anbar-dark text-white text-xs font-bold hover:bg-anbar-rust transition-all flex items-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4 text-anbar-amber" />
                <span>إضافة فئة جديدة</span>
              </button>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-3xl border border-anbar-subtle shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-anbar-bg text-anbar-dark/70 font-bold border-b border-anbar-subtle">
                    <tr>
                      <th className="p-4 w-16 text-center">الترتيب</th>
                      <th className="p-4">اسم الفئة بالعربية</th>
                      <th className="p-4">الاسم بالإنجليزية</th>
                      <th className="p-4">المعرف (Slug)</th>
                      <th className="p-4">عدد الأطباق</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-anbar-subtle font-medium">
                    {categories.map((cat, index) => {
                      const count = menuItems.filter(i => i.category_slug === cat.slug).length;
                      return (
                        <tr key={cat.slug} className="hover:bg-anbar-bg/50 transition-colors">
                          {/* Re-order Steppers */}
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleMoveCategory(index, 'up')}
                                disabled={index === 0}
                                className="w-7 h-7 rounded-lg bg-anbar-bg hover:bg-anbar-amber hover:text-white flex items-center justify-center text-anbar-dark/70 disabled:opacity-30 disabled:hover:bg-anbar-bg disabled:hover:text-anbar-dark/70 transition-colors shadow-2xs"
                                title="تحريك لأعلى"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMoveCategory(index, 'down')}
                                disabled={index === categories.length - 1}
                                className="w-7 h-7 rounded-lg bg-anbar-bg hover:bg-anbar-amber hover:text-white flex items-center justify-center text-anbar-dark/70 disabled:opacity-30 disabled:hover:bg-anbar-bg disabled:hover:text-anbar-dark/70 transition-colors shadow-2xs"
                                title="تحريك لأسفل"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                          <td className="p-4 font-bold text-sm text-anbar-dark">
                            {cat.name_ar}
                          </td>

                          <td className="p-4 text-anbar-dark/60">
                            {cat.name_en || '—'}
                          </td>

                          <td className="p-4">
                            <code className="px-2 py-1 rounded bg-anbar-bg text-[11px] font-mono text-anbar-dark/80">
                              {cat.slug}
                            </code>
                          </td>

                          <td className="p-4">
                            <span className="px-3 py-1 rounded-full bg-anbar-bg border border-anbar-subtle text-[11px] font-bold text-anbar-dark">
                              {count.toLocaleString('ar-SY')} أطباق
                            </span>
                          </td>

                          <td className="p-4">
                            <button
                              onClick={() => handleToggleCategoryActive(cat)}
                              disabled={cat.slug === 'all'}
                              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                                cat.is_active
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              } disabled:opacity-50`}
                            >
                              {cat.is_active ? <Check className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              <span>{cat.is_active ? 'نشطة' : 'معطلة'}</span>
                            </button>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingCategory({ ...cat });
                                  setIsCategoryModalOpen(true);
                                }}
                                className="w-8 h-8 rounded-xl bg-white border border-anbar-subtle flex items-center justify-center text-anbar-dark hover:bg-anbar-dark hover:text-white transition-colors"
                                title="تعديل الفئة"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              {cat.slug !== 'all' && (
                                <button
                                  onClick={() => handleDeleteCategory(cat.slug)}
                                  className="w-8 h-8 rounded-xl bg-white border border-anbar-subtle flex items-center justify-center text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                                  title="حذف الفئة"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: TABLE QR CODE GENERATOR & PRINTING TAB */}
        {/* ========================================================================= */}
        {activeTab === 'qr' && (
          <TableQrManager />
        )}
      </main>

      {/* ========================================================================= */}
      {/* DISH CREATE / EDIT MODAL */}
      {/* ========================================================================= */}
      {isDishModalOpen && editingDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsDishModalOpen(false)}
            className="absolute inset-0 bg-anbar-dark/50 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-anbar-subtle shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <h3 className="font-cairo font-black text-xl text-anbar-dark mb-6">
              {editingDish.id ? 'تعديل بيانات الطبق وصورته' : 'إضافة طبق جديد إلى القائمة'}
            </h3>

            <form onSubmit={handleSaveDish} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-anbar-dark/75 mb-1">عنوان الطبق:</label>
                  <input
                    type="text"
                    required
                    value={editingDish.title || ''}
                    onChange={(e) => setEditingDish({ ...editingDish, title: e.target.value })}
                    placeholder="مثال: ريب آي ببهارات عنبر"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-anbar-subtle text-xs bg-anbar-bg focus:outline-none focus:border-anbar-amber font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-anbar-dark/75 mb-1">الفئة:</label>
                  <select
                    value={editingDish.category_slug || 'mains'}
                    onChange={(e) => setEditingDish({ ...editingDish, category_slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-anbar-subtle text-xs bg-anbar-bg focus:outline-none focus:border-anbar-amber font-semibold"
                  >
                    {categories.filter(c => c.slug !== 'all').map(c => (
                      <option key={c.slug} value={c.slug}>{c.name_ar}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-anbar-dark/75 mb-1">السعر بالليرة السورية (ل.س):</label>
                  <input
                    type="number"
                    required
                    value={editingDish.price || ''}
                    onChange={(e) => setEditingDish({ ...editingDish, price: Number(e.target.value) })}
                    placeholder="مثال: 45000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-anbar-subtle text-xs bg-anbar-bg focus:outline-none focus:border-anbar-amber font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-anbar-dark/75 mb-1">شارة التمييز (اختياري):</label>
                  <input
                    type="text"
                    value={editingDish.badge || ''}
                    onChange={(e) => setEditingDish({ ...editingDish, badge: e.target.value })}
                    placeholder="مثال: طبق توقيع، الأكثر طلباً، حلو"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-anbar-subtle text-xs bg-anbar-bg focus:outline-none focus:border-anbar-amber font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-anbar-dark/75 mb-1">وصف الطبق:</label>
                <textarea
                  rows={2}
                  required
                  value={editingDish.description || ''}
                  onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                  placeholder="وصف جذاب للمكونات والمذاق..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-anbar-subtle text-xs bg-anbar-bg focus:outline-none focus:border-anbar-amber font-medium"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-anbar-dark/75 mb-1">المكونات التفصيلية:</label>
                  <input
                    type="text"
                    value={editingDish.ingredients || ''}
                    onChange={(e) => setEditingDish({ ...editingDish, ingredients: e.target.value })}
                    placeholder="مكونات الطبق الرئيسية..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-anbar-subtle text-xs bg-anbar-bg focus:outline-none focus:border-anbar-amber font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-anbar-dark/75 mb-1">المشروب المقترح للتقديم:</label>
                  <input
                    type="text"
                    value={editingDish.pairing || ''}
                    onChange={(e) => setEditingDish({ ...editingDish, pairing: e.target.value })}
                    placeholder="مثال: موكتيل الورد والليمون الفوار"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-anbar-subtle text-xs bg-anbar-bg focus:outline-none focus:border-anbar-amber font-medium"
                  />
                </div>
              </div>

              {/* SUPABASE BUCKET IMAGE UPLOADER INTEGRATION */}
              <div className="p-4 rounded-2xl bg-anbar-bg border border-anbar-subtle">
                <ImageUploader
                  currentImageUrl={editingDish.image_url || ''}
                  onImageUploaded={(url) => setEditingDish({ ...editingDish, image_url: url })}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-anbar-subtle">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-anbar-dark text-white font-bold text-xs hover:bg-anbar-rust transition-all shadow-md"
                >
                  حفظ البيانات والطبق
                </button>
                <button
                  type="button"
                  onClick={() => setIsDishModalOpen(false)}
                  className="px-6 py-3 rounded-xl border border-anbar-subtle text-anbar-dark/70 font-bold text-xs hover:text-anbar-dark transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY CREATE / EDIT MODAL */}
      {/* ========================================================================= */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsCategoryModalOpen(false)}
            className="absolute inset-0 bg-anbar-dark/50 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-anbar-subtle shadow-2xl p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95">
            <h3 className="font-cairo font-black text-xl text-anbar-dark mb-6">
              {editingCategory.slug && categories.some(c => c.slug === editingCategory.slug)
                ? 'تعديل الفئة'
                : 'إضافة فئة جديدة للقائمة'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-anbar-dark/75 mb-1">اسم الفئة بالعربية:</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name_ar || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name_ar: e.target.value })}
                  placeholder="مثال: ركن الشواء واللحوم"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-anbar-subtle text-xs bg-anbar-bg focus:outline-none focus:border-anbar-amber font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-anbar-dark/75 mb-1">الاسم بالإنجليزية (اختياري):</label>
                <input
                  type="text"
                  value={editingCategory.name_en || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name_en: e.target.value })}
                  placeholder="Example: Grill & Hearth"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-anbar-subtle text-xs bg-anbar-bg focus:outline-none focus:border-anbar-amber font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-anbar-dark/75 mb-1">معرف الفئة الإنجليزي (Slug):</label>
                <input
                  type="text"
                  required
                  value={editingCategory.slug || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="مثال: grill-specials"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-anbar-subtle text-xs bg-anbar-bg focus:outline-none focus:border-anbar-amber font-mono text-xs"
                />
                <p className="text-[10px] text-anbar-dark/50 mt-1">يُستخدم لربط الأطباق بهذه الفئة في قاعدة البيانات.</p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="catActiveCheckbox"
                  checked={editingCategory.is_active ?? true}
                  onChange={(e) => setEditingCategory({ ...editingCategory, is_active: e.target.checked })}
                  className="w-4 h-4 text-anbar-amber rounded border-anbar-subtle focus:ring-anbar-amber"
                />
                <label htmlFor="catActiveCheckbox" className="text-xs font-bold text-anbar-dark cursor-pointer">
                  تفعيل هذه الفئة وإظهارها للزبائن في الموقع
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-anbar-subtle">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-anbar-dark text-white font-bold text-xs hover:bg-anbar-rust transition-all shadow-md"
                >
                  حفظ الفئة
                </button>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-6 py-3 rounded-xl border border-anbar-subtle text-anbar-dark/70 font-bold text-xs hover:text-anbar-dark transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastNotification message={toastMessage} />
    </div>
  );
}
