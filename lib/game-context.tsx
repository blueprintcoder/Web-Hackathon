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

export interface CurrentUser {
  id: string;
  email: string;
}

interface GameContextValue {
  currentUser: CurrentUser | null;
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
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  handleLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  handleRegister: (email: string, pass: string, name: string) => Promise<{ success: boolean; error?: string }>;
  handleLogout: () => Promise<void>;
  handleQuickDemoLogin: () => Promise<void>;
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
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [character, setCharacter] = useState<Character>(mockCharacter);
  const [quests, setQuests] = useState<Quest[]>(mockQuests);
  const [boss, setBoss] = useState<BossRaid>(mockBoss);
  const [shopItems, setShopItems] = useState<ShopItem[]>(mockShopItems);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<GameViewTab>("quests");
  const [loading, setLoading] = useState(true);

  const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);
  const [newLevelAnnounced, setNewLevelAnnounced] = useState(mockCharacter.level);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const solitude = getSolitudeMultiplier();

  // Relic checks
  const equippedRelics = inventory.filter(
    (item) => item.equipped && item.item.type === "RELIC"
  );
  const hasFocusScroll = equippedRelics.some((item) => item.item.id === "item-1");
  const hasStreakShield = equippedRelics.some((item) => item.item.id === "item-2");
  const xpSurge = equippedRelics.find((item) => item.item.id === "item-3");
  const hasXpSurge = Boolean(xpSurge) && (xpSurge?.charges ?? 0) > 0;

  // Load user data helper
  const loadUserData = async (userId: string) => {
    try {
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

      if (charData.success && charData.character) {
        setCharacter(charData.character);
        setNewLevelAnnounced(charData.character.level);
      }

      if (questsData.success && questsData.quests) {
        setQuests(questsData.quests);
      }

      if (bossData.success && bossData.boss) {
        setBoss(bossData.boss);
      }

      if (shopData.success) {
        if (shopData.items?.length > 0) {
          setShopItems(shopData.items);
        }
        if (shopData.inventory) {
          setInventory(shopData.inventory);
        }
      }
    } catch (err) {
      console.warn("Error loading user data from backend:", err);
    }
  };

  // Initial session verification & cloud data load
  useEffect(() => {
    let cancelled = false;

    async function initSession() {
      try {
        // Check if there is an active session
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();

        let userId = "user-demo-judge";

        if (meData.success && meData.user) {
          if (!cancelled) {
            setCurrentUser({ id: meData.user.id, email: meData.user.email });
          }
          userId = meData.user.id;
        } else {
          // Initialize demo session
          const demoRes = await fetch("/api/auth/demo", { method: "POST" });
          const demoData = await demoRes.json();
          if (demoData.success && demoData.user) {
            if (!cancelled) {
              setCurrentUser({ id: demoData.user.id, email: demoData.user.email });
            }
            userId = demoData.user.id;
          }
        }

        if (!cancelled) {
          await loadUserData(userId);
        }
      } catch (error) {
        console.warn("Session init error, using local state.", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initSession();

    return () => {
      cancelled = true;
    };
  }, []);

  // AUTH: Login
  const handleLogin = async (email: string, pass: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser({ id: data.user.id, email: data.user.email });
        await loadUserData(data.user.id);
        return { success: true };
      }
      return { success: false, error: data.error || "Login failed" };
    } catch (e) {
      return { success: false, error: "Network error during login" };
    }
  };

  // AUTH: Register
  const handleRegister = async (email: string, pass: string, name: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass, hunterName: name }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser({ id: data.user.id, email: data.user.email });
        await loadUserData(data.user.id);
        return { success: true };
      }
      return { success: false, error: data.error || "Registration failed" };
    } catch (e) {
      return { success: false, error: "Network error during registration" };
    }
  };

  // AUTH: Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      // ignore
    }
    setCurrentUser(null);
    setIsAuthModalOpen(true);
  };

  // AUTH: 1-Click Judge Demo
  const handleQuickDemoLogin = async () => {
    try {
      const res = await fetch("/api/auth/demo", { method: "POST" });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser({ id: data.user.id, email: data.user.email });
        await loadUserData(data.user.id);
      }
    } catch (e) {
      console.warn("Demo login error:", e);
    }
  };

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
      console.warn("Backend quest completion fallback applied.", error);
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
    const targetUserId = currentUser?.id || character.userId || "user-demo-judge";

    const optimisticQuest: Quest = {
      id: tempId,
      userId: targetUserId,
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
          userId: targetUserId,
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
  const handleAttackBoss = async () => {
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

    try {
      await fetch("/api/boss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ damage }),
      });
    } catch (e) {
      // local optimistic already applied
    }
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
        body: JSON.stringify({
          characterId: character.id,
          userId: currentUser?.id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.character) {
          setCharacter(data.character);
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
      alert(`Insufficient gold! Item costs ${item.cost} 🪙, but you only have ${character.gold} 🪙.`);
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
          userId: currentUser?.id || character.userId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.character) {
          setCharacter((prev) => ({
            ...prev,
            gold: data.character.gold,
          }));
        }

        // CRITICAL FIX: Append the returned inventory item so it immediately appears in the Vault!
        if (data.inventory) {
          setInventory((prev) => [data.inventory, ...prev]);
        }

        alert(`Acquired ${item.name}! Added to your Hunter Vault.`);
        return;
      }

      alert(data.error || "Purchase failed.");
      return;
    } catch (error) {
      console.warn("Cloud shop error, falling back locally:", error);
    }

    // Local fallback
    if (
      item.type === "RELIC" &&
      inventory.some((inv) => inv.itemId === item.id)
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
      userId: character.userId || "user-demo-judge",
      itemId: item.id,
      item,
      equipped: item.type === "RELIC",
      acquiredAt: new Date().toISOString(),
      charges: item.id === "item-3" ? 3 : undefined,
    };

    setInventory((prev) => [newInventoryItem, ...prev]);
    alert(`Acquired ${item.name}! Added to your Hunter Vault.`);
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
    currentUser,
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
    isAuthModalOpen,
    setIsAuthModalOpen,
    handleLogin,
    handleRegister,
    handleLogout,
    handleQuickDemoLogin,
    handleCompleteQuest,
    handleCreateQuest,
    handlePurchaseItem,
    handleToggleEquip,
    handleSoulSacrifice,
    handleAttackBoss,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
