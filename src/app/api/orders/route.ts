import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { getServiceSupabase } from '@/lib/supabaseServer';
import { Order } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const serverSupabase = getServiceSupabase() || supabase;
    if (!isSupabaseConfigured() || !serverSupabase) {
      return NextResponse.json({ data: [], message: 'Supabase not configured' });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = serverSupabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: Order = await req.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'السلة فارغة' }, { status: 400 });
    }

    const serverSupabase = getServiceSupabase() || supabase;
    if (!isSupabaseConfigured() || !serverSupabase) {
      // In offline/mock mode: return simulated success
      const simulatedOrder = {
        ...body,
        id: `mock-${Date.now()}`,
        created_at: new Date().toISOString(),
        status: 'new'
      };
      return NextResponse.json({ data: simulatedOrder, source: 'local_simulation' });
    }

    const { data, error } = await serverSupabase
      .from('orders')
      .insert([{
        table_number: body.table_number || 'طاولة عامة',
        customer_name: body.customer_name || 'زبون الدار',
        customer_phone: body.customer_phone || '',
        items: body.items,
        total: body.total,
        status: 'new',
        notes: body.notes || '',
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase order insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, source: 'supabase' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const serverSupabase = getServiceSupabase() || supabase;
    if (!isSupabaseConfigured() || !serverSupabase) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 400 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing order id or status' }, { status: 400 });
    }

    const { data, error } = await serverSupabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
