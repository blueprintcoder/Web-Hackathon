import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getRankRewards } from '@/lib/rpg-engine';
import { QuestRank } from '@/types/game';

export const dynamic = 'force-dynamic';

// GET all quests
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const quests = await prisma.quest.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, quests });
  } catch (error) {
    console.error('Error fetching quests:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch quests' }, { status: 500 });
  }
}

// POST new quest
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, rank, isDaily, userId } = body;

    if (!title || !category || !rank) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const rewards = getRankRewards(rank as QuestRank);

    // If userId not provided, fallback to finding demo user
    let targetUserId = userId;
    if (!targetUserId) {
      const demo = await prisma.user.findFirst();
      targetUserId = demo?.id;
    }

    if (!targetUserId) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const quest = await prisma.quest.create({
      data: {
        userId: targetUserId,
        title,
        description: description || '',
        category,
        rank,
        xpReward: rewards.xp,
        goldReward: rewards.gold,
        isDaily: Boolean(isDaily),
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, quest });
  } catch (error) {
    console.error('Error creating quest:', error);
    return NextResponse.json({ success: false, error: 'Failed to create quest' }, { status: 500 });
  }
}
