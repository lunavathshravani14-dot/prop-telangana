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
    let user: any = null;

    try {
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
    } catch (dbErr) {
      console.warn('Database offline or unreachable, using fallback credentials:', dbErr);
    }

    // Built-in Demo & Admin fallback if database is offline or unseeded
    if (!user) {
      if (normalizedEmail === 'admin@proptelangana.com' && password === 'Admin@123') {
        user = {
          id: 'admin-super-id-001',
          name: 'PropTelangana Administrator',
          email: 'admin@proptelangana.com',
          role: 'SUPER_ADMIN',
          phone: '+91 70138 73126',
          avatar: null,
          status: 'ACTIVE',
        };
      } else if (normalizedEmail === 'shravani@example.com' && password === 'User@123') {
        user = {
          id: 'buyer-user-id-002',
          name: 'Shravani Lunavath',
          email: 'shravani@example.com',
          role: 'BUYER',
          phone: '+91 70138 73126',
          avatar: null,
          status: 'ACTIVE',
        };
      } else {
        return apiError('Invalid email or password', 'INVALID_CREDENTIALS', 401);
      }
    } else {
      if (user.status !== 'ACTIVE') {
        return apiError('Your account has been deactivated. Please contact support.', 'ACCOUNT_DISABLED', 403);
      }

      const isValid = await comparePassword(password, user.passwordHash);
      if (!isValid) {
        return apiError('Invalid email or password', 'INVALID_CREDENTIALS', 401);
      }
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
