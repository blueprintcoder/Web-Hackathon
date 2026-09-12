import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Aetheria Life RPG database on Supabase...');

  // 1. Seed Boss Raid
  const existingBoss = await prisma.bossRaid.findFirst();
  if (!existingBoss) {
    await prisma.bossRaid.create({
      data: {
        name: 'Malakor the Sloth',
        title: 'Lord of Distraction & Procrastination',
        maxHp: 3000,
        currentHp: 2180,
        deadline: 'Sunday 23:59 UTC',
        rewardGold: 250,
        rewardTitle: 'Demon Slayer of Aetheria',
        defeated: false,
      },
    });
    console.log('✅ Boss Raid created: Malakor the Sloth (3000 HP)');
  }

  // 2. Seed Shop Items
  const shopItems = [
    {
      id: 'item-1',
      name: 'Scroll of Focus',
      description: 'Ancient papyrus granting +10% INT XP on all coding and study bounties.',
      cost: 80,
      type: 'RELIC',
      statBoost: '+10% INT XP',
      iconSlug: 'scroll',
    },
    {
      id: 'item-2',
      name: 'Aegis Streak Shield',
      description: 'Golden talisman that automatically freezes and preserves your streak if you miss a day.',
      cost: 150,
      type: 'RELIC',
      statBoost: 'Streak Freeze (1x)',
      iconSlug: 'shield',
    },
    {
      id: 'item-3',
      name: 'XP Surge Elixir',
      description: 'Brewed potion granting 2x XP multiplier for your next 3 completed bounties.',
      cost: 120,
      type: 'RELIC',
      statBoost: '2x XP (3 charges)',
      iconSlug: 'potion',
    },
    {
      id: 'item-4',
      name: '1-Hour Gaming Pass',
      description: 'Real-world permission token: 60 minutes of completely guilt-free video game time.',
      cost: 100,
      type: 'REAL_WORLD',
      statBoost: 'Real-Life Reward',
      iconSlug: 'gamepad',
    },
    {
      id: 'item-5',
      name: 'Guilt-Free Cheat Meal',
      description: 'Real-world permission token: Order pizza, burgers, or sushi without regret.',
      cost: 300,
      type: 'REAL_WORLD',
      statBoost: 'Real-Life Reward',
      iconSlug: 'pizza',
    },
    {
      id: 'item-6',
      name: 'Sleep-In / Day-Off Pass',
      description: 'Real-world permission token: Turn off the morning alarm and rest deeply.',
      cost: 400,
      type: 'REAL_WORLD',
      statBoost: 'Real-Life Reward',
      iconSlug: 'moon',
    },
  ];

  for (const item of shopItems) {
    await prisma.shopItem.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
  console.log(`✅ ${shopItems.length} Shop Items seeded successfully.`);

  // 3. Seed Judge Demo User
  let demoUser = await prisma.user.findUnique({
    where: { email: 'demo@aetheria.rpg' },
  });

  if (!demoUser) {
    demoUser = await prisma.user.create({
      data: {
        email: 'demo@aetheria.rpg',
        passwordHash: 'demo_password_hash_secure',
        character: {
          create: {
            name: 'Jin-Woo',
            title: 'Shadow Monarch Apprentice',
            level: 3,
            currentXp: 185,
            gold: 140,
            streakCount: 5,
            sacrificesThisMonth: 0,
            attributes: {
              create: {
                strLevel: 4,
                strXp: 75,
                intLevel: 6,
                intXp: 110,
                vitLevel: 3,
                vitXp: 40,
                agiLevel: 4,
                agiXp: 60,
                chaLevel: 2,
                chaXp: 20,
              },
            },
          },
        },
      },
    });
    console.log('✅ Judge Demo User created: demo@aetheria.rpg (Level 3 Hunter)');

    // Seed initial quests for Demo user
    const demoQuests = [
      {
        userId: demoUser.id,
        title: 'Morning Hydration Rite',
        description: 'Drink 500ml pure water upon waking to cleanse bodily toxins.',
        category: 'VIT',
        rank: 'E',
        xpReward: 15,
        goldReward: 5,
        status: 'PENDING',
        isDaily: true,
      },
      {
        userId: demoUser.id,
        title: 'Deep Work Coding Block',
        description: 'Implement database connection and API routes without tab-switching.',
        category: 'INT',
        rank: 'B',
        xpReward: 75,
        goldReward: 35,
        status: 'PENDING',
        isDaily: false,
      },
      {
        userId: demoUser.id,
        title: "Hunter's Physical Conditioning",
        description: '50 push-ups, 50 squats, 2km jog to maintain battle readiness.',
        category: 'STR',
        rank: 'C',
        xpReward: 40,
        goldReward: 20,
        status: 'PENDING',
        isDaily: true,
      },
      {
        userId: demoUser.id,
        title: 'Inbox Zero Sweep',
        description: 'Purge all unread notifications and organize project tasks.',
        category: 'AGI',
        rank: 'D',
        xpReward: 25,
        goldReward: 10,
        status: 'COMPLETED',
        completedAt: new Date(),
        isDaily: true,
      },
      {
        userId: demoUser.id,
        title: 'Guild Synchronization Standup',
        description: 'Deliver crisp 5-minute progress report to the party.',
        category: 'CHA',
        rank: 'C',
        xpReward: 40,
        goldReward: 20,
        status: 'PENDING',
        isDaily: false,
      },
    ];

    for (const quest of demoQuests) {
      await prisma.quest.create({ data: quest });
    }
    console.log(`✅ ${demoQuests.length} Starter Quests seeded for Demo user.`);
  }

  console.log('🎉 Seeding complete! Database ready for hackathon evaluation.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
