import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, signToken, TOKEN_COOKIE_NAME } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return apiError('Email and password are required', 'VALIDATION_ERROR', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return apiError('Invalid email or password', 'INVALID_CREDENTIALS', 401);
    }

    if (user.status !== 'ACTIVE') {
      return apiError('Your account has been deactivated. Please contact support.', 'ACCOUNT_DISABLED', 403);
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return apiError('Invalid email or password', 'INVALID_CREDENTIALS', 401);
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
    };

    const res = apiSuccess({
      user: userProfile,
      token,
    });

    res.cookies.set({
      name: TOKEN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (error: any) {
    console.error('Login error:', error);
    return apiError('Internal server error during login', 'SERVER_ERROR', 500);
  }
}
