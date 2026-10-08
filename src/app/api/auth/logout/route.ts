import { NextResponse } from 'next/server';
import { TOKEN_COOKIE_NAME } from '@/lib/auth';
import { apiSuccess } from '@/lib/api-response';

export async function POST() {
  const res = apiSuccess({ message: 'Logged out successfully' });
  res.cookies.set({
    name: TOKEN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  });
  return res;
}
