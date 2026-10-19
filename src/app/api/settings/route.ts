import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { verifyAdminRequest } from '@/lib/auth';

const DEFAULT_SETTINGS: Record<string, any> = {
  kitchen_pin: '1234',
  restaurant_name: 'عنبر | Anbar Restaurant',
};

// In-memory fallback if Supabase is offline
let memorySettings: Record<string, any> = { ...DEFAULT_SETTINGS };

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const isAdmin = verifyAdminRequest(request);

    // CRITICAL SECURITY FIX: Never reveal kitchen_pin to unauthorized callers
    if (key === 'kitchen_pin' && !isAdmin) {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول إلى رمز PIN' },
        { status: 403 }
      );
    }

    const supabase = getSupabaseServerClient();

    if (supabase) {
      if (key) {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('key', key)
          .single();

        if (data && !error) {
          return NextResponse.json({ success: true, key: data.key, value: data.value });
        }
      } else {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*');

        if (data && !error) {
          const formatted = data.reduce((acc: any, curr: any) => {
            // Strip sensitive fields for non-admin
            if (!isAdmin && curr.key === 'kitchen_pin') {
              return acc;
            }
            acc[curr.key] = curr.value;
            return acc;
          }, {});

          const safeDefaults = { ...DEFAULT_SETTINGS };
          if (!isAdmin) {
            delete safeDefaults.kitchen_pin;
          }

          return NextResponse.json({
            success: true,
            settings: { ...safeDefaults, ...formatted },
          });
        }
      }
    }

    // Fallback
    if (key) {
      return NextResponse.json({
        success: true,
        key,
        value: memorySettings[key] || DEFAULT_SETTINGS[key] || '',
      });
    }

    const safeMemory = { ...memorySettings };
    if (!isAdmin) {
      delete safeMemory.kitchen_pin;
    }

    return NextResponse.json({
      success: true,
      settings: { ...safeMemory },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'حدث خطأ في استرجاع الإعدادات' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // CRITICAL SECURITY FIX: Only authorized admin can update settings
    if (!verifyAdminRequest(request)) {
      return NextResponse.json({ error: 'غير مصرح لك بتعديل الإعدادات' }, { status: 401 });
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'key and value are required' }, { status: 400 });
    }

    memorySettings[key] = value;

    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key,
          value,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.warn('Supabase settings update error (fallback memory used):', error.message);
      }
    }

    return NextResponse.json({ success: true, key, value });
  } catch (err: any) {
    return NextResponse.json({ error: 'فشل حفظ الإعدادات' }, { status: 500 });
  }
}
