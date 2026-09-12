import { NextResponse } from 'next/server';
import { serverDb, hashPassword } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = serverDb.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const inputHash = hashPassword(password);
    if (user.passwordHash !== inputHash) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const character = serverDb.getCharacterByUserId(user.id);

    const response = NextResponse.json({
      success: true,
      message: 'Successfully logged in.',
      user: {
        id: user.id,
        email: user.email,
        character,
      },
    });

    // Set session cookie
    response.cookies.set('aetheria_session_user', user.id, {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process login.' },
      { status: 500 }
    );
  }
}
