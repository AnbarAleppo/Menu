import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { getServiceSupabase } from '@/lib/supabaseServer';
import { INITIAL_MENU_ITEMS } from '@/lib/initialData';
import { MenuItem } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    if (!isSupabaseConfigured() || !supabase) {
      let items = [...INITIAL_MENU_ITEMS];
      if (category && category !== 'all') {
        items = items.filter(i => i.category_slug === category);
      }
      items.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      return NextResponse.json({ data: items, source: 'local' });
    }

    let query = supabase
      .from('menu_items')
      .select('*')
      .order('sort_order', { ascending: true });

    if (category && category !== 'all') {
      query = query.eq('category_slug', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error fetching menu:', error);
      return NextResponse.json({ data: INITIAL_MENU_ITEMS, source: 'fallback_on_error' });
    }

    return NextResponse.json({ data: data || INITIAL_MENU_ITEMS, source: 'supabase' });
  } catch (err: any) {
    console.error('API menu error:', err);
    return NextResponse.json({ data: INITIAL_MENU_ITEMS, source: 'fallback_on_exception' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const serverSupabase = getServiceSupabase();
    if (!serverSupabase) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 400 });
    }

    const body: Partial<MenuItem> = await req.json();
    const id = body.id || `dish-${Date.now()}`;

    const { data, error } = await serverSupabase
      .from('menu_items')
      .insert([{
        id,
        title: body.title,
        category_slug: body.category_slug || 'mains',
        price: body.price || 0,
        description: body.description || '',
        ingredients: body.ingredients || '',
        pairing: body.pairing || '',
        image_url: body.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80',
        badge: body.badge || null,
        tags: body.tags || [],
        is_available: body.is_available ?? true,
        is_featured: body.is_featured ?? false,
        sort_order: body.sort_order || 99,
      }])
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

export async function PUT(req: NextRequest) {
  try {
    const serverSupabase = getServiceSupabase();
    if (!serverSupabase) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 400 });
    }

    const body: MenuItem = await req.json();

    const { data, error } = await serverSupabase
      .from('menu_items')
      .update({
        title: body.title,
        category_slug: body.category_slug,
        price: body.price,
        description: body.description,
        ingredients: body.ingredients,
        pairing: body.pairing,
        image_url: body.image_url,
        badge: body.badge,
        tags: body.tags,
        is_available: body.is_available,
        is_featured: body.is_featured,
        sort_order: body.sort_order,
        updated_at: new Date().toISOString()
      })
      .eq('id', body.id)
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

export async function DELETE(req: NextRequest) {
  try {
    const serverSupabase = getServiceSupabase();
    if (!serverSupabase) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing dish id' }, { status: 400 });
    }

    const { error } = await serverSupabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// BATCH REORDER MENU ITEMS
export async function PATCH(req: NextRequest) {
  try {
    const serverSupabase = getServiceSupabase();
    if (!serverSupabase) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 400 });
    }

    const { items }: { items: { id: string; sort_order: number }[] } = await req.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items array' }, { status: 400 });
    }

    for (const item of items) {
      await serverSupabase
        .from('menu_items')
        .update({ sort_order: item.sort_order })
        .eq('id', item.id);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
