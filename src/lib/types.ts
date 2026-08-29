export interface Category {
  id: string;
  slug: string;
  name_ar: string;
  name_en?: string;
  sort_order: number;
  is_active: boolean;
}

export interface MenuItem {
  id: string;
  title: string;
  category_slug: string;
  price: number;
  description: string;
  ingredients?: string;
  pairing?: string;
  image_url: string;
  badge?: string | null;
  tags: string[];
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  qty: number;
  image_url: string;
}

export interface Order {
  id?: string;
  order_number?: number;
  table_number: string;
  customer_name?: string;
  customer_phone?: string;
  items: CartItem[];
  total: number;
  status: 'new' | 'accepted' | 'declined' | 'completed' | 'cancelled' | 'preparing' | 'served';
  notes?: string;
  created_at?: string;
}
