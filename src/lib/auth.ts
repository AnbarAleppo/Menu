import { NextRequest } from 'next/server';
import crypto from 'node:crypto';
import { getSupabaseServerClient } from './supabaseServer';

const AUTH_SECRET =
  process.env.ADMIN_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'anbar-super-secure-internal-salt-key-98213';

export interface AuthPayload {
  role: 'admin' | 'kitchen';
  issuedAt: number;
  expiresAt: number;
}

export function generateToken(role: 'admin' | 'kitchen', durationHours: number = 24): string {
  const now = Date.now();
  const payload: AuthPayload = {
    role,
    issuedAt: now,
    expiresAt: now + durationHours * 3600 * 1000,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

export function verifyToken(token?: string | null): AuthPayload | null {
  if (!token || !token.includes('.')) return null;

  try {
    const [payloadB64, signature] = token.split('.');
    if (!payloadB64 || !signature) return null;

    const expectedSignature = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(payloadB64)
      .digest('base64url');

    // Timing-safe comparison to prevent timing attacks
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload: AuthPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (Date.now() > payload.expiresAt) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function extractTokenFromRequest(req: NextRequest): string | null {
  // 1. Authorization header (Bearer ...)
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // 2. Custom header
  const customHeader = req.headers.get('x-anbar-token');
  if (customHeader) return customHeader.trim();

  // 3. Cookies
  const adminCookie = req.cookies.get('anbar_admin_token')?.value;
  if (adminCookie) return adminCookie;

  const kitchenCookie = req.cookies.get('anbar_kitchen_token')?.value;
  if (kitchenCookie) return kitchenCookie;

  return null;
}

export function verifyAdminRequest(req: NextRequest): boolean {
  const token = extractTokenFromRequest(req);
  const payload = verifyToken(token);
  return payload?.role === 'admin';
}

export function verifyKitchenOrAdminRequest(req: NextRequest): boolean {
  const token = extractTokenFromRequest(req);
  const payload = verifyToken(token);
  return payload?.role === 'admin' || payload?.role === 'kitchen';
}

export async function getVerifiedKitchenPin(): Promise<string> {
  try {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'kitchen_pin')
        .single();

      if (data && !error && data.value) {
        return String(data.value);
      }
    }
  } catch (err) {
    console.error('Error reading kitchen PIN from DB:', err);
  }
  return process.env.KITCHEN_PIN || '1234';
}
