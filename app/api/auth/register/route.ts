import { NextResponse } from 'next/server';
import { serverDb, hashPassword } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, hunterName } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!password || password.length < 4) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 4 characters long.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = serverDb.getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A hunter with this email already exists. Please log in.' },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);
    const result = serverDb.createUser(
      email,
      passwordHash,
      hunterName ? hunterName.trim() : 'Awakened Hunter'
    );

    const response = NextResponse.json({
      success: true,
      message: `Hunter Awakening Complete! Welcome, ${result.character.name}.`,
      user: {
        id: result.user.id,
        email: result.user.email,
        character: result.character,
      },
    });

    // Set session cookie
    response.cookies.set('aetheria_session_user', result.user.id, {
      httpOnly: false, // Accessible to client for easy UI sync
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create hunter account.' },
      { status: 500 }
    );
  }
}
