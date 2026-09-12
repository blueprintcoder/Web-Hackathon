import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemId, characterId } = body;

    let targetCharId = characterId;
    if (!targetCharId) {
      const char = await prisma.character.findFirst();
      targetCharId = char?.id;
    }

    if (!targetCharId) {
      return NextResponse.json({ success: false, error: 'Character not found' }, { status: 404 });
    }

    const item = await prisma.shopItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }

    const character = await prisma.character.findUnique({
      where: { id: targetCharId },
    });

    if (!character || character.gold < item.cost) {
      return NextResponse.json({ success: false, error: 'Insufficient gold balance' }, { status: 400 });
    }

    // Atomic transaction: deduct gold and insert inventory
    const [updatedChar, inventoryEntry] = await prisma.$transaction([
      prisma.character.update({
        where: { id: targetCharId },
        data: {
          gold: character.gold - item.cost,
        },
      }),
      prisma.inventory.create({
        data: {
          userId: character.userId,
          itemId: item.id,
          equipped: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `Successfully acquired ${item.name}!`,
      character: updatedChar,
      inventory: inventoryEntry,
    });
  } catch (error) {
    console.error('Shop purchase error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process purchase' }, { status: 500 });
  }
}
