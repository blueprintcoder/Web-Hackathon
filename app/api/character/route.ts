import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/server-db';
import { getRequiredXP, getFeatDescription } from '@/lib/rpg-engine';

export const dynamic = 'force-dynamic';

// GET character profile & formatted attributes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-demo-judge';

    let character = serverDb.getCharacterByUserId(userId);
    if (!character) {
      character = serverDb.getCharacterByUserId('user-demo-judge');
    }

    if (!character) {
      return NextResponse.json(
        { success: false, error: 'Character not found' },
        { status: 404 }
      );
    }

    const attrs = serverDb.getAttributesByCharacterId(character.id) || {
      strLevel: 1,
      strXp: 0,
      intLevel: 1,
      intXp: 0,
      vitLevel: 1,
      vitXp: 0,
      agiLevel: 1,
      agiXp: 0,
      chaLevel: 1,
      chaXp: 0,
    };

    const reqXp = getRequiredXP(character.level);

    const formattedAttributes = {
      STR: {
        level: attrs.strLevel,
        currentXp: attrs.strXp,
        requiredXp: getRequiredXP(attrs.strLevel),
        featDescription: getFeatDescription('STR', attrs.strLevel),
      },
      INT: {
        level: attrs.intLevel,
        currentXp: attrs.intXp,
        requiredXp: getRequiredXP(attrs.intLevel),
        featDescription: getFeatDescription('INT', attrs.intLevel),
      },
      VIT: {
        level: attrs.vitLevel,
        currentXp: attrs.vitXp,
        requiredXp: getRequiredXP(attrs.vitLevel),
        featDescription: getFeatDescription('VIT', attrs.vitLevel),
      },
      AGI: {
        level: attrs.agiLevel,
        currentXp: attrs.agiXp,
        requiredXp: getRequiredXP(attrs.agiLevel),
        featDescription: getFeatDescription('AGI', attrs.agiLevel),
      },
      CHA: {
        level: attrs.chaLevel,
        currentXp: attrs.chaXp,
        requiredXp: getRequiredXP(attrs.chaLevel),
        featDescription: getFeatDescription('CHA', attrs.chaLevel),
      },
    };

    return NextResponse.json({
      success: true,
      character: {
        id: character.id,
        userId: character.userId,
        name: character.name,
        title: character.title,
        level: character.level,
        currentXp: character.currentXp,
        requiredXp: reqXp,
        gold: character.gold,
        streakCount: character.streakCount,
        lastActiveDate: character.lastActiveDate,
        sacrificesThisMonth: character.sacrificesThisMonth,
        attributes: formattedAttributes,
      },
    });
  } catch (error) {
    console.error('Error fetching character:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch character profile' },
      { status: 500 }
    );
  }
}
