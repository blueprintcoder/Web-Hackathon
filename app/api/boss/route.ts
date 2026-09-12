import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET Boss Status
export async function GET() {
  try {
    let boss = await prisma.bossRaid.findFirst();

    if (!boss) {
      boss = await prisma.bossRaid.create({
        data: {
          name: 'Malakor the Sloth',
          title: 'Lord of Distraction & Procrastination',
          maxHp: 3000,
          currentHp: 2180,
          deadline: 'Sunday 23:59 UTC',
          rewardGold: 250,
          rewardTitle: 'Demon Slayer of Aetheria',
        },
      });
    }

    return NextResponse.json({ success: true, boss });
  } catch (error) {
    console.error('Error fetching boss:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch boss' }, { status: 500 });
  }
}

// POST to damage boss
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { damage } = body;

    let boss = await prisma.bossRaid.findFirst();
    if (!boss) {
      return NextResponse.json({ success: false, error: 'Boss not found' }, { status: 404 });
    }

    const newHp = Math.max(0, boss.currentHp - (damage || 50));
    const defeated = newHp === 0;

    const updated = await prisma.bossRaid.update({
      where: { id: boss.id },
      data: {
        currentHp: newHp,
        defeated,
      },
    });

    return NextResponse.json({ success: true, boss: updated });
  } catch (error) {
    console.error('Error damaging boss:', error);
    return NextResponse.json({ success: false, error: 'Failed to damage boss' }, { status: 500 });
  }
}
