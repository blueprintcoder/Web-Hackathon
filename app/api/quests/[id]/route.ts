import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/server-db';
import { getRequiredXP, calculateBossDamage } from '@/lib/rpg-engine';

export const dynamic = 'force-dynamic';

// PATCH to complete quest
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const quest = serverDb.getQuestById(id);
    if (!quest) {
      return NextResponse.json(
        { success: false, error: 'Quest not found' },
        { status: 404 }
      );
    }

    if (body.status === 'COMPLETED' && quest.status !== 'COMPLETED') {
      const character = serverDb.getCharacterByUserId(quest.userId);
      if (!character) {
        return NextResponse.json(
          { success: false, error: 'Character not found' },
          { status: 404 }
        );
      }

      const xpGained = quest.xpReward;
      const goldGained = quest.goldReward;
      let newXp = character.currentXp + xpGained;
      let newLevel = character.level;
      let levelUp = false;

      // Check level up with exact RPG engine XP curve
      let reqXp = getRequiredXP(newLevel);
      while (newXp >= reqXp) {
        newLevel += 1;
        newXp = newXp - reqXp;
        reqXp = getRequiredXP(newLevel);
        levelUp = true;
      }

      // Calculate Boss damage
      const attrs = serverDb.getAttributesByCharacterId(character.id);
      const strLevel = attrs?.strLevel || 1;
      const damage = calculateBossDamage(xpGained, strLevel);

      // Damage boss in database
      serverDb.damageBoss(damage);

      // Update character
      const updatedCharacter = serverDb.updateCharacter(character.id, {
        currentXp: newXp,
        level: newLevel,
        gold: character.gold + goldGained,
      });

      // Update quest
      const updatedQuest = serverDb.updateQuest(id, {
        status: 'COMPLETED',
        completedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        quest: updatedQuest,
        character: updatedCharacter,
        levelUp,
        damageDealt: damage,
      });
    }

    const updated = serverDb.updateQuest(id, body);
    return NextResponse.json({ success: true, quest: updated });
  } catch (error) {
    console.error('Error updating quest:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update quest' },
      { status: 500 }
    );
  }
}
