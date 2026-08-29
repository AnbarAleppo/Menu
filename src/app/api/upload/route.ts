import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseServer';

const BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'anbar-assets';

export async function POST(req: NextRequest) {
  try {
    const serverSupabase = getServiceSupabase();
    if (!serverSupabase) {
      return NextResponse.json(
        { error: 'Supabase storage is not configured yet. Please check your .env.local file.' },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'لم يتم اختيار ملف' }, { status: 400 });
    }

    // Generate unique filename with original extension
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `dish-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;
    const filePath = `dishes/${filename}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Supabase Bucket
    const { data: uploadData, error: uploadError } = await serverSupabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: publicUrlData } = serverSupabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      path: filePath,
      fileName: filename,
    });
  } catch (err: any) {
    console.error('Upload handler exception:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
