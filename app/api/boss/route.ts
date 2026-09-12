import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

// GET Boss Status
export async function GET() {
  try {
    const boss = serverDb.getBossRaid();
    return NextResponse.json({ success: true, boss });
  } catch (error) {
    console.error('Error fetching boss:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch boss' },
      { status: 500 }
    );
  }
}

// POST to damage boss
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { damage } = body;

    const boss = serverDb.damageBoss(damage || 50);
    return NextResponse.json({ success: true, boss });
  } catch (error) {
    console.error('Error damaging boss:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to damage boss' },
      { status: 500 }
    );
  }
}
