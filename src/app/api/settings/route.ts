import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

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
            acc[curr.key] = curr.value;
            return acc;
          }, {});
          return NextResponse.json({ success: true, settings: { ...DEFAULT_SETTINGS, ...formatted } });
        }
      }
    }

    // Fallback
    if (key) {
      return NextResponse.json({
        success: true,
        key,
        value: memorySettings[key] || DEFAULT_SETTINGS[key] || '1234',
      });
    }

    return NextResponse.json({
      success: true,
      settings: { ...DEFAULT_SETTINGS, ...memorySettings },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'key and value are required' }, { status: 400 });
    }

    memorySettings[key] = value;

    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase
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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
