import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getRequiredXP, getFeatDescription } from '@/lib/rpg-engine';

// Path to persistent JSON database file
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'aetheria-db.json');

export interface DbUser {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface DbCharacter {
  id: string;
  userId: string;
  name: string;
  title: string;
  level: number;
  currentXp: number;
  gold: number;
  streakCount: number;
  lastActiveDate: string;
  sacrificesThisMonth: number;
}

export interface DbAttributes {
  id: string;
  characterId: string;
  strLevel: number;
  strXp: number;
  intLevel: number;
  intXp: number;
  vitLevel: number;
  vitXp: number;
  agiLevel: number;
  agiXp: number;
  chaLevel: number;
  chaXp: number;
}

export interface DbQuest {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  category: string;
  rank: string;
  xpReward: number;
  goldReward: number;
  status: string;
  isDaily: boolean;
  createdAt: string;
  completedAt?: string | null;
}

export interface DbShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: string;
  statBoost?: string | null;
  iconSlug: string;
}

export interface DbInventory {
  id: string;
  userId: string;
  itemId: string;
  equipped: boolean;
  acquiredAt: string;
}

export interface DbBossRaid {
  id: string;
  name: string;
  title: string;
  maxHp: number;
  currentHp: number;
  deadline: string;
  rewardGold: number;
  rewardTitle: string;
  defeated: boolean;
}

export interface DatabaseSchema {
  users: DbUser[];
  characters: DbCharacter[];
  attributes: DbAttributes[];
  quests: DbQuest[];
  shopItems: DbShopItem[];
  inventory: DbInventory[];
  bossRaids: DbBossRaid[];
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const INITIAL_SHOP_ITEMS: DbShopItem[] = [
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

function getInitialData(): DatabaseSchema {
  const demoUserId = 'user-demo-judge';
  const demoCharId = 'char-demo-judge';

  return {
    users: [
      {
        id: demoUserId,
        email: 'demo@aetheria.rpg',
        passwordHash: hashPassword('demo1234'),
        createdAt: new Date().toISOString(),
      },
    ],
    characters: [
      {
        id: demoCharId,
        userId: demoUserId,
        name: 'Jin-Woo',
        title: 'Shadow Monarch Apprentice',
        level: 3,
        currentXp: 185,
        gold: 140,
        streakCount: 5,
        lastActiveDate: new Date().toISOString(),
        sacrificesThisMonth: 0,
      },
    ],
    attributes: [
      {
        id: 'attr-demo-judge',
        characterId: demoCharId,
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
    ],
    quests: [
      {
        id: 'quest-1',
        userId: demoUserId,
        title: 'Morning Hydration Rite',
        description: 'Drink 500ml pure water upon waking to cleanse bodily toxins.',
        category: 'VIT',
        rank: 'E',
        xpReward: 15,
        goldReward: 5,
        status: 'PENDING',
        isDaily: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'quest-2',
        userId: demoUserId,
        title: 'Deep Work Coding Block',
        description: 'Implement database connection and API routes without tab-switching.',
        category: 'INT',
        rank: 'B',
        xpReward: 75,
        goldReward: 35,
        status: 'PENDING',
        isDaily: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'quest-3',
        userId: demoUserId,
        title: "Hunter's Physical Conditioning",
        description: '50 push-ups, 50 squats, 2km jog to maintain battle readiness.',
        category: 'STR',
        rank: 'C',
        xpReward: 40,
        goldReward: 20,
        status: 'PENDING',
        isDaily: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'quest-4',
        userId: demoUserId,
        title: 'Inbox Zero Sweep',
        description: 'Purge all unread notifications and organize project tasks.',
        category: 'AGI',
        rank: 'D',
        xpReward: 25,
        goldReward: 10,
        status: 'COMPLETED',
        isDaily: true,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      },
      {
        id: 'quest-5',
        userId: demoUserId,
        title: 'Guild Synchronization Standup',
        description: 'Deliver crisp 5-minute progress report to the party.',
        category: 'CHA',
        rank: 'C',
        xpReward: 40,
        goldReward: 20,
        status: 'PENDING',
        isDaily: false,
        createdAt: new Date().toISOString(),
      },
    ],
    shopItems: INITIAL_SHOP_ITEMS,
    inventory: [
      {
        id: 'inv-1',
        userId: demoUserId,
        itemId: 'item-1',
        equipped: true,
        acquiredAt: new Date().toISOString(),
      },
    ],
    bossRaids: [
      {
        id: 'boss-01',
        name: 'Malakor the Sloth',
        title: 'Lord of Distraction & Procrastination',
        maxHp: 3000,
        currentHp: 2180,
        deadline: 'Sunday 23:59 UTC',
        rewardGold: 250,
        rewardTitle: 'Demon Slayer of Aetheria',
        defeated: false,
      },
    ],
  };
}

// Global in-memory cache synchronized with disk
let memoryDb: DatabaseSchema | null = null;

function ensureDataFile(): DatabaseSchema {
  if (memoryDb) return memoryDb;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      // Ensure all tables exist
      memoryDb = {
        users: parsed.users || [],
        characters: parsed.characters || [],
        attributes: parsed.attributes || [],
        quests: parsed.quests || [],
        shopItems: parsed.shopItems?.length ? parsed.shopItems : INITIAL_SHOP_ITEMS,
        inventory: parsed.inventory || [],
        bossRaids: parsed.bossRaids?.length ? parsed.bossRaids : getInitialData().bossRaids,
      };
      return memoryDb;
    }
  } catch (err) {
    console.warn('Could not read existing database file, resetting to initial seed.', err);
  }

  // Initialize brand new file
  const initial = getInitialData();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write initial db file:', e);
  }
  memoryDb = initial;
  return memoryDb;
}

