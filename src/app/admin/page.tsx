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
  QrCode,
  Lock,
  Unlock,
  KeyRound,
  ShieldAlert,
  LogOut,
  Mail,
  ExternalLink,
  ShieldCheck,
  ChefHat,
  GripVertical
} from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import TableQrManager from '@/components/TableQrManager';
import ToastNotification from '@/components/ToastNotification';
import AmbientBlobs from '@/components/AmbientBlobs';
import { MenuItem, Category, Order } from '@/lib/types';
import { INITIAL_MENU_ITEMS, INITIAL_CATEGORIES } from '@/lib/initialData';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabaseClient';

export default function AdminDashboardPage() {
  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('admin@anbar.com');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'menu' | 'categories' | 'qr' | 'settings'>('menu');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Drag & Drop State
  const [draggedDishId, setDraggedDishId] = useState<string | null>(null);
  const [dragOverDishId, setDragOverDishId] = useState<string | null>(null);
  const [draggedCategorySlug, setDraggedCategorySlug] = useState<string | null>(null);
  const [dragOverCategorySlug, setDragOverCategorySlug] = useState<string | null>(null);

  // Security / PIN Setting State
  const [kitchenPin, setKitchenPin] = useState<string>('1234');
  const [newPinInput, setNewPinInput] = useState<string>('');
  const [isSavingPin, setIsSavingPin] = useState<boolean>(false);

  // Dish Modal State
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Partial<MenuItem> | null>(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Check admin session
  useEffect(() => {
    const session = sessionStorage.getItem('anbar_admin_auth');
    if (session === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  // Fetch Settings (PIN code)
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings?key=kitchen_pin');
      if (res.ok) {
        const data = await res.json();
        if (data.value) {
          setKitchenPin(String(data.value));
          setNewPinInput(String(data.value));
        }
      }
    } catch (e) {
      console.error('Failed to fetch settings:', e);
    }
  };

  // Load All Menu & Category Data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [menuRes, catRes] = await Promise.all([
        fetch('/api/menu'),
        fetch('/api/categories?all=true'),
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
      fetchSettings();
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadData();
    }
  }, [isAdminLoggedIn]);

  // Handle Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError(null);

    try {
      const supabase = getSupabaseClient();
      let loggedIn = false;

      // Try Supabase Auth if configured
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: adminEmail,
            password: adminPassword,
          });
          if (data?.session && !error) {
            loggedIn = true;
          }
        } catch (supabaseErr) {
          console.warn('Supabase auth attempt:', supabaseErr);
        }
      }

      // Default Admin Fallback Credentials for immediate easy access
      if (!loggedIn) {
        if (
          (adminEmail.toLowerCase() === 'admin@anbar.com' || adminEmail.toLowerCase() === 'admin') &&
          (adminPassword === 'admin1234' || adminPassword === '123456' || adminPassword === 'anbar2026' || adminPassword === 'admin')
        ) {
          loggedIn = true;
        }
      }

      if (loggedIn) {
        setIsAdminLoggedIn(true);
        sessionStorage.setItem('anbar_admin_auth', 'true');
        showToast('تم تسجيل الدخول بنجاح! أهلاً بك في لوحة الإدارة');
      } else {
        setAuthError('البريد الإلكتروني أو كلمة المرور غير صحيحة. (الافتراضي: admin@anbar.com / admin1234)');
      }
    } catch (err: any) {
      setAuthError(err.message || 'فشل تسجيل الدخول');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('anbar_admin_auth');
    setIsAdminLoggedIn(false);
    setAdminPassword('');
    showToast('تم تسجيل الخروج 🔒');
  };

  // Save New Kitchen PIN
  const handleSaveKitchenPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPinInput || newPinInput.length < 4) {
      alert('رمز PIN يجب أن يتكون من 4 أرقام على الأقل');
      return;
    }

    setIsSavingPin(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'kitchen_pin', value: newPinInput }),
      });

      if (res.ok) {
        setKitchenPin(newPinInput);
        showToast('تم تحديث رمز PIN الخاص بشاشة الطلبات بنجاح! 🔒');
      } else {
        alert('حدث خطأ أثناء الحفظ');
      }
    } catch (e: any) {
      alert(e.message || 'فشل حفظ الرمز');
    } finally {
      setIsSavingPin(false);
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
        showToast(updated.is_available ? 'الطبق متاح للطلب الآن' : 'تم إخفاء الطبق (غير متوفر)');
      }
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const handleMoveDish = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= menuItems.length) return;

    const newItems = [...menuItems];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    const updatedWithOrder = newItems.map((item, idx) => ({
      ...item,
      sort_order: idx + 1,
    }));

    setMenuItems(updatedWithOrder);

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

  // Drag & Drop Drop Handler for Dishes
  const handleDropDish = async (targetDishId: string) => {
    if (!draggedDishId || draggedDishId === targetDishId) {
      setDraggedDishId(null);
      setDragOverDishId(null);
      return;
    }

    const currentItems = [...menuItems];
    const sourceIndex = currentItems.findIndex((i) => i.id === draggedDishId);
    const targetIndex = currentItems.findIndex((i) => i.id === targetDishId);

    if (sourceIndex === -1 || targetIndex === -1) {
      setDraggedDishId(null);
      setDragOverDishId(null);
      return;
    }

    const [movedItem] = currentItems.splice(sourceIndex, 1);
    currentItems.splice(targetIndex, 0, movedItem);

    const updatedWithOrder = currentItems.map((item, idx) => ({
      ...item,
      sort_order: idx + 1,
    }));

    setMenuItems(updatedWithOrder);
    setDraggedDishId(null);
    setDragOverDishId(null);

    try {
      await fetch('/api/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: updatedWithOrder.map((i) => ({ id: i.id, sort_order: i.sort_order })),
        }),
      });
      showToast(`تم تغيير ترتيب "${movedItem.title}" بالإفلات ↕️`);
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
      const isNew = !editingCategory.id && !categories.some(c => c.slug === editingCategory.slug);
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch('/api/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory),
      });

      const result = await res.json();

      if (res.ok) {
        showToast(isNew ? 'تمت إضافة الفئة بنجاح!' : 'تم تحديث الفئة بنجاح!');
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
      alert('لا يمكن حذف فئة جميع الأصناف الأساسية');
      return;
    }

    const itemsCountInCat = menuItems.filter(i => i.category_slug === slug).length;
    if (itemsCountInCat > 0) {
      if (!confirm(`تحتوي هذه الفئة على ${itemsCountInCat} طبق. هل أنت متأكد من حذف الفئة؟`)) return;
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

  // Drag & Drop Drop Handler for Categories
  const handleDropCategory = async (targetCategorySlug: string) => {
    if (!draggedCategorySlug || draggedCategorySlug === targetCategorySlug) {
      setDraggedCategorySlug(null);
      setDragOverCategorySlug(null);
      return;
    }

    const currentCats = [...categories];
    const sourceIndex = currentCats.findIndex((c) => c.slug === draggedCategorySlug);
    const targetIndex = currentCats.findIndex((c) => c.slug === targetCategorySlug);

    if (sourceIndex === -1 || targetIndex === -1) {
      setDraggedCategorySlug(null);
      setDragOverCategorySlug(null);
      return;
    }

    const [movedCat] = currentCats.splice(sourceIndex, 1);
    currentCats.splice(targetIndex, 0, movedCat);

    const updatedWithOrder = currentCats.map((cat, idx) => ({
      ...cat,
      sort_order: idx + 1,
    }));

    setCategories(updatedWithOrder);
    setDraggedCategorySlug(null);
    setDragOverCategorySlug(null);

    try {
      await fetch('/api/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: updatedWithOrder.map((c) => ({ slug: c.slug, sort_order: c.sort_order })),
        }),
      });
      showToast(`تم تغيير ترتيب فئة "${movedCat.name_ar}" بالإفلات ↕️`);
    } catch (err) {
      console.error('Failed to save reordered categories:', err);
    }
  };

  const openNewDishModal = () => {
    setEditingDish({
      title: '',
      category_slug: selectedCategoryFilter !== 'all' ? selectedCategoryFilter : 'hot-drinks',
      price: 300,
      description: '',
      ingredients: '',
      pairing: '',
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80',
      badge: '',
      tags: [],
      is_available: true,
      is_featured: false,
    });
    setIsDishModalOpen(true);
  };

  const openNewCategoryModal = () => {
    setEditingCategory({
      name_ar: '',
      name_en: '',
      slug: '',
      sort_order: categories.length + 1,
      is_active: true,
    });
    setIsCategoryModalOpen(true);
  };

  const displayedMenuItems = selectedCategoryFilter === 'all'
    ? menuItems
    : menuItems.filter(i => i.category_slug === selectedCategoryFilter);

  return (
    <div className="min-h-screen bg-anbar-bg text-anbar-dark relative overflow-x-hidden">
      <AmbientBlobs />
      <ToastNotification message={toastMessage} />

      {/* ========================================================================= */}
      {/* 1. ADMIN SIGN-IN SCREEN (EMAIL & PASSWORD) */}
      {/* ========================================================================= */}
      {!isAdminLoggedIn ? (
        <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-4xl border border-anbar-subtle p-6 sm:p-8 shadow-soft animate-fade-in">
            <div className="flex justify-center mb-4">
              <Image
                src="/Anbar Logo.svg"
                alt="عنبر"
                width={120}
                height={48}
                className="h-11 w-auto object-contain drop-shadow-xs"
                priority
              />
            </div>

            <div className="text-center mb-6">
              <h1 className="font-cairo font-black text-2xl text-anbar-dark">
                تسجيل دخول الإدارة
              </h1>
              <p className="text-xs text-anbar-dark/60 mt-1 font-semibold">
                لوحة تحكم مطعم عنبر لإدارة الأطباق، الفئات، والرموز
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-anbar-dark mb-1.5">
                  البريد الإلكتروني للإدارة
                </label>
                <div className="relative">
                  <Mail className="absolute right-3.5 top-3 w-4 h-4 text-anbar-dark/40" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@anbar.com"
                    className="w-full pr-10 pl-4 py-2.5 bg-anbar-bg border border-anbar-subtle rounded-2xl text-xs font-bold focus:outline-none focus:border-anbar-amber"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-anbar-dark mb-1.5">
                  كلمة المرور
                </label>
                <div className="relative">
                  <KeyRound className="absolute right-3.5 top-3 w-4 h-4 text-anbar-dark/40" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-10 pl-4 py-2.5 bg-anbar-bg border border-anbar-subtle rounded-2xl text-xs font-bold focus:outline-none focus:border-anbar-amber"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 rounded-2xl bg-anbar-dark text-white font-bold text-xs hover:bg-anbar-rust transition-all shadow-md mt-2 flex items-center justify-center gap-2"
              >
                {isLoggingIn ? <RefreshCw className="w-4 h-4 animate-spin text-anbar-amber" /> : <ShieldCheck className="w-4 h-4 text-anbar-amber" />}
                <span>تسجيل الدخول إلى لوحة التحكم</span>
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-anbar-subtle flex items-center justify-between text-xs text-anbar-dark/60 font-bold">
              <Link href="/" className="hover:text-anbar-amber transition-colors flex items-center gap-1">
                <span>← عودة لقائمة المطعم</span>
              </Link>
              <Link href="/orders" className="hover:text-anbar-amber transition-colors flex items-center gap-1 text-anbar-rust font-black">
                <span>شاشة الطلبات الحية 👨‍🍳</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. ADMIN DASHBOARD HEADER & CONTENT */
        /* ========================================================================= */
        <>
          <header className="glass-nav border-b border-anbar-subtle sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
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
                    لوحة إدارة مطبخ عنبر
                  </h1>
                  <p className="text-[11px] text-anbar-dark/60 font-medium">إدارة وتنسيق الفئات، إعادة ترتيب الأطباق، وإعدادات الحماية</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Live Orders Dedicated Link */}
                <Link
                  href="/orders"
                  className="px-4 py-2 rounded-full bg-anbar-amber/20 border border-anbar-amber/40 text-xs font-black text-anbar-rust hover:bg-anbar-amber hover:text-white transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <ChefHat className="w-4 h-4" />
                  <span>شاشة الطلبات الحية</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <button
                  onClick={loadData}
                  disabled={isLoading}
                  className="px-3.5 py-2 rounded-full bg-white border border-anbar-subtle text-xs font-bold text-anbar-dark hover:border-anbar-amber transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-anbar-amber' : ''}`} />
                  <span className="hidden sm:inline">تحديث</span>
                </button>

                <button
                  onClick={handleAdminLogout}
                  className="px-3.5 py-2 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center gap-1.5 shadow-xs"
                  title="تسجيل الخروج من الإدارة"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden sm:inline">خروج</span>
                </button>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
            {/* Tab Navigation: Menu Items | Categories | QR Generator | Security PIN Settings */}
            <div className="flex items-center gap-3 mb-8 border-b border-anbar-subtle pb-4 overflow-x-auto no-scrollbar">
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
                <QrCode className="w-4 h-4 text-anbar-amber" />
                <span>توليد باركود QR للطاولات</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'settings'
                    ? 'bg-anbar-dark text-white shadow-md'
                    : 'bg-white text-anbar-dark/70 border border-anbar-subtle hover:text-anbar-dark'
                }`}
              >
                <KeyRound className="w-4 h-4 text-anbar-amber" />
                <span>إعدادات الحماية ورمز PIN</span>
              </button>
            </div>

            {/* ========================================================================= */}
            {/* TAB 1: MENU ITEMS & REORDERING */}
            {/* ========================================================================= */}
            {activeTab === 'menu' && (
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 no-scrollbar">
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => setSelectedCategoryFilter(cat.slug)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                          selectedCategoryFilter === cat.slug
                            ? 'bg-anbar-dark text-white shadow-xs'
                            : 'bg-white text-anbar-dark/70 border border-anbar-subtle hover:text-anbar-dark'
                        }`}
                      >
                        {cat.name_ar}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={openNewDishModal}
                    className="px-5 py-2.5 rounded-full bg-anbar-rust text-white font-bold text-xs hover:bg-anbar-dark transition-all flex items-center gap-2 shadow-md shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة طبق جديد</span>
                  </button>
                </div>

                <div className="bg-white rounded-3xl border border-anbar-subtle shadow-soft overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-anbar-bg/60 border-b border-anbar-subtle text-anbar-dark/60 font-bold uppercase">
                        <tr>
                          <th className="py-3.5 px-4">ترتيب</th>
                          <th className="py-3.5 px-4">الطبق</th>
                          <th className="py-3.5 px-4">الفئة</th>
                          <th className="py-3.5 px-4">السعر</th>
                          <th className="py-3.5 px-4">الحالة</th>
                          <th className="py-3.5 px-4 text-center">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-anbar-subtle/50">
                        {displayedMenuItems.map((dish, idx) => (
                          <tr
                            key={dish.id}
                            draggable
                            onDragStart={(e) => {
                              setDraggedDishId(dish.id);
                              e.dataTransfer.setData('text/plain', dish.id);
                              e.dataTransfer.effectAllowed = 'move';
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = 'move';
                              if (dragOverDishId !== dish.id) {
                                setDragOverDishId(dish.id);
                              }
                            }}
                            onDragLeave={() => {
                              if (dragOverDishId === dish.id) {
                                setDragOverDishId(null);
                              }
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              handleDropDish(dish.id);
                            }}
                            onDragEnd={() => {
                              setDraggedDishId(null);
                              setDragOverDishId(null);
                            }}
                            className={`transition-all duration-150 ${
                              draggedDishId === dish.id
                                ? 'opacity-35 bg-anbar-amber/20 scale-[0.99] border-2 border-dashed border-anbar-amber shadow-inner'
                                : dragOverDishId === dish.id
                                ? 'border-t-4 border-t-anbar-amber bg-anbar-amber/15 shadow-md'
                                : 'hover:bg-anbar-bg/40'
                            }`}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5">
                                <div
                                  className="w-7 h-7 rounded-lg bg-anbar-bg/90 hover:bg-anbar-amber hover:text-white flex items-center justify-center cursor-grab active:cursor-grabbing text-anbar-dark/60 transition-colors shadow-2xs"
                                  title="اسحب وأفلت لإعادة ترتيب الطبق (Drag & Drop)"
                                >
                                  <GripVertical className="w-4 h-4" />
                                </div>
                                <button
                                  onClick={() => handleMoveDish(idx, 'up')}
                                  disabled={idx === 0}
                                  className="w-6 h-6 rounded bg-anbar-bg hover:bg-anbar-amber hover:text-white flex items-center justify-center disabled:opacity-30 disabled:hover:bg-anbar-bg disabled:hover:text-inherit"
                                  title="تحريك لأعلى"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleMoveDish(idx, 'down')}
                                  disabled={idx === displayedMenuItems.length - 1}
                                  className="w-6 h-6 rounded bg-anbar-bg hover:bg-anbar-amber hover:text-white flex items-center justify-center disabled:opacity-30 disabled:hover:bg-anbar-bg disabled:hover:text-inherit"
                                  title="تحريك لأسفل"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                                <span className="text-[10px] text-anbar-dark/40 font-mono w-4 text-center">
                                  {dish.sort_order ?? idx + 1}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl overflow-hidden relative shrink-0 border border-anbar-subtle">
                                  <Image
                                    src={dish.image_url || '/placeholder.png'}
                                    alt={dish.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-bold text-anbar-dark flex items-center gap-1.5">
                                    <span>{dish.title}</span>
                                    {dish.badge && (
                                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-anbar-amber/20 text-anbar-rust">
                                        {dish.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-anbar-dark/50 truncate max-w-xs">{dish.description}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-bold text-anbar-dark/70">
                              {categories.find(c => c.slug === dish.category_slug)?.name_ar || dish.category_slug}
                            </td>
                            <td className="py-3 px-4 font-black text-anbar-rust">
                              {dish.price.toLocaleString('ar-SY')} ل.س
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleToggleAvailability(dish)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black border transition-all ${
                                  dish.is_available
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : 'bg-rose-50 text-rose-800 border-rose-300'
                                }`}
                              >
                                {dish.is_available ? 'متوفر ✅' : 'غير متوفر ❌'}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => {
                                    setEditingDish(dish);
                                    setIsDishModalOpen(true);
                                  }}
                                  className="w-8 h-8 rounded-lg bg-anbar-bg hover:bg-anbar-amber hover:text-white flex items-center justify-center text-anbar-dark/70 transition-colors"
                                  title="تعديل الطبق"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteDish(dish.id)}
                                  className="w-8 h-8 rounded-lg bg-anbar-bg hover:bg-rose-600 hover:text-white flex items-center justify-center text-anbar-dark/70 transition-colors"
                                  title="حذف الطبق"
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
            {/* TAB 2: CATEGORIES MANAGEMENT */}
            {/* ========================================================================= */}
            {activeTab === 'categories' && (
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-cairo font-bold text-base text-anbar-dark">إدارة فئات القائمة وتنسيقها</h3>
                    <p className="text-xs text-anbar-dark/60 mt-0.5">يمكنك إضافة، تعديل، حذف، تفعيل/تعطيل، وإعادة ترتيب ظهور الفئات في القائمة</p>
                  </div>
                  <button
                    onClick={openNewCategoryModal}
                    className="px-5 py-2.5 rounded-full bg-anbar-dark text-white font-bold text-xs hover:bg-anbar-rust transition-all flex items-center gap-2 shadow-md shrink-0"
                  >
                    <Plus className="w-4 h-4 text-anbar-amber" />
                    <span>إضافة فئة جديدة</span>
                  </button>
                </div>

                <div className="bg-white rounded-3xl border border-anbar-subtle shadow-soft overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-anbar-bg/60 border-b border-anbar-subtle text-anbar-dark/60 font-bold uppercase">
                        <tr>
                          <th className="py-3.5 px-4">ترتيب</th>
                          <th className="py-3.5 px-4">اسم الفئة (عربي)</th>
                          <th className="py-3.5 px-4">الاسم بالإنجليزية</th>
                          <th className="py-3.5 px-4">المعرف (Slug)</th>
                          <th className="py-3.5 px-4">عدد الأطباق</th>
                          <th className="py-3.5 px-4">الحالة</th>
                          <th className="py-3.5 px-4 text-center">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-anbar-subtle/50">
                        {categories.map((cat, idx) => {
                          const count = cat.slug === 'all'
                            ? menuItems.length
                            : menuItems.filter((i) => i.category_slug === cat.slug).length;

                          return (
                            <tr
                              key={cat.slug}
                              draggable={cat.slug !== 'all'}
                              onDragStart={(e) => {
                                if (cat.slug === 'all') return;
                                setDraggedCategorySlug(cat.slug);
                                e.dataTransfer.setData('text/plain', cat.slug);
                                e.dataTransfer.effectAllowed = 'move';
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                if (cat.slug === 'all') return;
                                e.dataTransfer.dropEffect = 'move';
                                if (dragOverCategorySlug !== cat.slug) {
                                  setDragOverCategorySlug(cat.slug);
                                }
                              }}
                              onDragLeave={() => {
                                if (dragOverCategorySlug === cat.slug) {
                                  setDragOverCategorySlug(null);
                                }
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                if (cat.slug === 'all') return;
                                handleDropCategory(cat.slug);
                              }}
                              onDragEnd={() => {
                                setDraggedCategorySlug(null);
                                setDragOverCategorySlug(null);
                              }}
                              className={`transition-all duration-150 ${
                                draggedCategorySlug === cat.slug
                                  ? 'opacity-35 bg-anbar-amber/20 scale-[0.99] border-2 border-dashed border-anbar-amber shadow-inner'
                                  : dragOverCategorySlug === cat.slug
                                  ? 'border-t-4 border-t-anbar-amber bg-anbar-amber/15 shadow-md'
                                  : 'hover:bg-anbar-bg/40'
                              }`}
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1.5">
                                  {cat.slug !== 'all' ? (
                                    <div
                                      className="w-7 h-7 rounded-lg bg-anbar-bg/90 hover:bg-anbar-amber hover:text-white flex items-center justify-center cursor-grab active:cursor-grabbing text-anbar-dark/60 transition-colors shadow-2xs"
                                      title="اسحب وأفلت لإعادة ترتيب الفئة (Drag & Drop)"
                                    >
                                      <GripVertical className="w-4 h-4" />
                                    </div>
                                  ) : (
                                    <div className="w-7 h-7" />
                                  )}
                                  <button
                                    onClick={() => handleMoveCategory(idx, 'up')}
                                    disabled={idx === 0 || cat.slug === 'all'}
                                    className="w-6 h-6 rounded bg-anbar-bg hover:bg-anbar-amber hover:text-white flex items-center justify-center disabled:opacity-30 disabled:hover:bg-anbar-bg disabled:hover:text-inherit"
                                    title="تحريك لأعلى"
                                  >
                                    <ArrowUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleMoveCategory(idx, 'down')}
                                    disabled={idx === categories.length - 1 || cat.slug === 'all'}
                                    className="w-6 h-6 rounded bg-anbar-bg hover:bg-anbar-amber hover:text-white flex items-center justify-center disabled:opacity-30 disabled:hover:bg-anbar-bg disabled:hover:text-inherit"
                                    title="تحريك لأسفل"
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </button>
                                  <span className="text-[10px] text-anbar-dark/40 font-mono w-4 text-center">
                                    {cat.sort_order ?? idx + 1}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4 font-bold text-anbar-dark">
                                {cat.name_ar}
                              </td>
                              <td className="py-3 px-4 text-anbar-dark/60 font-mono">
                                {cat.name_en || '-'}
                              </td>
                              <td className="py-3 px-4 font-mono text-[11px] text-anbar-rust">
                                {cat.slug}
                              </td>
                              <td className="py-3 px-4">
                                <span className="px-2.5 py-0.5 rounded-full bg-anbar-bg font-bold text-anbar-dark/70 text-[11px]">
                                  {count.toLocaleString('ar-SY')} طبق
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => handleToggleCategoryActive(cat)}
                                  disabled={cat.slug === 'all'}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-black border transition-all ${
                                    cat.is_active
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                      : 'bg-rose-50 text-rose-800 border-rose-300'
                                  } ${cat.slug === 'all' ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                  {cat.is_active ? 'نشطة ومفعلة ✅' : 'معطلة ❌'}
                                </button>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingCategory(cat);
                                      setIsCategoryModalOpen(true);
                                    }}
                                    className="w-8 h-8 rounded-lg bg-anbar-bg hover:bg-anbar-amber hover:text-white flex items-center justify-center text-anbar-dark/70 transition-colors"
                                    title="تعديل الفئة"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  {cat.slug !== 'all' && (
                                    <button
                                      onClick={() => handleDeleteCategory(cat.slug)}
                                      className="w-8 h-8 rounded-lg bg-anbar-bg hover:bg-rose-600 hover:text-white flex items-center justify-center text-anbar-dark/70 transition-colors"
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
            {/* TAB 3: TABLE QR GENERATOR */}
            {/* ========================================================================= */}
            {activeTab === 'qr' && (
              <TableQrManager />
            )}

            {/* ========================================================================= */}
            {/* TAB 4: SECURITY & PIN SETTINGS */}
            {/* ========================================================================= */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Kitchen PIN Card */}
                <div className="bg-white rounded-3xl border border-anbar-subtle p-6 sm:p-8 shadow-soft">
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-anbar-amber/15 border border-anbar-amber/30 flex items-center justify-center text-anbar-rust shadow-xs">
                      <KeyRound className="w-6 h-6 text-anbar-rust" />
                    </div>
                    <div>
                      <h3 className="font-cairo font-black text-lg text-anbar-dark">
                        رمز PIN لشاشة طلبات الطاولات الحية
                      </h3>
                      <p className="text-xs text-anbar-dark/60 font-medium">
                        هذا الرمز السري هو المطلوب لفتح شاشة طلبات المطبخ والصالة (/orders)
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveKitchenPin} className="space-y-4 mt-6">
                    <div>
                      <label className="block text-xs font-bold text-anbar-dark mb-1.5">
                        رمز PIN الحالي: <span className="font-mono text-sm text-anbar-rust px-2 py-0.5 bg-anbar-bg rounded font-black">{kitchenPin}</span>
                      </label>
                      <input
                        type="text"
                        required
                        minLength={4}
                        maxLength={8}
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value)}
                        placeholder="أدخل رمز PIN جديد (4-8 أرقام)"
                        className="w-full px-4 py-3 bg-anbar-bg border border-anbar-subtle rounded-2xl text-center text-lg font-mono font-bold tracking-widest focus:outline-none focus:border-anbar-amber"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingPin}
                      className="w-full py-3 rounded-2xl bg-anbar-dark text-white font-bold text-xs hover:bg-anbar-rust transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      {isSavingPin ? <RefreshCw className="w-4 h-4 animate-spin text-anbar-amber" /> : <Lock className="w-4 h-4 text-anbar-amber" />}
                      <span>حفظ وتحديث رمز PIN الجديد</span>
                    </button>
                  </form>
                </div>

                {/* Direct Link Info Card */}
                <div className="bg-white rounded-3xl border border-anbar-subtle p-6 sm:p-8 shadow-soft">
                  <h4 className="font-cairo font-bold text-sm text-anbar-dark mb-2">
                    رابط شاشة الطلبات لطاقم الصالة والمطبخ:
                  </h4>
                  <div className="p-3 bg-anbar-bg rounded-2xl border border-anbar-subtle flex items-center justify-between gap-3 text-xs font-mono">
                    <span className="text-anbar-dark/80 font-bold truncate">/orders</span>
                    <Link
                      href="/orders"
                      target="_blank"
                      className="px-4 py-1.5 rounded-xl bg-anbar-dark text-white font-sans text-xs font-bold hover:bg-anbar-rust transition-colors shrink-0"
                    >
                      فتح الشاشة
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* ========================================================================= */}
          {/* DISH CREATE / EDIT MODAL */}
          {/* ========================================================================= */}
          {isDishModalOpen && editingDish && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-anbar-dark/60 backdrop-blur-xs animate-fade-in">
              <div className="bg-white rounded-4xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-anbar-subtle shadow-2xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-anbar-subtle">
                  <h3 className="font-cairo font-black text-lg text-anbar-dark">
                    {editingDish.id ? 'تعديل بيانات الطبق' : 'إضافة طبق جديد للقائمة'}
                  </h3>
                  <button
                    onClick={() => setIsDishModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-anbar-bg flex items-center justify-center text-anbar-dark/60 hover:text-anbar-dark"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveDish} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-anbar-dark mb-1">اسم الطبق *</label>
                      <input
                        type="text"
                        required
                        value={editingDish.title || ''}
                        onChange={(e) => setEditingDish({ ...editingDish, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-anbar-bg border border-anbar-subtle rounded-2xl font-bold focus:outline-none focus:border-anbar-amber"
                        placeholder="مثال: كابتشينو (Cappuccino)"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-anbar-dark mb-1">الفئة *</label>
                      <select
                        value={editingDish.category_slug || 'hot-drinks'}
                        onChange={(e) => setEditingDish({ ...editingDish, category_slug: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-anbar-bg border border-anbar-subtle rounded-2xl font-bold focus:outline-none focus:border-anbar-amber"
                      >
                        {categories.filter(c => c.slug !== 'all').map((c) => (
                          <option key={c.slug} value={c.slug}>{c.name_ar}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-anbar-dark mb-1">السعر (ل.س) *</label>
                      <input
                        type="number"
                        required
                        value={editingDish.price ?? 0}
                        onChange={(e) => setEditingDish({ ...editingDish, price: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-anbar-bg border border-anbar-subtle rounded-2xl font-bold focus:outline-none focus:border-anbar-amber"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-anbar-dark mb-1">الشارة المميزة (Badge)</label>
                      <input
                        type="text"
                        value={editingDish.badge || ''}
                        onChange={(e) => setEditingDish({ ...editingDish, badge: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-anbar-bg border border-anbar-subtle rounded-2xl font-bold focus:outline-none focus:border-anbar-amber"
                        placeholder="مثال: الأكثر طلباً، توقيع عنبر"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-anbar-dark mb-1">وصف الطبق *</label>
                    <textarea
                      rows={2}
                      required
                      value={editingDish.description || ''}
                      onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-anbar-bg border border-anbar-subtle rounded-2xl font-medium focus:outline-none focus:border-anbar-amber"
                      placeholder="وصف مشهي للطبق ومذاقه..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-anbar-dark mb-1">المكونات التفصيلية</label>
                      <input
                        type="text"
                        value={editingDish.ingredients || ''}
                        onChange={(e) => setEditingDish({ ...editingDish, ingredients: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-anbar-bg border border-anbar-subtle rounded-2xl font-medium focus:outline-none focus:border-anbar-amber"
                        placeholder="المكونات مفصولة بفواصل"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-anbar-dark mb-1">اقتراح التناغم (Pairing)</label>
                      <input
                        type="text"
                        value={editingDish.pairing || ''}
                        onChange={(e) => setEditingDish({ ...editingDish, pairing: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-anbar-bg border border-anbar-subtle rounded-2xl font-medium focus:outline-none focus:border-anbar-amber"
                        placeholder="مثال: يُفضل مع موهيتو بارد"
                      />
                    </div>
                  </div>

                  <div>
                    <ImageUploader
                      currentImageUrl={editingDish.image_url || ''}
                      onImageUploaded={(url) => setEditingDish({ ...editingDish, image_url: url })}
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={editingDish.is_available ?? true}
                        onChange={(e) => setEditingDish({ ...editingDish, is_available: e.target.checked })}
                        className="w-4 h-4 rounded text-anbar-amber focus:ring-anbar-amber"
                      />
                      <span>متوفر في القائمة للطلب</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={editingDish.is_featured ?? false}
                        onChange={(e) => setEditingDish({ ...editingDish, is_featured: e.target.checked })}
                        className="w-4 h-4 rounded text-anbar-amber focus:ring-anbar-amber"
                      />
                      <span>تمييز في الواجهة (Featured)</span>
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-anbar-subtle">
                    <button
                      type="button"
                      onClick={() => setIsDishModalOpen(false)}
                      className="px-5 py-2.5 rounded-full bg-anbar-bg text-anbar-dark font-bold hover:bg-anbar-subtle transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-anbar-dark text-white font-bold hover:bg-anbar-rust transition-colors shadow-md"
                    >
                      حفظ الطبق
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-anbar-dark/60 backdrop-blur-xs animate-fade-in">
              <div className="bg-white rounded-4xl max-w-md w-full p-6 sm:p-8 border border-anbar-subtle shadow-2xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-anbar-subtle">
                  <h3 className="font-cairo font-black text-lg text-anbar-dark">
                    {editingCategory.id ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
                  </h3>
                  <button
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-anbar-bg flex items-center justify-center text-anbar-dark/60 hover:text-anbar-dark"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-anbar-dark mb-1">اسم الفئة بالعربية *</label>
                    <input
                      type="text"
                      required
                      value={editingCategory.name_ar || ''}
                      onChange={(e) => {
                        const nameAr = e.target.value;
                        setEditingCategory({
                          ...editingCategory,
                          name_ar: nameAr,
                          slug: editingCategory.slug || nameAr.toLowerCase().trim().replace(/\s+/g, '-'),
                        });
                      }}
                      className="w-full px-3.5 py-2.5 bg-anbar-bg border border-anbar-subtle rounded-2xl font-bold focus:outline-none focus:border-anbar-amber"
                      placeholder="مثال: سبيشال كافيه"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-anbar-dark mb-1">الاسم بالإنجليزية</label>
                    <input
                      type="text"
                      value={editingCategory.name_en || ''}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name_en: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-anbar-bg border border-anbar-subtle rounded-2xl font-bold focus:outline-none focus:border-anbar-amber"
                      placeholder="مثال: Special Coffee"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-anbar-dark mb-1">المعرف البرمجي (Slug) *</label>
                    <input
                      type="text"
                      required
                      value={editingCategory.slug || ''}
                      onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className="w-full px-3.5 py-2.5 bg-anbar-bg border border-anbar-subtle rounded-2xl font-mono font-bold focus:outline-none focus:border-anbar-amber"
                      placeholder="special-coffee"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={editingCategory.is_active ?? true}
                        onChange={(e) => setEditingCategory({ ...editingCategory, is_active: e.target.checked })}
                        className="w-4 h-4 rounded text-anbar-amber focus:ring-anbar-amber"
                      />
                      <span>تفعيل وظهور الفئة في القائمة</span>
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-anbar-subtle">
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(false)}
                      className="px-5 py-2.5 rounded-full bg-anbar-bg text-anbar-dark font-bold hover:bg-anbar-subtle transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-anbar-dark text-white font-bold hover:bg-anbar-rust transition-colors shadow-md"
                    >
                      حفظ الفئة
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
