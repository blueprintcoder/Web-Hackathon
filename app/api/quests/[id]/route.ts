import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getRequiredXP, calculateBossDamage } from '@/lib/rpg-engine';

// PATCH to complete quest
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const quest = await prisma.quest.findUnique({
      where: { id },
      include: { user: { include: { character: { include: { attributes: true } } } } },
    });

    if (!quest) {
      return NextResponse.json({ success: false, error: 'Quest not found' }, { status: 404 });
    }

    if (body.status === 'COMPLETED' && quest.status !== 'COMPLETED') {
      const character = quest.user.character;
      if (!character) {
        return NextResponse.json({ success: false, error: 'Character not found' }, { status: 404 });
      }

      const xpGained = quest.xpReward;
      const goldGained = quest.goldReward;
      let newXp = character.currentXp + xpGained;
      let newLevel = character.level;
      let levelUp = false;

      // Check level up
      let reqXp = getRequiredXP(newLevel);
      if (newXp >= reqXp) {
        newLevel += 1;
        newXp = newXp - reqXp;
        levelUp = true;
      }

      // Calculate Boss damage
      const strLevel = character.attributes?.strLevel || 1;
      const damage = calculateBossDamage(xpGained, strLevel);

      // Perform atomic database transaction
      const [updatedQuest, updatedCharacter] = await prisma.$transaction([
        prisma.quest.update({
          where: { id },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
          },
        }),
        prisma.character.update({
          where: { id: character.id },
          data: {
            currentXp: newXp,
            level: newLevel,
            gold: character.gold + goldGained,
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        quest: updatedQuest,
        character: updatedCharacter,
        levelUp,
        damageDealt: damage,
      });
    }

    const updated = await prisma.quest.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, quest: updated });
  } catch (error) {
    console.error('Error updating quest:', error);
    return NextResponse.json({ success: false, error: 'Failed to update quest' }, { status: 500 });
  }
}

// DELETE quest
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.quest.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Quest deleted' });
  } catch (error) {
    console.error('Error deleting quest:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete quest' }, { status: 500 });
  }
}