export function saveDatabase(data: DatabaseSchema): void {
  memoryDb = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database file:', err);
  }
}

export function getDatabase(): DatabaseSchema {
  return ensureDataFile();
}

/**
 * High-Level Server Database Helpers
 */
export const serverDb = {
  // USER
  getUserByEmail(email: string) {
    const db = getDatabase();
    return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  getUserById(id: string) {
    const db = getDatabase();
    return db.users.find((u) => u.id === id) || null;
  },

  createUser(email: string, passwordHash: string, hunterName: string) {
    const db = getDatabase();
    const userId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const charId = `char-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const attrId = `attr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const newUser: DbUser = {
      id: userId,
      email: email.toLowerCase(),
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    const newCharacter: DbCharacter = {
      id: charId,
      userId,
      name: hunterName || 'Awakened Hunter',
      title: 'Novice Awakened',
      level: 1,
      currentXp: 0,
      gold: 50,
      streakCount: 1,
      lastActiveDate: new Date().toISOString(),
      sacrificesThisMonth: 0,
    };

    const newAttributes: DbAttributes = {
      id: attrId,
      characterId: charId,
      strLevel: 1,
      strXp: 0,
      intLevel: 1,
      intXp: 0,
      vitLevel: 1,
      vitXp: 0,
      agiLevel: 1,
      agiXp: 0,
      chaLevel: 1,
      chaXp: 0,
    };

    // Initial starter quests for new user
    const starterQuests: DbQuest[] = [
      {
        id: `q-${Date.now()}-1`,
        userId,
        title: 'Morning Hydration Rite',
        description: 'Drink 500ml pure water upon waking to cleanse bodily toxins.',
        category: 'VIT',
        rank: 'E',
        xpReward: 15,
        goldReward: 5,
        status: 'PENDING',
        isDaily: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: `q-${Date.now()}-2`,
        userId,
        title: 'First Deep Work Session',
        description: 'Complete 30 minutes of uninterrupted productive focus.',
        category: 'INT',
        rank: 'D',
        xpReward: 25,
        goldReward: 10,
        status: 'PENDING',
        isDaily: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: `q-${Date.now()}-3`,
        userId,
        title: 'Hunter Physical Warmup',
        description: '30 pushups or 15-minute brisk walk to activate physical vitality.',
        category: 'STR',
        rank: 'D',
        xpReward: 25,
        goldReward: 10,
        status: 'PENDING',
        isDaily: true,
        createdAt: new Date().toISOString(),
      },
    ];

    db.users.push(newUser);
    db.characters.push(newCharacter);
    db.attributes.push(newAttributes);
    db.quests.push(...starterQuests);

    saveDatabase(db);

    return {
      user: newUser,
      character: newCharacter,
      attributes: newAttributes,
    };
  },

  // CHARACTER
  getCharacterByUserId(userId: string) {
    const db = getDatabase();
    return db.characters.find((c) => c.userId === userId) || null;
  },

  getCharacterById(id: string) {
    const db = getDatabase();
    return db.characters.find((c) => c.id === id) || null;
  },

  getAttributesByCharacterId(characterId: string) {
    const db = getDatabase();
    return db.attributes.find((a) => a.characterId === characterId) || null;
  },

  updateCharacter(id: string, updates: Partial<DbCharacter>) {
    const db = getDatabase();
    const idx = db.characters.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    db.characters[idx] = { ...db.characters[idx], ...updates };
    saveDatabase(db);
    return db.characters[idx];
  },

  updateAttributes(characterId: string, updates: Partial<DbAttributes>) {
    const db = getDatabase();
    const idx = db.attributes.findIndex((a) => a.characterId === characterId);
    if (idx === -1) return null;

    db.attributes[idx] = { ...db.attributes[idx], ...updates };
    saveDatabase(db);
    return db.attributes[idx];
  },

  // QUESTS
  getQuestsByUserId(userId: string) {
    const db = getDatabase();
    return db.quests.filter((q) => q.userId === userId);
  },

  getQuestById(id: string) {
    const db = getDatabase();
    return db.quests.find((q) => q.id === id) || null;
  },

  createQuest(questData: Omit<DbQuest, 'id' | 'createdAt'>) {
    const db = getDatabase();
    const newQuest: DbQuest = {
      ...questData,
      id: `quest-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    db.quests.unshift(newQuest);
    saveDatabase(db);
    return newQuest;
  },

  updateQuest(id: string, updates: Partial<DbQuest>) {
    const db = getDatabase();
    const idx = db.quests.findIndex((q) => q.id === id);
    if (idx === -1) return null;

    db.quests[idx] = { ...db.quests[idx], ...updates };
    saveDatabase(db);
    return db.quests[idx];
  },

  // SHOP & INVENTORY
  getShopItems() {
    const db = getDatabase();
    if (!db.shopItems || db.shopItems.length === 0) {
      db.shopItems = INITIAL_SHOP_ITEMS;
      saveDatabase(db);
    }
    return db.shopItems;
  },

  getShopItemById(id: string) {
    const db = getDatabase();
    return db.shopItems.find((item) => item.id === id) || null;
  },

  getInventoryByUserId(userId: string) {
    const db = getDatabase();
    const userInv = db.inventory.filter((inv) => inv.userId === userId);
    // Join with shop items
    return userInv.map((inv) => ({
      ...inv,
      item: db.shopItems.find((s) => s.id === inv.itemId) || {
        id: inv.itemId,
        name: 'Mysterious Artifact',
        description: 'An acquired hunter relic.',
        cost: 0,
        type: 'RELIC',
        iconSlug: 'shield',
      },
    }));
  },

  purchaseItem(userId: string, characterId: string, itemId: string) {
    const db = getDatabase();
    const charIdx = db.characters.findIndex(
      (c) => c.id === characterId || c.userId === userId
    );
    if (charIdx === -1) {
      return { success: false, error: 'Character not found' };
    }

    const character = db.characters[charIdx];
    const item = db.shopItems.find((s) => s.id === itemId);
    if (!item) {
      return { success: false, error: 'Item not found in shop catalogue' };
    }

    if (character.gold < item.cost) {
      return {
        success: false,
        error: `Insufficient gold. Item costs ${item.cost} 🪙, but you only have ${character.gold} 🪙.`,
      };
    }

    // Deduct gold
    db.characters[charIdx].gold -= item.cost;

    // Create inventory record
    const inventoryId = `inv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newInventoryEntry: DbInventory = {
      id: inventoryId,
      userId: character.userId,
      itemId: item.id,
      equipped: item.type === 'RELIC',
      acquiredAt: new Date().toISOString(),
    };

    db.inventory.unshift(newInventoryEntry);
    saveDatabase(db);

    return {
      success: true,
      character: db.characters[charIdx],
      inventory: {
        ...newInventoryEntry,
        item,
      },
    };
  },

  toggleEquipInventory(inventoryId: string) {
    const db = getDatabase();
    const idx = db.inventory.findIndex((inv) => inv.id === inventoryId);
    if (idx === -1) return null;

    db.inventory[idx].equipped = !db.inventory[idx].equipped;
    saveDatabase(db);
    return db.inventory[idx];
  },

  // BOSS
  getBossRaid() {
    const db = getDatabase();
    if (!db.bossRaids || db.bossRaids.length === 0) {
      db.bossRaids = getInitialData().bossRaids;
      saveDatabase(db);
    }
    return db.bossRaids[0];
  },

  damageBoss(damage: number) {
    const db = getDatabase();
    if (!db.bossRaids || db.bossRaids.length === 0) {
      db.bossRaids = getInitialData().bossRaids;
    }
    const boss = db.bossRaids[0];
    const newHp = Math.max(0, boss.currentHp - damage);
    boss.currentHp = newHp;
    boss.defeated = newHp <= 0;
    saveDatabase(db);
    return boss;
  },
};
