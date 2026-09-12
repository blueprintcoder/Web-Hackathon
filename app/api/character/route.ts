import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getRequiredXP, getFeatDescription } from '@/lib/rpg-engine';
import { AttributeKey } from '@/types/game';

// GET character profile & attributes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let character = await prisma.character.findFirst({
      where: userId ? { userId } : undefined,
      include: {
        attributes: true,
      },
    });

    if (!character) {
      // Create default demo character if none exists
      const demoUser = await prisma.user.findFirst();
      if (demoUser) {
        character = await prisma.character.findUnique({
          where: { userId: demoUser.id },
          include: { attributes: true },
        });
      }
    }

    if (!character) {
      return NextResponse.json({ success: false, error: 'Character not found' }, { status: 404 });
    }

    const reqXp = getRequiredXP(character.level);
    const attrs = character.attributes;

    const formattedAttributes = {
      STR: {
        level: attrs?.strLevel || 1,
        currentXp: attrs?.strXp || 0,
        requiredXp: getRequiredXP(attrs?.strLevel || 1),
        featDescription: getFeatDescription('STR', attrs?.strLevel || 1),
      },
      INT: {
        level: attrs?.intLevel || 1,
        currentXp: attrs?.intXp || 0,
        requiredXp: getRequiredXP(attrs?.intLevel || 1),
        featDescription: getFeatDescription('INT', attrs?.intLevel || 1),
      },
      VIT: {
        level: attrs?.vitLevel || 1,
        currentXp: attrs?.vitXp || 0,
        requiredXp: getRequiredXP(attrs?.vitLevel || 1),
        featDescription: getFeatDescription('VIT', attrs?.vitLevel || 1),
      },
      AGI: {
        level: attrs?.agiLevel || 1,
        currentXp: attrs?.agiXp || 0,
        requiredXp: getRequiredXP(attrs?.agiLevel || 1),
        featDescription: getFeatDescription('AGI', attrs?.agiLevel || 1),
      },
      CHA: {
        level: attrs?.chaLevel || 1,
        currentXp: attrs?.chaXp || 0,
        requiredXp: getRequiredXP(attrs?.chaLevel || 1),
        featDescription: getFeatDescription('CHA', attrs?.chaLevel || 1),
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
        lastActiveDate: character.lastActiveDate.toISOString(),
        sacrificesThisMonth: character.sacrificesThisMonth,
        attributes: formattedAttributes,
      },
    });
  } catch (error) {
    console.error('Error fetching character:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch character profile' }, { status: 500 });
  }
}
