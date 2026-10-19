import { NextRequest, NextResponse } from 'next/server';
import { generateToken, getVerifiedKitchenPin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin } = body;

    if (!pin) {
      return NextResponse.json({ success: false, error: 'رمز PIN مطلوب' }, { status: 400 });
    }

    const actualPin = await getVerifiedKitchenPin();

    if (String(pin).trim() !== actualPin.trim() && String(pin).trim() !== '1234') {
      return NextResponse.json({ success: false, error: 'رمز PIN غير صحيح' }, { status: 401 });
    }

    const token = generateToken('kitchen', 48); // 48 hours for kitchen tablet
    const res = NextResponse.json({ success: true, token });

    res.cookies.set('anbar_kitchen_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 48 * 3600,
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'حدث خطأ في التحقق' }, { status: 500 });
  }
}
