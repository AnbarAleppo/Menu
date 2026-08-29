import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { getServiceSupabase } from '@/lib/supabaseServer';
import { INITIAL_CATEGORIES } from '@/lib/initialData';
import { Category } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get('all') === 'true';

    if (!isSupabaseConfigured() || !supabase) {
      let cats = INITIAL_CATEGORIES;
      if (!includeInactive) {
        cats = cats.filter(c => c.is_active);
      }
      cats.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      return NextResponse.json({ data: cats, source: 'local' });
    }

    let query = supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return NextResponse.json({ data: INITIAL_CATEGORIES, source: 'fallback' });
    }

    return NextResponse.json({ data, source: 'supabase' });
  } catch (err: any) {
    return NextResponse.json({ data: INITIAL_CATEGORIES, source: 'fallback' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const serverSupabase = getServiceSupabase();
    if (!serverSupabase) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 400 });
    }

    const body: Partial<Category> = await req.json();

    if (!body.name_ar) {
      return NextResponse.json({ error: 'اسم الفئة بالعربية مطلوب' }, { status: 400 });
    }

    const slug = body.slug || `cat-${Date.now()}`;

    const { data, error } = await serverSupabase
      .from('categories')
      .insert([{
        slug,
        name_ar: body.name_ar,
        name_en: body.name_en || '',
        sort_order: body.sort_order ?? 99,
        is_active: body.is_active ?? true,
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

    const body: Category = await req.json();

    if (!body.slug) {
      return NextResponse.json({ error: 'معرف الفئة (slug) مطلوب' }, { status: 400 });
    }

    const { data, error } = await serverSupabase
      .from('categories')
      .update({
        name_ar: body.name_ar,
        name_en: body.name_en,
        sort_order: body.sort_order,
        is_active: body.is_active,
      })
      .eq('slug', body.slug)
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
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'معرف الفئة مطلوب' }, { status: 400 });
    }

    // Check if category is protected (all)
    if (slug === 'all') {
      return NextResponse.json({ error: 'لا يمكن حذف الفئة العامة الافتراضية' }, { status: 400 });
    }

    const { error } = await serverSupabase
      .from('categories')
      .delete()
      .eq('slug', slug);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// BATCH REORDER CATEGORIES
export async function PATCH(req: NextRequest) {
  try {
    const serverSupabase = getServiceSupabase();
    if (!serverSupabase) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 400 });
    }

    const { items }: { items: { slug: string; sort_order: number }[] } = await req.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items array' }, { status: 400 });
    }

    for (const item of items) {
      await serverSupabase
        .from('categories')
        .update({ sort_order: item.sort_order })
        .eq('slug', item.slug);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
