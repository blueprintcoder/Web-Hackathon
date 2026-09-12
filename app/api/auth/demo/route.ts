import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST() {
  try {
    // Find or create demo user for judges
    let user = await prisma.user.findUnique({
      where: { email: 'demo@aetheria.rpg' },
      include: {
        character: {
          include: { attributes: true },
        },
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'demo@aetheria.rpg',
          passwordHash: 'demo_password_hash_secure',
          character: {
            create: {
              name: 'Jin-Woo',
              title: 'Shadow Monarch Apprentice',
              level: 1,
              currentXp: 0,
              gold: 50,
              streakCount: 3,
              attributes: {
                create: {
                  strLevel: 2,
                  intLevel: 3,
                  vitLevel: 1,
                  agiLevel: 2,
                  chaLevel: 1,
                },
              },
            },
          },
        },
        include: {
          character: {
            include: { attributes: true },
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Authenticated as Demo Hunter",
      user: {
        id: user.id,
        email: user.email,
        character: user.character,
      },
    });
  } catch (error) {
    console.error('Demo auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to authenticate demo user' },
      { status: 500 }
    );
  }
}
