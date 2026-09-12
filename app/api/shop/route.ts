import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

// GET all shop items & user inventory
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-demo-judge';

    const items = serverDb.getShopItems();
    const inventory = serverDb.getInventoryByUserId(userId);

    return NextResponse.json({
      success: true,
      items,
      inventory,
    });
  } catch (error) {
    console.error('Error fetching shop items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shop items' },
      { status: 500 }
    );
  }
}

// POST purchase item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemId, characterId, userId } = body;

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required.' },
        { status: 400 }
      );
    }

    // Determine target user and character
    let targetChar = characterId ? serverDb.getCharacterById(characterId) : null;
    if (!targetChar && userId) {
      targetChar = serverDb.getCharacterByUserId(userId);
    }
    if (!targetChar) {
      // Fall back to first character or demo character
      const db = serverDb.getBossRaid(); // trigger db init
      const firstChar = serverDb.getCharacterByUserId('user-demo-judge');
      targetChar = firstChar;
    }

    if (!targetChar) {
      return NextResponse.json(
        { success: false, error: 'Character not found' },
        { status: 404 }
      );
    }

    const result = serverDb.purchaseItem(
      targetChar.userId,
      targetChar.id,
      itemId
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully acquired ${result.inventory?.item?.name}!`,
      character: result.character,
      inventory: result.inventory,
    });
  } catch (error) {
    console.error('Shop purchase error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process purchase' },
      { status: 500 }
    );
  }
}
