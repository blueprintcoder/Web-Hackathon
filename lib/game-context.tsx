"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Character,
  Quest,
  BossRaid,
  ShopItem,
  InventoryItem,
} from "@/types/game";
import {
  mockCharacter,
  mockQuests,
  mockBoss,
  mockShopItems,
} from "@/lib/mock-data";
import {
  getSolitudeMultiplier,
  getRequiredXP,
  getFeatDescription,
  calculateBossDamage,
} from "@/lib/rpg-engine";
import { playSfx } from "@/lib/audio";

export type GameViewTab = "quests" | "boss" | "shop" | "inventory" | "profile";

interface GameContextValue {
  character: Character;
  quests: Quest[];
  boss: BossRaid;
  shopItems: ShopItem[];
  inventory: InventoryItem[];
  activeTab: GameViewTab;
  setActiveTab: (tab: GameViewTab) => void;
  loading: boolean;
  solitude: ReturnType<typeof getSolitudeMultiplier>;
  isLevelUpOpen: boolean;
  setIsLevelUpOpen: (open: boolean) => void;
  newLevelAnnounced: number;
  handleCompleteQuest: (questId: string) => Promise<void>;
  handleCreateQuest: (newQuestData: Partial<Quest>) => Promise<void>;
  handlePurchaseItem: (item: ShopItem) => Promise<void>;
  handleToggleEquip: (inventoryId: string) => void;
  handleSoulSacrifice: () => Promise<void>;
  handleAttackBoss: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return ctx;
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [character, setCharacter] = useState<Character>(mockCharacter);
  const [quests, setQuests] = useState<Quest[]>(mockQuests);
  const [boss, setBoss] = useState<BossRaid>(mockBoss);
  const [shopItems, setShopItems] = useState<ShopItem[]>(mockShopItems);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<GameViewTab>("quests");
  const [loading, setLoading] = useState(true);

