import { CartItem } from './types';

export interface StoredCustomerOrder {
  id: string;
  order_number?: number;
  table_number: string;
  items: CartItem[];
  total: number;
  notes?: string;
  status: string;
  timestamp: number;
  expires_at: number;
}

const STORAGE_KEY = 'anbar_customer_orders';
const FOUR_HOURS_MS = 4 * 60 * 60 * 1000; // 4 Hours in milliseconds

/**
 * Clean up expired orders (older than 4 hours) and get active stored orders
 */
export function getCustomerOrdersFromStorage(): StoredCustomerOrder[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: StoredCustomerOrder[] = JSON.parse(raw);
    const now = Date.now();

    // Filter out orders older than 4 hours
    const activeOrders = parsed.filter((order) => {
      const expiresAt = order.expires_at || order.timestamp + FOUR_HOURS_MS;
      return now < expiresAt;
    });

    // Update storage if any expired orders were pruned
    if (activeOrders.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeOrders));
    }

    return activeOrders;
  } catch (err) {
    console.error('Failed to read orders from localStorage:', err);
    return [];
  }
}

/**
 * Save newly submitted order to localStorage with a 4-hour retention timestamp
 */
export function saveCustomerOrderToStorage(orderData: {
  id?: string;
  order_number?: number;
  table_number: string;
  items: CartItem[];
  total: number;
  notes?: string;
  status?: string;
}): StoredCustomerOrder {
  const existing = getCustomerOrdersFromStorage();
  const now = Date.now();

  const newOrder: StoredCustomerOrder = {
    id: orderData.id || `order-${now}`,
    order_number: orderData.order_number,
    table_number: orderData.table_number || 'طاولة عامة',
    items: orderData.items || [],
    total: orderData.total || 0,
    notes: orderData.notes || '',
    status: orderData.status || 'new',
    timestamp: now,
    expires_at: now + FOUR_HOURS_MS,
  };

  try {
    const updated = [newOrder, ...existing.filter((o) => o.id !== newOrder.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save order to localStorage:', err);
  }

  return newOrder;
}

/**
 * Format remaining time from the 4-hour retention window
 */
export function formatRemainingTime(expiresAt: number): string {
  const diffMs = expiresAt - Date.now();
  if (diffMs <= 0) return 'انتهت صلاحية الحفظ (مضت 4 ساعات)';

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `محفوظ لمدة ${hours} س و ${minutes} د`;
  }
  return `محفوظ لمدة ${minutes} دقيقة`;
}
