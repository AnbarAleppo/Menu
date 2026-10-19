import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = extractTokenFromRequest(req);
  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    role: payload.role,
    expiresAt: payload.expiresAt,
  });
}

export async function POST(req: NextRequest) {
  // Logout endpoint
  const res = NextResponse.json({ success: true, message: 'Logged out' });
  res.cookies.delete('anbar_admin_token');
  res.cookies.delete('anbar_kitchen_token');
  return res;
}
