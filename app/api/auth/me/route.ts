import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { serverDb } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryUserId = searchParams.get('userId');

    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get('aetheria_session_user')?.value || queryUserId;

    if (!sessionUserId) {
      return NextResponse.json(
        { success: false, error: 'No active session' },
        { status: 401 }
      );
    }

    const user = serverDb.getUserById(sessionUserId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User session expired or not found' },
        { status: 401 }
      );
    }

    const character = serverDb.getCharacterByUserId(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        character,
      },
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify session' },
      { status: 500 }
    );
  }
}
