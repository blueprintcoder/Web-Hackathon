import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/server-db';
import { validateSoulSacrifice } from '@/lib/rpg-engine';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { characterId, userId } = body;

    let character = characterId ? serverDb.getCharacterById(characterId) : null;
    if (!character && userId) {
      character = serverDb.getCharacterByUserId(userId);
    }
    if (!character) {
      character = serverDb.getCharacterByUserId('user-demo-judge');
    }

    if (!character) {
      return NextResponse.json(
        { success: false, error: 'Character not found' },
        { status: 404 }
      );
    }

    const validation = validateSoulSacrifice(
      character.level,
      character.sacrificesThisMonth
    );

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.reason },
        { status: 400 }
      );
    }

    // Demote 1 level and restore streak intact
    const updated = serverDb.updateCharacter(character.id, {
      level: character.level - 1,
      streakCount: character.streakCount + 1,
      sacrificesThisMonth: character.sacrificesThisMonth + 1,
    });

    return NextResponse.json({
      success: true,
      message: 'Soul Sacrifice executed: 1 Level sacrificed to preserve streak intact.',
      character: updated,
    });
  } catch (error) {
    console.error('Soul sacrifice error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to execute sacrifice' },
      { status: 500 }
    );
  }
}
