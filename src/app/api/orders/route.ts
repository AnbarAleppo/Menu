import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { getServiceSupabase } from '@/lib/supabaseServer';
import { Order, CartItem } from '@/lib/types';
import { INITIAL_MENU_ITEMS } from '@/lib/initialData';
import { verifyKitchenOrAdminRequest } from '@/lib/auth';

// Helper to get verified item price from menu
async function getVerifiedItemPrice(itemId: string): Promise<number | null> {
  const fallbackItem = INITIAL_MENU_ITEMS.find(i => i.id === itemId);
  try {
    const serverSupabase = getServiceSupabase();
    if (serverSupabase) {
      const { data } = await serverSupabase
        .from('menu_items')
        .select('price')
        .eq('id', itemId)
        .single();
      if (data && typeof data.price === 'number') {
        return data.price;
      }
    }
  } catch {
    // Fallback
  }
  return fallbackItem ? fallbackItem.price : null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('id');
    const isStaff = verifyKitchenOrAdminRequest(req);

    const serverSupabase = getServiceSupabase() || supabase;
    if (!isSupabaseConfigured() || !serverSupabase) {
      return NextResponse.json({ data: [], message: 'Supabase not configured' });
    }

    // CRITICAL SECURITY FIX: Non-staff users can ONLY fetch their own order by ID
    if (!isStaff) {
      if (!orderId) {
        return NextResponse.json(
          { error: 'غير مصرح لك بعرض جميع الطلبات' },
          { status: 403 }
        );
      }

      const { data, error } = await serverSupabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 });
      }

      return NextResponse.json({ data: [data] });
    }

    // Staff (Kitchen or Admin) can view all orders
    const status = searchParams.get('status');

    let query = serverSupabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (orderId) {
      query = query.eq('id', orderId);
    } else if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: 'حدث خطأ في جلب الطلبات' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: Order = await req.json();

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: 'السلة فارغة' }, { status: 400 });
    }

    // CRITICAL SECURITY FIX: Server-side validation of items & price recalculation
    const sanitizedItems: CartItem[] = [];
    let calculatedTotal = 0;

    for (const item of body.items) {
      const qty = Math.max(1, Math.min(50, Math.floor(Number(item.qty) || 1)));
      const verifiedPrice = await getVerifiedItemPrice(item.id);
      const safePrice = verifiedPrice !== null ? verifiedPrice : Math.max(0, Number(item.price) || 0);

      sanitizedItems.push({
        id: String(item.id).substring(0, 50),
        title: String(item.title).substring(0, 100),
        price: safePrice,
        qty,
        image_url: String(item.image_url || ''),
      });

      calculatedTotal += safePrice * qty;
    }

    // Clean customer details
    const cleanTable = String(body.table_number || 'طاولة عامة').substring(0, 30);
    const cleanCustomerName = String(body.customer_name || 'زبون الدار').substring(0, 50);
    const cleanPhone = String(body.customer_phone || '').substring(0, 30);
    const cleanNotes = String(body.notes || '').substring(0, 300);

    const serverSupabase = getServiceSupabase() || supabase;
    if (!isSupabaseConfigured() || !serverSupabase) {
      // In offline/mock mode: return simulated success
      const simulatedOrder = {
        ...body,
        id: `mock-${Date.now()}`,
        items: sanitizedItems,
        total: calculatedTotal,
        table_number: cleanTable,
        customer_name: cleanCustomerName,
        customer_phone: cleanPhone,
        notes: cleanNotes,
        created_at: new Date().toISOString(),
        status: 'new' as const,
      };
      return NextResponse.json({ data: simulatedOrder, source: 'local_simulation' });
    }

    const { data, error } = await serverSupabase
      .from('orders')
      .insert([{
        table_number: cleanTable,
        customer_name: cleanCustomerName,
        customer_phone: cleanPhone,
        items: sanitizedItems,
        total: calculatedTotal,
        status: 'new',
        notes: cleanNotes,
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase order insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, source: 'supabase' });
  } catch (err: any) {
    return NextResponse.json({ error: 'حدث خطأ أثناء إرسال الطلب' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // CRITICAL SECURITY FIX: Only Kitchen or Admin can update orders
    if (!verifyKitchenOrAdminRequest(req)) {
      return NextResponse.json({ error: 'غير مصرح لك بتحديث حالة الطلب' }, { status: 401 });
    }

    const serverSupabase = getServiceSupabase() || supabase;
    if (!isSupabaseConfigured() || !serverSupabase) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 400 });
    }

    const body = await req.json();
    const { id, status, items, total, notes, table_number, customer_name } = body;

    if (!id) {
      return NextResponse.json({ error: 'معرف الطلب مطلوب' }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status !== undefined) updatePayload.status = status;
    if (items !== undefined) updatePayload.items = items;
    if (total !== undefined) updatePayload.total = total;
    if (notes !== undefined) updatePayload.notes = notes;
    if (table_number !== undefined) updatePayload.table_number = table_number;
    if (customer_name !== undefined) updatePayload.customer_name = customer_name;

    const { data, error } = await serverSupabase
      .from('orders')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: 'حدث خطأ في تحديث الطلب' }, { status: 500 });
  }
}
