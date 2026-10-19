import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseServer';
import { verifyAdminRequest } from '@/lib/auth';

const BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'anbar-assets';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/jpg']);

export async function POST(req: NextRequest) {
  try {
    // CRITICAL SECURITY FIX: Only authorized admin can upload assets
    if (!verifyAdminRequest(req)) {
      return NextResponse.json({ error: 'غير مصرح لك برفع الصور' }, { status: 401 });
    }

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

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'حجم الصورة يتجاوز الحد المسموح به (5 ميغابايت)' }, { status: 400 });
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
      return NextResponse.json({ error: 'نوع الملف غير مدعوم، يرجى رفع صورة فقط (WebP, JPG, PNG)' }, { status: 400 });
    }

    // Ensure extension is webp
    const originalExt = file.name.split('.').pop()?.toLowerCase();
    const isWebp = originalExt === 'webp' || file.type === 'image/webp';
    const extension = isWebp ? 'webp' : (originalExt || 'webp');
    const safeBaseName = file.name.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 20);
    const filename = `dish-${Date.now()}-${safeBaseName || 'img'}.${extension}`;
    const filePath = `dishes/${filename}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Supabase Bucket
    const { data: uploadData, error: uploadError } = await serverSupabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: isWebp ? 'image/webp' : (file.type || 'image/webp'),
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
    return NextResponse.json({ error: 'حدث خطأ في معالجة الملف' }, { status: 500 });
  }
}
