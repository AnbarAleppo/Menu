'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import AmbientBlobs from '@/components/AmbientBlobs';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategoryTabs from '@/components/CategoryTabs';
import MenuGrid from '@/components/MenuGrid';
import DishModal from '@/components/DishModal';
import CartDrawer from '@/components/CartDrawer';
import FloatingCartBar from '@/components/FloatingCartBar';
import MobileSearchModal from '@/components/MobileSearchModal';
import Footer from '@/components/Footer';
import ToastNotification from '@/components/ToastNotification';
import { MenuItem, Category, CartItem } from '@/lib/types';
import { INITIAL_MENU_ITEMS, INITIAL_CATEGORIES } from '@/lib/initialData';

function MenuAppContent() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState<string>('طاولة رقم 1');
  const [isQrDetected, setIsQrDetected] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // 1. Detect Table from QR code query param (?table=4 or ?t=4)
  useEffect(() => {
    const tableParam = searchParams.get('table') || searchParams.get('t');
    if (tableParam) {
      const formatted = /^\d+$/.test(tableParam.trim())
        ? `طاولة رقم ${tableParam.trim()}`
        : tableParam.trim();

      setTableNumber(formatted);
      setIsQrDetected(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('anbar_active_table', formatted);
      }
      showToast(`مرحباً بك في عنبر! تم التعرف على ${formatted} 📍`);
    } else {
      // Check localStorage for previously scanned table
      if (typeof window !== 'undefined') {
        const savedTable = localStorage.getItem('anbar_active_table');
        if (savedTable) {
          setTableNumber(savedTable);
          setIsQrDetected(true);
        }
      }
    }
  }, [searchParams]);

  // 2. Fetch Live Menu and Categories from Supabase / API
  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, menuRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/menu'),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData.data && catData.data.length > 0) {
            const sortedCats = [...catData.data].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
            setCategories(sortedCats);
          }
        }

        if (menuRes.ok) {
          const menuData = await menuRes.json();
          if (menuData.data && menuData.data.length > 0) {
            const sortedMenu = [...menuData.data].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
            setMenuItems(sortedMenu);
          }
        }
      } catch (err) {
        console.warn('Using initial fallback menu data:', err);
      }
    }

    loadData();
  }, []);

  // Filter Items based on category and search
  const filteredItems = menuItems.filter((item) => {
    const matchCategory = activeCategory === 'all' || item.category_slug === activeCategory;
    const matchSearch =
      searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.ingredients && item.ingredients.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { id: item.id, title: item.title, price: item.price, qty: 1, image_url: item.image_url }];
    });
    showToast(`تمت إضافة "${item.title}" إلى طلبك`);
  };

  const handleAddToCartWithQty = (item: MenuItem, qty: number) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, qty: qty } : c));
      }
      return [...prev, { id: item.id, title: item.title, price: item.price, qty, image_url: item.image_url }];
    });
    showToast(`تمت إضافة "${item.title}" إلى طلبك`);
  };

  const handleUpdateCartQty = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleClearCart = () => {
    setCart([]);
    showToast('تم إفراغ سلة الطلبات');
  };

  const handleOrderSuccess = (orderData: any) => {
    showToast(`تم إرسال طلبك إلى المطبخ بنجاح (${tableNumber})! 🎉`);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      <AmbientBlobs />

      {/* Luxury Sticky Navbar with Active Table Chip */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenMobileSearch={() => setIsSearchModalOpen(true)}
        activeTable={isQrDetected ? tableNumber : null}
      />

      <main className="relative z-10">
        {/* Hero Showcase */}
        <HeroSection />

        {/* Menu Section */}
        <section id="menu-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            itemsCount={filteredItems.length}
          />

          <MenuGrid
            items={filteredItems}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
            onOpenDishModal={(item) => setSelectedDish(item)}
            onResetFilters={() => {
              setActiveCategory('all');
              setSearchTerm('');
            }}
          />
        </section>

        {/* Restaurant Philosophy Banner */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="rounded-5xl bg-white border border-anbar-subtle p-8 md:p-14 relative overflow-hidden shadow-soft">
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-anbar-amber/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-anbar-sage/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-anbar-rust">
                  أجواء وفلسفة عنبر
                </span>
                <h2 className="font-cairo font-extrabold text-3xl sm:text-5xl text-anbar-dark mt-2 leading-tight">
                  أشكال عضوية، ألوان دافئة، ولحظات هادئة.
                </h2>
                <p className="text-anbar-dark/70 text-sm sm:text-base mt-4 leading-relaxed font-medium">
                  صُمم عنبر ليكون مساحة دافئة ومريحة لمجتمعنا، بألوان التراكوتا البسيطة، ولمسات المريمية الناعمة، والضوء الطبيعي. كل كوب قهوة محضر بعناية، وكل طبق مصمم بحب للمواسم.
                </p>

                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="p-4 rounded-2xl bg-anbar-bg border border-anbar-subtle text-center">
                    <span className="font-cairo font-black text-2xl text-anbar-amber block">100%</span>
                    <span className="text-[11px] font-bold text-anbar-dark/60">مكونات عضوية</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-anbar-bg border border-anbar-subtle text-center">
                    <span className="font-cairo font-black text-2xl text-anbar-slate block">08:00</span>
                    <span className="text-[11px] font-bold text-anbar-dark/60">الافتتاح صباحاً</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-anbar-bg border border-anbar-subtle text-center">
                    <span className="font-cairo font-black text-2xl text-anbar-rust block">4.9 ★</span>
                    <span className="text-[11px] font-bold text-anbar-dark/60">تقييم الرواد</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-60 rounded-3xl overflow-hidden shadow-sm">
                  <Image
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"
                    alt="جلسات عنبر"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 300px"
                  />
                </div>
                <div className="relative h-60 rounded-3xl overflow-hidden shadow-sm mt-6">
                  <Image
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
                    alt="طاولة عنبر"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 300px"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer onShowToast={showToast} />

      {/* Modals & Drawers */}
      <DishModal
        dish={selectedDish}
        isOpen={Boolean(selectedDish)}
        onClose={() => setSelectedDish(null)}
        onAddToCartWithQty={handleAddToCartWithQty}
        initialQty={cart.find((c) => c.id === selectedDish?.id)?.qty || 1}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        tableNumber={tableNumber}
        onTableNumberChange={(val) => {
          setTableNumber(val);
          if (typeof window !== 'undefined') {
            localStorage.setItem('anbar_active_table', val);
          }
        }}
        isQrDetected={isQrDetected}
        onUpdateCartQty={handleUpdateCartQty}
        onClearCart={handleClearCart}
        onOrderSuccess={handleOrderSuccess}
      />

      <FloatingCartBar cart={cart} onOpenCart={() => setIsCartOpen(true)} />

      <MobileSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <ToastNotification message={toastMessage} />
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-anbar-bg" />}>
      <MenuAppContent />
    </Suspense>
  );
}
