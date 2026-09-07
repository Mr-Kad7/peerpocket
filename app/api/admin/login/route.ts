import { NextRequest, NextResponse } from 'next/server';
import { clearAdminCookie, isAdmin, setAdminCookie } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  const ok = isAdmin(req);
  return NextResponse.json({ authenticated: ok }, { status: ok ? 200 : 401 });
}

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedEmail || !expectedPassword) return NextResponse.json({ error: 'Admin credentials are not configured. Add ADMIN_EMAIL and ADMIN_PASSWORD in Render.' }, { status: 503 });
  if (email !== expectedEmail || password !== expectedPassword) return NextResponse.json({ error: 'Incorrect admin email or password.' }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  setAdminCookie(res);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  clearAdminCookie(res);
  return res;
}
