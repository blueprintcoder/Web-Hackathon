export type QuestRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export type AttributeKey = 'STR' | 'INT' | 'VIT' | 'AGI' | 'CHA';

export type QuestStatus = 'PENDING' | 'COMPLETED';

export type ItemType = 'RELIC' | 'REAL_WORLD';

export interface AttributeData {
  level: number;
  currentXp: number;
  requiredXp: number;
  featDescription: string;
}

export interface CharacterAttributes {
  STR: AttributeData;
  INT: AttributeData;
  VIT: AttributeData;
  AGI: AttributeData;
  CHA: AttributeData;
}

export interface Character {
  id: string;
  userId: string;
  name: string;
  title: string;
  level: number;
  currentXp: number;
  requiredXp: number;
  gold: number;
  streakCount: number;
  lastActiveDate: string;
  sacrificesThisMonth: number;
  attributes: CharacterAttributes;
}

export interface Quest {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  category: AttributeKey;
  rank: QuestRank;
  xpReward: number;
  goldReward: number;
  status: QuestStatus;
  isDaily: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: ItemType;
  statBoost?: string;
  iconSlug: string;
}

export interface InventoryItem {
  id: string;
  userId: string;
  itemId: string;
  item: ShopItem;
  equipped: boolean;
  acquiredAt: string;
}

export interface BossRaid {
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

export interface SolitudeStatus {
  isActive: boolean;
  multiplier: number;
  label: string;
}

export interface SoulSacrificeResult {
  success: boolean;
  message: string;
  newLevel: number;
  restoredStreak: number;
  remainingSacrifices: number;
}
