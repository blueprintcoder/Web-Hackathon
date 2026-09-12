import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/server-db';
import { getRankRewards } from '@/lib/rpg-engine';
import { QuestRank } from '@/types/game';

export const dynamic = 'force-dynamic';

// GET all quests for user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-demo-judge';

    const quests = serverDb.getQuestsByUserId(userId);
    return NextResponse.json({ success: true, quests });
  } catch (error) {
    console.error('Error fetching quests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quests' },
      { status: 500 }
    );
  }
}

// POST new quest
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, rank, isDaily, userId } = body;

    if (!title || !category || !rank) {
      return NextResponse.json(
        { success: false, error: 'Title, category, and rank are required.' },
        { status: 400 }
      );
    }

    const rewards = getRankRewards((rank || 'C') as QuestRank);
    const targetUserId = userId || 'user-demo-judge';

    const quest = serverDb.createQuest({
      userId: targetUserId,
      title: title.trim(),
      description: description ? description.trim() : '',
      category,
      rank,
      xpReward: rewards.xp,
      goldReward: rewards.gold,
      isDaily: Boolean(isDaily),
      status: 'PENDING',
    });

    return NextResponse.json({ success: true, quest });
  } catch (error) {
    console.error('Error creating quest:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create quest' },
      { status: 500 }
    );
  }
}
