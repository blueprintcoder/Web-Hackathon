'use client';

import React, { useState } from 'react';

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

  const [character, setCharacter] =
    useState<Character>(mockCharacter);

  const [quests, setQuests] =
    useState<Quest[]>(mockQuests);

  const [boss, setBoss] =
    useState<BossRaid>(mockBoss);

  const [shopItems] =
    useState<ShopItem[]>(mockShopItems);

  // ============================================================
  // INVENTORY STATE
  // ============================================================

  const [inventory, setInventory] =
    useState<InventoryItem[]>([]);

  // ============================================================
  // LEVEL UP MODAL
  // ============================================================

  const [isLevelUpOpen, setIsLevelUpOpen] =
    useState(false);

  const [newLevelAnnounced, setNewLevelAnnounced] =
    useState(character.level);

  // ============================================================
  // SOLITUDE MULTIPLIER
  // ============================================================

  const solitude =
    getSolitudeMultiplier();

  // ============================================================
  // EQUIPPED RELIC EFFECTS
  // ============================================================

  const equippedRelics =
    inventory.filter(
      (item) =>
        item.equipped &&
        item.item.type === 'RELIC'
    );

  // ------------------------------------------------------------
  // Scroll of Focus
  // +10% INT XP
  // ------------------------------------------------------------

  const hasFocusScroll =
    equippedRelics.some(
      (item) =>
        item.item.id === 'item-1'
    );

  // ------------------------------------------------------------
  // Aegis Streak Shield
  // ------------------------------------------------------------

  const hasStreakShield =
    equippedRelics.some(
      (item) =>
        item.item.id === 'item-2'
    );

  // ------------------------------------------------------------
  // XP Surge Elixir
  // 2x XP for remaining charges
  // ------------------------------------------------------------

  const xpSurge =
    equippedRelics.find(
      (item) =>
        item.item.id === 'item-3'
    );

  const hasXpSurge =
    Boolean(xpSurge) &&
    (xpSurge?.charges ?? 0) > 0;

  // Aegis will be connected to the streak
  // system when daily streak validation is implemented.
  void hasStreakShield;

  // ============================================================
  // COMPLETE QUEST
  // ============================================================

  const handleCompleteQuest =
    (questId: string) => {
      const target =
        quests.find(
          (q) => q.id === questId
        );

      if (
        !target ||
        target.status === 'COMPLETED'
      ) {
        return;
      }

      // ========================================================
      // CALCULATE FINAL QUEST XP
      // ========================================================

      let xpMultiplier =
        solitude.multiplier;

      // Scroll of Focus
      // +10% INT XP
      if (
        hasFocusScroll &&
        target.category === 'INT'
      ) {
        xpMultiplier *= 1.10;
      }

      // XP Surge Elixir
      // 2x XP
      if (hasXpSurge) {
        xpMultiplier *= 2;
      }

      const xpBonus =
        Math.round(
          target.xpReward *
            xpMultiplier
        );

      const goldBonus =
        target.goldReward;

      // ========================================================
      // UPDATE QUEST STATUS
      // ========================================================

      setQuests((prev) =>
        prev.map((q) =>
          q.id === questId
            ? {
                ...q,
                status: 'COMPLETED',
                completedAt:
                  new Date().toISOString(),
              }
            : q
        )
      );

      // ========================================================
      // UPDATE CHARACTER + ATTRIBUTE
      // ========================================================

      setCharacter((prev) => {
        // ------------------------------------------------------
        // CHARACTER XP
        // ------------------------------------------------------

        let newCharacterXp =
          prev.currentXp +
          xpBonus;

        let newCharacterLevel =
          prev.level;

        let newCharacterRequiredXp =
          prev.requiredXp;

        // ------------------------------------------------------
        // CHARACTER LEVEL UP
        // ------------------------------------------------------

        if (
          newCharacterXp >=
          newCharacterRequiredXp
        ) {
          newCharacterLevel += 1;

          newCharacterXp -=
            newCharacterRequiredXp;

          newCharacterRequiredXp =
            getRequiredXP(
              newCharacterLevel
            );

          setNewLevelAnnounced(
            newCharacterLevel
          );

          setIsLevelUpOpen(
            true
          );
        }

        // ------------------------------------------------------
        // ATTRIBUTE XP
        // ------------------------------------------------------

        const attributeKey =
          target.category;

        const currentAttribute =
          prev.attributes[
            attributeKey
          ];

        let newAttributeXp =
          currentAttribute.currentXp +
          xpBonus;

        let newAttributeLevel =
          currentAttribute.level;

        let newAttributeRequiredXp =
          currentAttribute.requiredXp;

        // ------------------------------------------------------
        // ATTRIBUTE LEVEL UP
        // ------------------------------------------------------

        if (
          newAttributeXp >=
          newAttributeRequiredXp
        ) {
          newAttributeLevel += 1;

          newAttributeXp -=
            newAttributeRequiredXp;

          newAttributeRequiredXp =
            getRequiredXP(
              newAttributeLevel
            );
        }

        // ------------------------------------------------------
        // UPDATE FEAT DESCRIPTION
        // ------------------------------------------------------

        const newFeatDescription =
          getFeatDescription(
            attributeKey,
            newAttributeLevel
          );

        // ------------------------------------------------------
        // RETURN UPDATED CHARACTER
        // ------------------------------------------------------

        return {
          ...prev,

          level:
            newCharacterLevel,

          currentXp:
            newCharacterXp,

          requiredXp:
            newCharacterRequiredXp,

          gold:
            prev.gold +
            goldBonus,

          attributes: {
            ...prev.attributes,

            [attributeKey]: {
              ...currentAttribute,

              level:
                newAttributeLevel,

              currentXp:
                newAttributeXp,

              requiredXp:
                newAttributeRequiredXp,

              featDescription:
                newFeatDescription,
            },
          },
        };
      });

      // ========================================================
      // CONSUME XP SURGE CHARGE
      // ========================================================

      if (
        hasXpSurge &&
        xpSurge
      ) {
        setInventory((prev) =>
          prev.map(
            (inventoryItem) => {
              if (
                inventoryItem.id !==
                xpSurge.id
              ) {
                return inventoryItem;
              }

              const remainingCharges =
                Math.max(
                  0,
                  (inventoryItem.charges ??
                    0) - 1
                );

              return {
                ...inventoryItem,

                charges:
                  remainingCharges,

                equipped:
                  remainingCharges >
                  0
                    ? inventoryItem.equipped
                    : false,
              };
            }
          )
        );
      }

      // ========================================================
      // BOSS DAMAGE
      // ========================================================

      const strLevel =
        character.attributes.STR.level;

      const damage =
        calculateBossDamage(
          xpBonus,
          strLevel
        );

      setBoss((prev) => {
        const newHp =
          Math.max(
            0,
            prev.currentHp -
              damage
          );

        return {
          ...prev,

          currentHp:
            newHp,

          defeated:
            newHp <= 0,
        };
      });
    };

  // ============================================================
  // CREATE QUEST
  // ============================================================

  const handleCreateQuest =
    (
      newQuestData: Partial<Quest>
    ) => {
      const newQuest: Quest = {
        id:
          `q-${Date.now()}`,

        title:
          newQuestData.title ||
          'Untitled Bounty',

        description:
          newQuestData.description ||
          '',

        category:
          newQuestData.category ||
          'INT',

        rank:
          newQuestData.rank ||
          'C',

        xpReward:
          newQuestData.xpReward ||
          40,

        goldReward:
          newQuestData.goldReward ||
          20,

        status:
          'PENDING',

        isDaily:
          Boolean(
            newQuestData.isDaily
          ),

        createdAt:
          new Date().toISOString(),
      };

      setQuests((prev) => [
        newQuest,
        ...prev,
      ]);
    };

  // ============================================================
  // SOUL SACRIFICE
  // ============================================================

  const handleSoulSacrifice =
    () => {
      if (
        character.level < 2
      ) {
        alert(
          'You must be at least Level 2 to perform a Soul Sacrifice!'
        );

        return;
      }

      if (
        character.sacrificesThisMonth >=
        2
      ) {
        alert(
          'Maximum 2 Soul Sacrifices reached for this calendar month.'
        );

        return;
      }

      const confirmSacrifice =
        window.confirm(
          'SOUL SACRIFICE WARNING:\n\nAre you sure you want to sacrifice 1 FULL Character Level to restore your streak intact?'
        );

      if (
        !confirmSacrifice
      ) {
        return;
      }

      const demotedLevel =
        character.level - 1;

      setCharacter((prev) => ({
        ...prev,

        level:
          demotedLevel,

        requiredXp:
          getRequiredXP(
            demotedLevel
          ),

        streakCount:
          prev.streakCount + 1,

        sacrificesThisMonth:
          prev.sacrificesThisMonth +
          1,
      }));

      alert(
        `Soul Sacrifice accepted! Level demoted to ${demotedLevel}. Streak preserved intact!`
      );
    };

  // ============================================================
  // PURCHASE SHOP ITEM
  // ============================================================

  const handlePurchaseItem =
    (item: ShopItem) => {
      // Insufficient gold
      if (
        character.gold <
        item.cost
      ) {
        return;
      }

      // Prevent duplicate relic ownership
      if (
        item.type === 'RELIC' &&
        inventory.some(
          (inventoryItem) =>
            inventoryItem.itemId ===
            item.id
        )
      ) {
        return;
      }

      // Deduct gold
      setCharacter((prev) => ({
        ...prev,

        gold:
          prev.gold -
          item.cost,
      }));

      // Create inventory item
      const newInventoryItem:
        InventoryItem = {
          id:
            `inventory-${Date.now()}-${item.id}`,

          userId:
            character.id ||
            'mock-user',

          itemId:
            item.id,

          item,

          equipped:
            false,

          acquiredAt:
            new Date().toISOString(),

          // XP Surge Elixir
          // starts with 3 charges.
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

  const handleToggleEquip =
    (
      inventoryId: string
    ) => {
      setInventory((prev) =>
        prev.map(
          (inventoryItem) =>
            inventoryItem.id ===
            inventoryId
              ? {
                  ...inventoryItem,

                  equipped:
                    !inventoryItem.equipped,
                }
              : inventoryItem
        )
      );
    };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6">

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

      <BossRaidCard
        boss={boss}
      />

      {/* ======================================================
          4. QUEST BOARD
      ====================================================== */}

      <QuestBoard
        quests={quests}
        onCompleteQuest={
          handleCompleteQuest
        }
        onCreateQuest={
          handleCreateQuest
        }
      />

      {/* ======================================================
          5. INVENTORY
      ====================================================== */}

      <Inventory
        items={inventory}
        onToggleEquip={
          handleToggleEquip
        }
      />

      {/* ======================================================
          6. BLACK MARKET
      ====================================================== */}

      <BlackMarket
        items={shopItems}
        userGold={
          character.gold
        }
        onPurchaseItem={
          handlePurchaseItem
        }
      />

      {/* ======================================================
          7. LEVEL UP MODAL
      ====================================================== */}

      <LevelUpModal
        isOpen={
          isLevelUpOpen
        }
        newLevel={
          newLevelAnnounced
        }
        onClose={() =>
          setIsLevelUpOpen(false)
        }
      />

    </div>
  );
}