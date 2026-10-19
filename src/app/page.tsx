'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { LayoutGrid, RectangleVertical } from 'lucide-react';
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
import { MenuItem, Category, CartItem, MenuSection } from '@/lib/types';
import { INITIAL_MENU_ITEMS, INITIAL_CATEGORIES, getCategorySection } from '@/lib/initialData';

function attachBaselineRatings(items: MenuItem[], ratingsMap: Record<string, any> = {}): MenuItem[] {
  return items.map((item) => {
    if (ratingsMap[item.id]) {
      return {
        ...item,
        rating: ratingsMap[item.id].average,
        rating_count: ratingsMap[item.id].count,
      };
    }
    let hash = 0;
    for (let i = 0; i < item.id.length; i++) {
      hash = (hash * 31 + item.id.charCodeAt(i)) >>> 0;
    }
    return {
      ...item,
      rating: 4.6 + ((hash % 5) / 10),
      rating_count: 14 + (hash % 30),
    };
  });
}

function MenuAppContent() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => attachBaselineRatings(INITIAL_MENU_ITEMS));
  const [activeSection, setActiveSection] = useState<MenuSection>('food');
  const [activeCategory, setActiveCategory] = useState<string>('burgers');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState<string>('طاولة رقم 1');
  const [isQrDetected, setIsQrDetected] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [gridCols, setGridCols] = useState<1 | 2>(2);

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

  // 2. Fetch Live Menu, Categories, and Ratings from API
  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, menuRes, ratingsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/menu'),
          fetch('/api/ratings'),
        ]);

        let ratingsMap: Record<string, any> = {};
        if (ratingsRes.ok) {
          const ratingsData = await ratingsRes.json();
          if (ratingsData?.ratings) {
            ratingsMap = ratingsData.ratings;
          }
        }

        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData.data && catData.data.length > 0) {
            const sortedCats = [...catData.data]
              .filter((c) => c.slug !== 'all')
              .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
            setCategories(sortedCats);
            if (sortedCats.length > 0) {
              setActiveCategory((prev) => (prev === 'all' || !prev ? sortedCats[0].slug : prev));
            }
          }
        }

        if (menuRes.ok) {
          const menuData = await menuRes.json();
          if (menuData.data && menuData.data.length > 0) {
            const sortedMenu = [...menuData.data].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
            setMenuItems(attachBaselineRatings(sortedMenu, ratingsMap));
          } else {
            setMenuItems((prev) => attachBaselineRatings(prev, ratingsMap));
          }
        } else {
          setMenuItems((prev) => attachBaselineRatings(prev, ratingsMap));
        }
      } catch (err) {
        console.warn('Using initial fallback menu data:', err);
      }
    }

    loadData();
  }, []);

  const handleRateDish = async (dishId: string, score: number) => {
    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: dishId, score }),
      });
      const data = await res.json();
      if (data.success) {
        setMenuItems((prev) =>
          prev.map((item) =>
            item.id === dishId
              ? { ...item, rating: data.rating, rating_count: data.rating_count }
              : item
          )
        );
        setSelectedDish((prev) =>
          prev && prev.id === dishId
            ? { ...prev, rating: data.rating, rating_count: data.rating_count }
            : prev
        );
        showToast('شكراً لك! تم تسجيل تقييمك بنجاح ⭐');
      }
    } catch (err) {
      console.error('Rating submit error:', err);
    }
  };

  // Filter Items based on category and search
  const filteredItems = menuItems.filter((item) => {
    const matchCategory = searchTerm.trim() !== '' ? true : item.category_slug === activeCategory;
    const matchSearch =
      searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
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

  const handleReorderItems = (items: CartItem[]) => {
    setCart((prev) => {
      const merged = [...prev];
      items.forEach((newItem) => {
        const existing = merged.find((i) => i.id === newItem.id);
        if (existing) {
          existing.qty += newItem.qty;
        } else {
          merged.push({ ...newItem });
        }
      });
      return merged;
    });
    showToast('تمت إضافة أصناف الطلب السابق إلى سلتك');
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
        <section id="menu-section" className="py-8 w-full">
          {/* Transparent Titlebar */}
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
              <div>
                <h2 className="font-cairo font-black text-2xl sm:text-3xl text-anbar-dark tracking-tight">
                  قائمة الطعام الكاملة
                </h2>
                <p className="text-anbar-dark/65 text-xs sm:text-sm mt-1 font-medium">
                  أطباق طازجة محضرة بأجود المكونات المحلية.
                </p>
              </div>

              {/* 1 vs 2 Columns View Switcher */}
              <div className="flex items-center self-start sm:self-center bg-white/85 p-0.5 rounded-full border border-anbar-subtle shadow-2xs shrink-0">
                <button
                  type="button"
                  onClick={() => setGridCols(1)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    gridCols === 1
                      ? 'bg-anbar-dark text-white shadow-xs'
                      : 'text-anbar-dark/60 hover:text-anbar-dark'
                  }`}
                  title="عرض عمود واحد"
                >
                  <RectangleVertical className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">عمود واحد</span>
                  <span className="sm:hidden">1</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGridCols(2)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    gridCols === 2
                      ? 'bg-anbar-dark text-white shadow-xs'
                      : 'text-anbar-dark/60 hover:text-anbar-dark'
                  }`}
                  title="عرض عمودين"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">عمودين</span>
                  <span className="sm:hidden">2</span>
                </button>
              </div>
            </div>
          </div>

          {/* Full-width 100% Sticky Category Bar with Food / Drinks 2-Tier Hierarchy */}
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            activeSection={activeSection}
            onSelectSection={setActiveSection}
            itemsCount={filteredItems.length}
          />

          {/* Menu Items Grid */}
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <MenuGrid
              items={filteredItems}
              cart={cart}
              columns={gridCols}
              onAddToCart={handleAddToCart}
              onUpdateCartQty={handleUpdateCartQty}
              onOpenDishModal={(item) => setSelectedDish(item)}
              onResetFilters={() => {
                setActiveSection('food');
                setActiveCategory('burgers');
                setSearchTerm('');
              }}
            />
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
        isQrDetected={isQrDetected}
        onRateDish={handleRateDish}
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
        onReorderItems={handleReorderItems}
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
