'use client';

import React, { useState } from 'react';
import { Character, Quest, BossRaid, ShopItem } from '@/types/game';
import { mockCharacter, mockQuests, mockBoss, mockShopItems } from '@/lib/mock-data';
import { getSolitudeMultiplier, getRequiredXP, calculateBossDamage } from '@/lib/rpg-engine';
import { CharacterCard } from '@/components/character-card';
import { FeatTranslationBar } from '@/components/feat-translation-bar';
import { BossRaidCard } from '@/components/boss-raid';
import { QuestBoard } from '@/components/quest-board';
import { BlackMarket } from '@/components/black-market';
import { LevelUpModal } from '@/components/level-up-modal';

export default function HomePage() {
  const [character, setCharacter] = useState<Character>(mockCharacter);
  const [quests, setQuests] = useState<Quest[]>(mockQuests);
  const [boss, setBoss] = useState<BossRaid>(mockBoss);
  const [shopItems] = useState<ShopItem[]>(mockShopItems);

  // Level Up Modal state
  const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);
  const [newLevelAnnounced, setNewLevelAnnounced] = useState(character.level);

  // Solitude Multiplier
  const solitude = getSolitudeMultiplier();

  // Complete Quest Handler
  const handleCompleteQuest = (questId: string) => {
    const target = quests.find((q) => q.id === questId);
    if (!target || target.status === 'COMPLETED') return;

    // Apply Solitude multiplier if active
    const xpBonus = Math.round(target.xpReward * solitude.multiplier);
    const goldBonus = target.goldReward;

    // Update quest status
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: 'COMPLETED', completedAt: new Date().toISOString() } : q))
    );

    // Calculate Character XP and Level Up
    setCharacter((prev) => {
      let newXp = prev.currentXp + xpBonus;
      let newLevel = prev.level;
      let reqXp = prev.requiredXp;

      if (newXp >= reqXp) {
        newLevel += 1;
        newXp = newXp - reqXp;
        reqXp = getRequiredXP(newLevel);
        setNewLevelAnnounced(newLevel);
        setIsLevelUpOpen(true);
      }

      // Update matching attribute
      const attrKey = target.category;
      const currentAttr = prev.attributes[attrKey];
      const updatedAttrXp = currentAttr.currentXp + xpBonus;

      return {
        ...prev,
        level: newLevel,
        currentXp: newXp,
        requiredXp: reqXp,
        gold: prev.gold + goldBonus,
        attributes: {
          ...prev.attributes,
          [attrKey]: {
            ...currentAttr,
            currentXp: updatedAttrXp,
          },
        },
      };
    });

    // Damage Boss
    const strLevel = character.attributes.STR.level;
    const damage = calculateBossDamage(xpBonus, strLevel);
    setBoss((prev) => ({
      ...prev,
      currentHp: Math.max(0, prev.currentHp - damage),
      defeated: prev.currentHp - damage <= 0,
    }));
  };

  // Create Quest Handler
  const handleCreateQuest = (newQuestData: Partial<Quest>) => {
    const newQuest: Quest = {
      id: `q-${Date.now()}`,
      title: newQuestData.title || 'Untitled Bounty',
      description: newQuestData.description || '',
      category: newQuestData.category || 'INT',
      rank: newQuestData.rank || 'C',
      xpReward: newQuestData.xpReward || 40,
      goldReward: newQuestData.goldReward || 20,
      status: 'PENDING',
      isDaily: Boolean(newQuestData.isDaily),
      createdAt: new Date().toISOString(),
    };

    setQuests((prev) => [newQuest, ...prev]);
  };

  // Soul Sacrifice Handler (Section 9.1)
  const handleSoulSacrifice = () => {
    if (character.level < 2) {
      alert("You must be at least Level 2 to perform a Soul Sacrifice!");
      return;
    }
    if (character.sacrificesThisMonth >= 2) {
      alert("Maximum 2 Soul Sacrifices reached for this calendar month.");
      return;
    }

    const confirmSacrifice = window.confirm(
      "SOUL SACRIFICE WARNING:\nAre you sure you want to sacrifice 1 FULL Character Level to restore your streak intact?"
    );

    if (confirmSacrifice) {
      const demotedLevel = character.level - 1;
      setCharacter((prev) => ({
        ...prev,
        level: demotedLevel,
        requiredXp: getRequiredXP(demotedLevel),
        streakCount: prev.streakCount + 1,
        sacrificesThisMonth: prev.sacrificesThisMonth + 1,
      }));
      alert(`Soul Sacrifice accepted! Level demoted to ${demotedLevel}. Streak preserved intact!`);
    }
  };

  // Purchase Shop Item Handler
  const handlePurchaseItem = (item: ShopItem) => {
    if (character.gold < item.cost) {
      alert("Insufficient gold!");
      return;
    }
    setCharacter((prev) => ({
      ...prev,
      gold: prev.gold - item.cost,
    }));
    alert(`Acquired ${item.name}!`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Character Status Header Card */}
      <CharacterCard
        character={character}
        solitude={solitude}
        onSoulSacrifice={handleSoulSacrifice}
      />

      {/* 2. Real-World Feats & Power Translation Bar (Section 9.3) */}
      <FeatTranslationBar attributes={character.attributes} />

      {/* 3. Boss Raid Widget */}
      <BossRaidCard boss={boss} />

      {/* 4. Guild Quest Board (Full CRUD) */}
      <QuestBoard
        quests={quests}
        onCompleteQuest={handleCompleteQuest}
        onCreateQuest={handleCreateQuest}
      />

      {/* 5. Guild Black Market (Dual Economy) */}
      <BlackMarket
        items={shopItems}
        userGold={character.gold}
        onPurchaseItem={handlePurchaseItem}
      />

      {/* 6. Level Up Celebratory Modal */}
      <LevelUpModal
        isOpen={isLevelUpOpen}
        newLevel={newLevelAnnounced}
        onClose={() => setIsLevelUpOpen(false)}
      />
    </div>
  );
}
