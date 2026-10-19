import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { getServiceSupabase } from '@/lib/supabaseServer';
import { INITIAL_CATEGORIES, getCategorySection } from '@/lib/initialData';
import { Category } from '@/lib/types';
import { verifyAdminRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get('all') === 'true';

    if (!isSupabaseConfigured() || !supabase) {
      let cats = INITIAL_CATEGORIES;
      if (!includeInactive) {
        cats = cats.filter(c => c.is_active);
      }
      cats = cats.map(c => ({
        ...c,
        section: getCategorySection(c),
      }));
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

    // Attach inferred section (food vs drinks)
    const enrichedData = (data as Category[]).map(c => ({
      ...c,
      section: getCategorySection(c),
    }));

    return NextResponse.json({ data: enrichedData, source: 'supabase' });
  } catch (err: any) {
    return NextResponse.json({ data: INITIAL_CATEGORIES, source: 'fallback' });
  }
}

export async function POST(req: NextRequest) {
  try {
    // CRITICAL SECURITY FIX: Only authorized admin can add categories
    if (!verifyAdminRequest(req)) {
      return NextResponse.json({ error: 'غير مصرح لك بإضافة فئات جديدة' }, { status: 401 });
    }

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

    return NextResponse.json({
      data: {
        ...data,
        section: getCategorySection(data),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'حدث خطأ في الحفظ' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    // CRITICAL SECURITY FIX: Only authorized admin can update categories
    if (!verifyAdminRequest(req)) {
      return NextResponse.json({ error: 'غير مصرح لك بتعديل الفئات' }, { status: 401 });
    }

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

    return NextResponse.json({
      data: {
        ...data,
        section: getCategorySection(data),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'حدث خطأ في التعديل' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // CRITICAL SECURITY FIX: Only authorized admin can delete categories
    if (!verifyAdminRequest(req)) {
      return NextResponse.json({ error: 'غير مصرح لك بحذف الفئات' }, { status: 401 });
    }

    const serverSupabase = getServiceSupabase();
    if (!serverSupabase) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'معرف الفئة مطلوب' }, { status: 400 });
    }

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
    return NextResponse.json({ error: 'حدث خطأ في الحذف' }, { status: 500 });
  }
}

// BATCH REORDER CATEGORIES
export async function PATCH(req: NextRequest) {
  try {
    // CRITICAL SECURITY FIX: Only authorized admin can reorder categories
    if (!verifyAdminRequest(req)) {
      return NextResponse.json({ error: 'غير مصرح لك بإعادة ترتيب الفئات' }, { status: 401 });
    }

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
    return NextResponse.json({ error: 'حدث خطأ في إعادة الترتيب' }, { status: 500 });
  }
}
