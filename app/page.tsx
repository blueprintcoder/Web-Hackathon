'use client';

import React, { useState, useEffect } from 'react';
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
  const [shopItems, setShopItems] = useState<ShopItem[]>(mockShopItems);
  const [loading, setLoading] = useState(true);

  // Level Up Modal state
  const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);
  const [newLevelAnnounced, setNewLevelAnnounced] = useState(character.level);

  // Solitude Multiplier
  const solitude = getSolitudeMultiplier();

  // 🔄 Fetch initial real data from Supabase Cloud DB APIs on mount
  useEffect(() => {
    async function loadCloudData() {
      try {
        // 1. Authenticate Demo Hunter
        const authRes = await fetch('/api/auth/demo', { method: 'POST' });
        const authData = await authRes.json();

        if (authData.success && authData.user) {
          const userId = authData.user.id;

          // 2. Fetch Character
          const charRes = await fetch(`/api/character?userId=${userId}`);
          const charData = await charRes.json();
          if (charData.success && charData.character) {
            setCharacter(charData.character);
          }

          // 3. Fetch Quests
          const questsRes = await fetch(`/api/quests?userId=${userId}`);
          const questsData = await questsRes.json();
          if (questsData.success && questsData.quests?.length > 0) {
            setQuests(questsData.quests);
          }

          // 4. Fetch Boss Raid
          const bossRes = await fetch('/api/boss');
          const bossData = await bossRes.json();
          if (bossData.success && bossData.boss) {
            setBoss(bossData.boss);
          }

          // 5. Fetch Shop Items
          const shopRes = await fetch(`/api/shop?userId=${userId}`);
          const shopData = await shopRes.json();
          if (shopData.success && shopData.items?.length > 0) {
            setShopItems(shopData.items);
          }
        }
      } catch (err) {
        console.warn('Falling back to initial mock state:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCloudData();
  }, []);

  // ⚔️ Complete Quest Handler (Syncs to Supabase)
  const handleCompleteQuest = async (questId: string) => {
    const target = quests.find((q) => q.id === questId);
    if (!target || target.status === 'COMPLETED') return;

    // Optimistic UI update
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: 'COMPLETED', completedAt: new Date().toISOString() } : q))
    );

    try {
      const res = await fetch(`/api/quests/${questId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' }),
      });
      const data = await res.json();

      if (data.success) {
        // Refetch latest character profile to update stats & level
        const charRes = await fetch(`/api/character?userId=${character.userId}`);
        const charData = await charRes.json();
        if (charData.success && charData.character) {
          setCharacter(charData.character);
        }

        if (data.levelUp) {
          setNewLevelAnnounced(data.character.level);
          setIsLevelUpOpen(true);
        }

        // Update Boss HP
        if (data.damageDealt) {
          setBoss((prev) => ({
            ...prev,
            currentHp: Math.max(0, prev.currentHp - data.damageDealt),
            defeated: prev.currentHp - data.damageDealt <= 0,
          }));
        }
      }
    } catch (err) {
      console.error('Failed to complete quest on backend:', err);
    }
  };

  // 📝 Create Quest Handler (Syncs to Supabase)
  const handleCreateQuest = async (newQuestData: Partial<Quest>) => {
    const tempId = `q-${Date.now()}`;
    const optimisticQuest: Quest = {
      id: tempId,
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

    setQuests((prev) => [optimisticQuest, ...prev]);

    try {
      const res = await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        setQuests((prev) => prev.map((q) => (q.id === tempId ? data.quest : q)));
      }
    } catch (err) {
      console.error('Failed to create quest on backend:', err);
    }
  };

  // 🔥 Soul Sacrifice Handler (Section 9.1 Syncs to Supabase)
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
      "SOUL SACRIFICE WARNING:\nAre you sure you want to sacrifice 1 FULL Character Level to restore your streak intact?"
    );

    if (confirmSacrifice) {
      try {
        const res = await fetch('/api/sacrifice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ characterId: character.id }),
        });
        const data = await res.json();

        if (data.success) {
          // Refetch character
          const charRes = await fetch(`/api/character?userId=${character.userId}`);
          const charData = await charRes.json();
          if (charData.success && charData.character) {
            setCharacter(charData.character);
          }
          alert(`Soul Sacrifice accepted! Level demoted to ${data.character.level}. Streak preserved intact on Cloud PostgreSQL!`);
        } else {
          alert(data.error || 'Failed to execute sacrifice');
        }
      } catch (err) {
        console.error('Soul sacrifice error:', err);
      }
    }
  };

  // 🛒 Purchase Shop Item Handler (Syncs to Supabase)
  const handlePurchaseItem = async (item: ShopItem) => {
    if (character.gold < item.cost) {
      alert("Insufficient gold!");
      return;
    }

    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, characterId: character.id }),
      });
      const data = await res.json();

      if (data.success) {
        setCharacter((prev) => ({
          ...prev,
          gold: data.character.gold,
        }));
        alert(`Acquired ${item.name}! Saved to your Supabase inventory.`);
      } else {
        alert(data.error || 'Purchase failed');
      }
    } catch (err) {
      console.error('Shop purchase error:', err);
    }
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
