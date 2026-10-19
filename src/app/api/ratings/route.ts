import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

interface RatingRecord {
  totalScore: number;
  count: number;
  average: number;
}

// Generate consistent baseline ratings based on dish ID so every dish looks established
function getBaselineRating(itemId: string): RatingRecord {
  let hash = 0;
  for (let i = 0; i < itemId.length; i++) {
    hash = (hash * 31 + itemId.charCodeAt(i)) >>> 0;
  }
  // Realistic ratings between 4.6 and 5.0
  const avg = 4.6 + ((hash % 5) / 10);
  const count = 12 + (hash % 35);
  const totalScore = Math.round(avg * count);
  return {
    totalScore,
    count,
    average: Math.round((totalScore / count) * 10) / 10,
  };
}

// In-memory ratings fallback
let memoryRatings: Record<string, RatingRecord> = {};

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'item_ratings')
        .single();

      if (data && !error && data.value) {
        return NextResponse.json({ success: true, ratings: data.value });
      }
    }

    return NextResponse.json({ success: true, ratings: memoryRatings });
  } catch (err: any) {
    return NextResponse.json({ success: false, ratings: memoryRatings });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, score } = body;

    if (!itemId || typeof score !== 'number' || score < 1 || score > 5) {
      return NextResponse.json(
        { error: 'itemId and a valid score between 1 and 5 are required' },
        { status: 400 }
      );
    }

    // Rate-limiting spam protection: check cookie for recent rating of this dish
    const ratedCookieName = `anbar_rated_${itemId}`;
    const alreadyRated = request.cookies.get(ratedCookieName);
    if (alreadyRated) {
      return NextResponse.json(
        { error: 'لقد قمت بتقييم هذا الطبق مسبقاً، شكراً لمشاركتك!' },
        { status: 429 }
      );
    }

    // Load current ratings from Supabase or fallback
    let allRatings: Record<string, RatingRecord> = { ...memoryRatings };
    const supabase = getSupabaseServerClient();

    if (supabase) {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'item_ratings')
          .single();

        if (data?.value) {
          allRatings = { ...data.value };
        }
      } catch (e) {
        // Continue with memoryRatings
      }
    }

    // Get current record or baseline
    const current = allRatings[itemId] || getBaselineRating(itemId);
    const newTotalScore = current.totalScore + score;
    const newCount = current.count + 1;
    const newAverage = Math.round((newTotalScore / newCount) * 10) / 10;

    const updatedRecord: RatingRecord = {
      totalScore: newTotalScore,
      count: newCount,
      average: newAverage,
    };

    allRatings[itemId] = updatedRecord;
    memoryRatings = allRatings;

    // Persist to Supabase site_settings
    if (supabase) {
      try {
        await supabase.from('site_settings').upsert({
          key: 'item_ratings',
          value: allRatings,
          updated_at: new Date().toISOString(),
        });
      } catch (saveErr) {
        console.warn('Failed to persist ratings to Supabase:', saveErr);
      }
    }

    const res = NextResponse.json({
      success: true,
      itemId,
      rating: updatedRecord.average,
      rating_count: updatedRecord.count,
    });

    // Set cookie for 7 days to prevent repeated voting
    res.cookies.set(ratedCookieName, '1', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 3600,
      path: '/',
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: 'حدث خطأ في تسجيل التقييم' }, { status: 500 });
  }
}
