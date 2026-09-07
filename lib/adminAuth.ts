import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const COOKIE = 'pp_admin';
const secret = () => process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'change-this-secret';

export function createAdminToken(){
  const payload = `${Date.now()}`;
  const sig = crypto.createHmac('sha256', secret()).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

export function isAdmin(req: NextRequest){
  const token = req.cookies.get(COOKIE)?.value || '';
  const [payload, sig] = token.split('.');
  if(!payload || !sig) return false;
  const expected = crypto.createHmac('sha256', secret()).update(payload).digest('hex');
  if(!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  const age = Date.now() - Number(payload);
  return Number.isFinite(age) && age >= 0 && age < 8 * 60 * 60 * 1000;
}

export function setAdminCookie(res: NextResponse){
  res.cookies.set(COOKIE, createAdminToken(), {httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:60*60*8});
}
export function clearAdminCookie(res: NextResponse){
  res.cookies.set(COOKIE,'',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:0});
}
