'use client';

import React, { useEffect, useState } from 'react';

import {
  Character,
  Quest,
  BossRaid,
  ShopItem,
  InventoryItem,
} from '@/types/game';

import {
  mockCharacter,
  mockQuests,
  mockBoss,
  mockShopItems,
} from '@/lib/mock-data';

import {
  getSolitudeMultiplier,
  getRequiredXP,
  getFeatDescription,
  calculateBossDamage,
} from '@/lib/rpg-engine';

import { CharacterCard } from '@/components/character-card';
import { FeatTranslationBar } from '@/components/feat-translation-bar';
import { BossRaidCard } from '@/components/boss-raid';
import { QuestBoard } from '@/components/quest-board';
import { BlackMarket } from '@/components/black-market';
import { Inventory } from '@/components/inventory';
import { LevelUpModal } from '@/components/level-up-modal';

export default function HomePage() {
  // ============================================================
  // CORE GAME STATE
  // ============================================================

  const [character, setCharacter] = useState<Character>(mockCharacter);
  const [quests, setQuests] = useState<Quest[]>(mockQuests);
  const [boss, setBoss] = useState<BossRaid>(mockBoss);
  const [shopItems, setShopItems] = useState<ShopItem[]>(mockShopItems);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const [loading, setLoading] = useState(true);

  // ============================================================
  // LEVEL UP MODAL
  // ============================================================

  const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);
  const [newLevelAnnounced, setNewLevelAnnounced] = useState(
    mockCharacter.level,
  );

  // ============================================================
  // SOLITUDE MULTIPLIER
  // ============================================================

  const solitude = getSolitudeMultiplier();

  // ============================================================
  // EQUIPPED RELIC EFFECTS
  // ============================================================

  const equippedRelics = inventory.filter(
    (item) => item.equipped && item.item.type === 'RELIC',
  );

  const hasFocusScroll = equippedRelics.some(
    (item) => item.item.id === 'item-1',
  );

  const hasStreakShield = equippedRelics.some(
    (item) => item.item.id === 'item-2',
  );

  const xpSurge = equippedRelics.find(
    (item) => item.item.id === 'item-3',
  );

  const hasXpSurge = Boolean(xpSurge) && (xpSurge?.charges ?? 0) > 0;

  // ============================================================
  // LOAD CLOUD DATA
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    async function loadCloudData() {
      try {
        const authRes = await fetch('/api/auth/demo', {
          method: 'POST',
        });

        const authData = await authRes.json();

        if (!authData.success || !authData.user) {
          return;
        }

        const userId = authData.user.id;

        const [charRes, questsRes, bossRes, shopRes] =
          await Promise.all([
            fetch(`/api/character?userId=${userId}`),
            fetch(`/api/quests?userId=${userId}`),
            fetch('/api/boss'),
            fetch(`/api/shop?userId=${userId}`),
          ]);

        const [charData, questsData, bossData, shopData] =
          await Promise.all([
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
        console.warn(
          'Cloud data unavailable. Using local/mock state.',
          error,
        );
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

  // ============================================================
  // COMPLETE QUEST
  // ============================================================

  const handleCompleteQuest = async (questId: string) => {
    const target = quests.find((q) => q.id === questId);

    if (!target || target.status === 'COMPLETED') {
      return;
    }

    // Optimistic quest completion.
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? {
              ...q,
              status: 'COMPLETED',
              completedAt: new Date().toISOString(),
            }
          : q,
      ),
    );

    // Try the cloud implementation first.
    try {
      const res = await fetch(`/api/quests/${questId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'COMPLETED',
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.character) {
          setCharacter(data.character);
        } else {
          const charRes = await fetch(
            `/api/character?userId=${character.userId}`,
          );
          const charData = await charRes.json();

          if (charData.success && charData.character) {
            setCharacter(charData.character);
          }
        }

        if (data.levelUp) {
          const level =
            data.character?.level ??
            character.level + 1;

          setNewLevelAnnounced(level);
          setIsLevelUpOpen(true);
        }

        if (data.damageDealt) {
          setBoss((prev) => ({
            ...prev,
            currentHp: Math.max(
              0,
              prev.currentHp - data.damageDealt,
            ),
            defeated:
              prev.currentHp - data.damageDealt <= 0,
          }));
        }

        // The backend owns XP/gold/attribute/streak changes.
        return;
      }
    } catch (error) {
      console.warn(
        'Backend quest completion failed. Applying local game logic.',
        error,
      );
    }

    // ============================================================
    // LOCAL FALLBACK / FRONTEND GAME LOGIC
    // ============================================================

    let xpMultiplier = solitude.multiplier;

    if (
      hasFocusScroll &&
      target.category === 'INT'
    ) {
      xpMultiplier *= 1.1;
    }

    if (hasXpSurge) {
      xpMultiplier *= 2;
    }

    const xpBonus = Math.round(
      target.xpReward * xpMultiplier,
    );

    const goldBonus = target.goldReward;

    setCharacter((prev) => {
      let newCharacterXp = prev.currentXp + xpBonus;
      let newCharacterLevel = prev.level;
      let newCharacterRequiredXp = prev.requiredXp;

      let levelUp = false;

      while (
        newCharacterXp >= newCharacterRequiredXp
      ) {
        newCharacterXp -= newCharacterRequiredXp;
        newCharacterLevel += 1;
        newCharacterRequiredXp =
          getRequiredXP(newCharacterLevel);
        levelUp = true;
      }

      if (levelUp) {
        setNewLevelAnnounced(newCharacterLevel);
        setIsLevelUpOpen(true);
      }

      const attributeKey = target.category;
      const currentAttribute =
        prev.attributes[attributeKey];

      let newAttributeXp =
        currentAttribute.currentXp + xpBonus;

      let newAttributeLevel =
        currentAttribute.level;

      let newAttributeRequiredXp =
        currentAttribute.requiredXp;

      while (
        newAttributeXp >=
        newAttributeRequiredXp
      ) {
        newAttributeXp -=
          newAttributeRequiredXp;

        newAttributeLevel += 1;

        newAttributeRequiredXp =
          getRequiredXP(newAttributeLevel);
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
            requiredXp:
              newAttributeRequiredXp,
            featDescription:
              getFeatDescription(
                attributeKey,
                newAttributeLevel,
              ),
          },
        },
      };
    });

    if (hasXpSurge && xpSurge) {
      setInventory((prev) =>
        prev.map((inventoryItem) => {
          if (
            inventoryItem.id !== xpSurge.id
          ) {
            return inventoryItem;
          }

          const remainingCharges = Math.max(
            0,
            (inventoryItem.charges ?? 0) - 1,
          );

          return {
            ...inventoryItem,
            charges: remainingCharges,
            equipped:
              remainingCharges > 0
                ? inventoryItem.equipped
                : false,
          };
        }),
      );
    }

    const strLevel =
      character.attributes.STR.level;

    const damage = calculateBossDamage(
      xpBonus,
      strLevel,
    );

    setBoss((prev) => {
      const newHp = Math.max(
        0,
        prev.currentHp - damage,
      );

      return {
        ...prev,
        currentHp: newHp,
        defeated: newHp <= 0,
      };
    });

    void hasStreakShield;
  };

  // ============================================================
  // CREATE QUEST
  // ============================================================

  const handleCreateQuest = async (
    newQuestData: Partial<Quest>,
  ) => {
    const tempId = `q-${Date.now()}`;

    const optimisticQuest: Quest = {
      id: tempId,
      userId: character.userId,
      title:
        newQuestData.title ||
        'Untitled Bounty',
      description:
        newQuestData.description || '',
      category:
        newQuestData.category || 'INT',
      rank:
        newQuestData.rank || 'C',
      xpReward:
        newQuestData.xpReward || 40,
      goldReward:
        newQuestData.goldReward || 20,
      status: 'PENDING',
      isDaily:
        Boolean(newQuestData.isDaily),
      createdAt:
        new Date().toISOString(),
    };

    setQuests((prev) => [
      optimisticQuest,
      ...prev,
    ]);

    try {
      const res = await fetch('/api/quests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
          prev.map((q) =>
            q.id === tempId
              ? data.quest
              : q,
          ),
        );
      }
    } catch (error) {
      console.error(
        'Failed to create quest on backend:',
        error,
      );
      // Keep optimistic quest locally.
    }
  };

  // ============================================================
  // SOUL SACRIFICE
  // ============================================================

  const handleSoulSacrifice = async () => {
    if (character.level < 2) {
      alert(
        'You must be at least Level 2 to perform a Soul Sacrifice!',
      );
      return;
    }

    if (
      character.sacrificesThisMonth >= 2
    ) {
      alert(
        'Maximum 2 Soul Sacrifices reached for this calendar month.',
      );
      return;
    }

    const confirmSacrifice =
      window.confirm(
        'SOUL SACRIFICE WARNING:\n\nAre you sure you want to sacrifice 1 FULL Character Level to restore your streak intact?',
      );

    if (!confirmSacrifice) {
      return;
    }

    try {
      const res = await fetch(
        '/api/sacrifice',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            characterId: character.id,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        if (data.character) {
          setCharacter(data.character);
        } else {
          const charRes = await fetch(
            `/api/character?userId=${character.userId}`,
          );
          const charData = await charRes.json();

          if (
            charData.success &&
            charData.character
          ) {
            setCharacter(charData.character);
          }
        }

        alert(
          `Soul Sacrifice accepted! Streak preserved on Cloud PostgreSQL.`,
        );

        return;
      }

      // If the endpoint exists but rejects the request,
      // don't silently overwrite the server's decision.
      alert(
        data.error ||
          'Failed to execute Soul Sacrifice.',
      );
      return;
    } catch (error) {
      console.warn(
        'Cloud Soul Sacrifice unavailable. Applying local fallback.',
        error,
      );
    }

    // Local fallback.
    const demotedLevel =
      character.level - 1;

    const restoredStreak =
      character.streakAtBreak ??
      character.streakCount ??
      character.bestStreak ??
      0;

    setCharacter((prev) => ({
      ...prev,
      level: demotedLevel,
      requiredXp:
        getRequiredXP(demotedLevel),
      currentXp: Math.min(
        prev.currentXp,
        Math.max(
          0,
          getRequiredXP(demotedLevel) - 1,
        ),
      ),
      streakCount: restoredStreak,
      streakBroken: false,
      streakAtBreak: undefined,
      sacrificesThisMonth:
        prev.sacrificesThisMonth + 1,
      lastActiveDate:
        new Date().toISOString(),
    }));

    alert(
      `Soul Sacrifice accepted! Level demoted to ${demotedLevel}. Streak preserved intact!`,
    );
  };

  // ============================================================
  // PURCHASE SHOP ITEM
  // ============================================================

  const handlePurchaseItem = async (
    item: ShopItem,
  ) => {
    if (character.gold < item.cost) {
      alert('Insufficient gold!');
      return;
    }

    // Cloud purchase first.
    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: item.id,
          characterId: character.id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.character) {
          setCharacter((prev) => ({
            ...prev,
            ...data.character,
          }));
        }

        alert(
          `Acquired ${item.name}! Saved to your Cloud inventory.`,
        );

        return;
      }

      alert(
        data.error ||
          'Purchase failed.',
      );
      return;
    } catch (error) {
      console.warn(
        'Cloud shop unavailable. Applying local purchase.',
        error,
      );
    }

    // Local fallback.
    if (
      item.type === 'RELIC' &&
      inventory.some(
        (inventoryItem) =>
          inventoryItem.itemId === item.id,
      )
    ) {
      alert(
        'You already own this relic.',
      );
      return;
    }

    setCharacter((prev) => ({
      ...prev,
      gold: prev.gold - item.cost,
    }));

    const newInventoryItem: InventoryItem = {
      id: `inventory-${Date.now()}-${item.id}`,
      userId:
        character.id || 'mock-user',
      itemId: item.id,
      item,
      equipped: false,
      acquiredAt:
        new Date().toISOString(),
      charges:
        item.id === 'item-3'
          ? 3
          : undefined,
    };

    setInventory((prev) => [
      newInventoryItem,
      ...prev,
    ]);
  };

  // ============================================================
  // EQUIP / UNEQUIP
  // ============================================================

  const handleToggleEquip = (
    inventoryId: string,
  ) => {
    setInventory((prev) =>
      prev.map((inventoryItem) =>
        inventoryItem.id === inventoryId
          ? {
              ...inventoryItem,
              equipped:
                !inventoryItem.equipped,
            }
          : inventoryItem,
      ),
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6">
      {loading && (
        <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-xs text-white/50">
          Synchronizing Hunter data...
        </div>
      )}

      {/* ======================================================
          1. CHARACTER STATUS
      ====================================================== */}

      <CharacterCard
        character={character}
        onSoulSacrifice={
          handleSoulSacrifice
        }
      />

      {/* ======================================================
          2. REAL-WORLD FEAT TRANSLATION
      ====================================================== */}

      <FeatTranslationBar
        attributes={
          character.attributes
        }
      />

      {/* ======================================================
          3. WEEKLY BOSS RAID
      ====================================================== */}

      <section
        id="weekly-boss"
        className="scroll-mt-24"
      >
        <div id="boss">
          <BossRaidCard boss={boss} />
        </div>
      </section>

      {/* ======================================================
          4. QUEST BOARD
      ====================================================== */}

      <section
        id="quests"
        className="scroll-mt-24"
      >
        <QuestBoard
          quests={quests}
          onCompleteQuest={
            handleCompleteQuest
          }
          onCreateQuest={
            handleCreateQuest
          }
        />
      </section>

      {/* ======================================================
          5. INVENTORY
      ====================================================== */}

      <section
        id="inventory"
        className="scroll-mt-24"
      >
        <Inventory
          items={inventory}
          onToggleEquip={
            handleToggleEquip
          }
        />
      </section>

      {/* ======================================================
          6. BLACK MARKET
      ====================================================== */}

      <section
        id="black-market"
        className="scroll-mt-24"
      >
        <div id="market">
          <BlackMarket
            items={shopItems}
            userGold={character.gold}
            onPurchaseItem={
              handlePurchaseItem
            }
          />
        </div>
      </section>

      {/* ======================================================
          7. LEVEL UP MODAL
      ====================================================== */}

      <LevelUpModal
        isOpen={isLevelUpOpen}
        newLevel={newLevelAnnounced}
        onClose={() =>
          setIsLevelUpOpen(false)
        }
      />
    </div>
  );
}