  const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);
  const [newLevelAnnounced, setNewLevelAnnounced] = useState(mockCharacter.level);

  const solitude = getSolitudeMultiplier();

  // Relic checks
  const equippedRelics = inventory.filter(
    (item) => item.equipped && item.item.type === "RELIC"
  );
  const hasFocusScroll = equippedRelics.some((item) => item.item.id === "item-1");
  const hasStreakShield = equippedRelics.some((item) => item.item.id === "item-2");
  const xpSurge = equippedRelics.find((item) => item.item.id === "item-3");
  const hasXpSurge = Boolean(xpSurge) && (xpSurge?.charges ?? 0) > 0;

  // Load cloud data
  useEffect(() => {
    let cancelled = false;

    async function loadCloudData() {
      try {
        const authRes = await fetch("/api/auth/demo", { method: "POST" });
        const authData = await authRes.json();

        if (!authData.success || !authData.user) return;
        const userId = authData.user.id;

        const [charRes, questsRes, bossRes, shopRes] = await Promise.all([
          fetch(`/api/character?userId=${userId}`),
          fetch(`/api/quests?userId=${userId}`),
          fetch("/api/boss"),
          fetch(`/api/shop?userId=${userId}`),
        ]);

        const [charData, questsData, bossData, shopData] = await Promise.all([
          charRes.json(),
          questsRes.json(),
          bossRes.json(),
          shopRes.json(),
        ]);

        if (cancelled) return;

        if (charData.success && charData.character) {
          setCharacter(charData.character);
          setNewLevelAnnounced(charData.character.level);
        }

        if (questsData.success && questsData.quests?.length > 0) {
          setQuests(questsData.quests);
        }

        if (bossData.success && bossData.boss) {
          setBoss(bossData.boss);
        }

        if (shopData.success && shopData.items?.length > 0) {
          setShopItems(shopData.items);
        }
      } catch (error) {
        console.warn("Cloud data unavailable. Using local state.", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCloudData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Complete Quest
  const handleCompleteQuest = async (questId: string) => {
    const target = quests.find((q) => q.id === questId);
    if (!target || target.status === "COMPLETED") return;

    playSfx("complete");
    playSfx("coin");

    // Optimistic completion
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? { ...q, status: "COMPLETED", completedAt: new Date().toISOString() }
          : q
      )
    );

    try {
      const res = await fetch(`/api/quests/${questId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.character) {
          setCharacter(data.character);
        } else {
          const charRes = await fetch(`/api/character?userId=${character.userId}`);
          const charData = await charRes.json();
          if (charData.success && charData.character) {
            setCharacter(charData.character);
          }
        }

        if (data.levelUp) {
          playSfx("levelup");
          const lvl = data.character?.level ?? character.level + 1;
          setNewLevelAnnounced(lvl);
          setIsLevelUpOpen(true);
        }

        if (data.damageDealt) {
          setBoss((prev) => ({
            ...prev,
            currentHp: Math.max(0, prev.currentHp - data.damageDealt),
            defeated: prev.currentHp - data.damageDealt <= 0,
          }));
        }

        return;
      }
    } catch (error) {
      console.warn("Backend quest completion failed, falling back locally.", error);
    }

    // Local calculation fallback
    let xpMultiplier = solitude.multiplier;
    if (hasFocusScroll && target.category === "INT") xpMultiplier *= 1.1;
    if (hasXpSurge) xpMultiplier *= 2;

    const xpBonus = Math.round(target.xpReward * xpMultiplier);
    const goldBonus = target.goldReward;

    setCharacter((prev) => {
      let newCharacterXp = prev.currentXp + xpBonus;
      let newCharacterLevel = prev.level;
      let newCharacterRequiredXp = prev.requiredXp;
      let levelUp = false;

      while (newCharacterXp >= newCharacterRequiredXp) {
        newCharacterXp -= newCharacterRequiredXp;
        newCharacterLevel += 1;
        newCharacterRequiredXp = getRequiredXP(newCharacterLevel);
        levelUp = true;
      }

      if (levelUp) {
        playSfx("levelup");
        setNewLevelAnnounced(newCharacterLevel);
        setIsLevelUpOpen(true);
      }

      const attributeKey = target.category;
      const currentAttribute = prev.attributes[attributeKey];
      let newAttributeXp = currentAttribute.currentXp + xpBonus;
      let newAttributeLevel = currentAttribute.level;
      let newAttributeRequiredXp = currentAttribute.requiredXp;

      while (newAttributeXp >= newAttributeRequiredXp) {
        newAttributeXp -= newAttributeRequiredXp;
        newAttributeLevel += 1;
        newAttributeRequiredXp = getRequiredXP(newAttributeLevel);
      }

      return {
        ...prev,
        level: newCharacterLevel,
        currentXp: newCharacterXp,
        requiredXp: newCharacterRequiredXp,
        gold: prev.gold + goldBonus,
        attributes: {
          ...prev.attributes,
          [attributeKey]: {
            ...currentAttribute,
            level: newAttributeLevel,
            currentXp: newAttributeXp,
            requiredXp: newAttributeRequiredXp,
            featDescription: getFeatDescription(attributeKey, newAttributeLevel),
          },
        },
      };
    });

    const strLevel = character.attributes.STR.level;
    const damage = calculateBossDamage(xpBonus, strLevel);

    setBoss((prev) => {
      const newHp = Math.max(0, prev.currentHp - damage);
      return {
        ...prev,
        currentHp: newHp,
        defeated: newHp <= 0,
      };
    });

    void hasStreakShield;
  };

  // Create Quest
  const handleCreateQuest = async (newQuestData: Partial<Quest>) => {
    const tempId = `q-${Date.now()}`;
    const optimisticQuest: Quest = {
      id: tempId,
      userId: character.userId,
      title: newQuestData.title || "Untitled Bounty",
      description: newQuestData.description || "",
      category: newQuestData.category || "INT",
      rank: newQuestData.rank || "C",
      xpReward: newQuestData.xpReward || 40,
      goldReward: newQuestData.goldReward || 20,
      status: "PENDING",
      isDaily: Boolean(newQuestData.isDaily),
      createdAt: new Date().toISOString(),
    };

    setQuests((prev) => [optimisticQuest, ...prev]);

    try {
      const res = await fetch("/api/quests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newQuestData.title,
          description: newQuestData.description,
          category: newQuestData.category,
          rank: newQuestData.rank,
          isDaily: newQuestData.isDaily,
          userId: character.userId,
        }),
      });

      const data = await res.json();
      if (data.success && data.quest) {
        setQuests((prev) =>
          prev.map((q) => (q.id === tempId ? data.quest : q))
        );
      }
    } catch (error) {
      console.error("Failed to create quest on backend:", error);
    }
  };

  // Direct Boss Attack
  const handleAttackBoss = () => {
    if (boss.defeated) return;
    playSfx("attack");
    playSfx("roar");

    const damage = Math.max(25, character.attributes.STR.level * 15);
    setBoss((prev) => {
      const newHp = Math.max(0, prev.currentHp - damage);
      return {
        ...prev,
        currentHp: newHp,
        defeated: newHp <= 0,
      };
    });
  };

  // Soul Sacrifice
  const handleSoulSacrifice = async () => {
    if (character.level < 2) {
      alert("You must be at least Level 2 to perform a Soul Sacrifice!");
      return;
    }

    if (character.sacrificesThisMonth >= 2) {
      alert("Maximum 2 Soul Sacrifices reached for this calendar month.");
      return;
    }

    const confirmSacrifice = window.confirm(
      "SOUL SACRIFICE PROTOCOL:\n\nAre you sure you want to sacrifice 1 Character Level to instantly restore your lost streak?"
    );

    if (!confirmSacrifice) return;

    try {
      const res = await fetch("/api/sacrifice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId: character.id }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.character) {
          setCharacter(data.character);
        } else {
          const charRes = await fetch(`/api/character?userId=${character.userId}`);
          const charData = await charRes.json();
          if (charData.success && charData.character) {
            setCharacter(charData.character);
          }
        }
        alert("Soul Sacrifice accepted! Streak preserved intact.");
        return;
      }
      alert(data.error || "Failed to execute Soul Sacrifice.");
      return;
    } catch (error) {
      console.warn("Cloud Soul Sacrifice fallback applied.", error);
    }

    // Local fallback
    const demotedLevel = character.level - 1;
    const restoredStreak =
      character.streakAtBreak ??
      character.streakCount ??
      character.bestStreak ??
      0;

    setCharacter((prev) => ({
      ...prev,
      level: demotedLevel,
      requiredXp: getRequiredXP(demotedLevel),
      currentXp: Math.min(prev.currentXp, Math.max(0, getRequiredXP(demotedLevel) - 1)),
      streakCount: restoredStreak,
      streakBroken: false,
      streakAtBreak: undefined,
      sacrificesThisMonth: prev.sacrificesThisMonth + 1,
      lastActiveDate: new Date().toISOString(),
    }));

    alert(`Soul Sacrifice accepted! Level demoted to ${demotedLevel}. Streak preserved!`);
  };

  // Purchase Shop Item
  const handlePurchaseItem = async (item: ShopItem) => {
    if (character.gold < item.cost) {
      alert("Insufficient gold! Complete more quests to earn gold.");
      return;
    }

    playSfx("coin");

    try {
      const res = await fetch("/api/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          characterId: character.id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.character) {
          setCharacter((prev) => ({ ...prev, ...data.character }));
        }
        alert(`Acquired ${item.name}! Added to your inventory.`);
        return;
      }
      alert(data.error || "Purchase failed.");
      return;
    } catch (error) {
      console.warn("Cloud shop unavailable. Local purchase applied.", error);
    }

    // Local fallback
    if (
      item.type === "RELIC" &&
      inventory.some((inventoryItem) => inventoryItem.itemId === item.id)
    ) {
      alert("You already own this relic.");
      return;
    }

    setCharacter((prev) => ({
      ...prev,
      gold: prev.gold - item.cost,
    }));

    const newInventoryItem: InventoryItem = {
      id: `inventory-${Date.now()}-${item.id}`,
      userId: character.id || "mock-user",
      itemId: item.id,
      item,
      equipped: false,
      acquiredAt: new Date().toISOString(),
      charges: item.id === "item-3" ? 3 : undefined,
    };

    setInventory((prev) => [newInventoryItem, ...prev]);
  };

  // Toggle Equip Item
  const handleToggleEquip = (inventoryId: string) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === inventoryId ? { ...item, equipped: !item.equipped } : item
      )
    );
  };

  const value: GameContextValue = {
    character,
    quests,
    boss,
    shopItems,
    inventory,
    activeTab,
    setActiveTab,
    loading,
    solitude,
    isLevelUpOpen,
    setIsLevelUpOpen,
    newLevelAnnounced,
    handleCompleteQuest,
    handleCreateQuest,
    handlePurchaseItem,
    handleToggleEquip,
    handleSoulSacrifice,
    handleAttackBoss,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
