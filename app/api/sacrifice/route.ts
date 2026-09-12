import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateSoulSacrifice } from '@/lib/rpg-engine';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { characterId } = body;

    let targetCharacterId = characterId;
    if (!targetCharacterId) {
      const char = await prisma.character.findFirst();
      targetCharacterId = char?.id;
    }

    if (!targetCharacterId) {
      return NextResponse.json({ success: false, error: 'Character not found' }, { status: 404 });
    }

    const character = await prisma.character.findUnique({
      where: { id: targetCharacterId },
    });

    if (!character) {
      return NextResponse.json({ success: false, error: 'Character not found' }, { status: 404 });
    }

    const validation = validateSoulSacrifice(character.level, character.sacrificesThisMonth);
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.reason }, { status: 400 });
    }

    // Execute Soul Sacrifice: Demote 1 level, restore/increment streak
    const updated = await prisma.character.update({
      where: { id: targetCharacterId },
      data: {
        level: character.level - 1,
        streakCount: character.streakCount + 1,
        sacrificesThisMonth: character.sacrificesThisMonth + 1,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Soul Sacrifice executed: 1 Level sacrificed to preserve your streak intact.',
      character: updated,
    });
  } catch (error) {
    console.error('Soul sacrifice error:', error);
    return NextResponse.json({ success: false, error: 'Failed to execute sacrifice' }, { status: 500 });
  }
}
