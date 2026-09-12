import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    let demoUser = serverDb.getUserByEmail('demo@aetheria.rpg');
    if (!demoUser) {
      const created = serverDb.createUser(
        'demo@aetheria.rpg',
        'demo_hash',
        'Jin-Woo'
      );
      demoUser = created.user;
    }

    const character = serverDb.getCharacterByUserId(demoUser.id);

    const response = NextResponse.json({
      success: true,
      message: 'Authenticated as Judge Demo Hunter (Jin-Woo)',
      user: {
        id: demoUser.id,
        email: demoUser.email,
        character,
      },
    });

    response.cookies.set('aetheria_session_user', demoUser.id, {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error('Demo auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to authenticate demo user' },
      { status: 500 }
    );
  }
}
