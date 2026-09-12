"use client";

import React from "react";
import { useGame } from "@/lib/game-context";
import { QuestBoard } from "@/components/quest-board";
import { BossRaidCard } from "@/components/boss-raid";
import { BlackMarket } from "@/components/black-market";
import { Inventory } from "@/components/inventory";
import { CharacterCard } from "@/components/character-card";
import { FeatTranslationBar } from "@/components/feat-translation-bar";
import { LevelUpModal } from "@/components/level-up-modal";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const {
    character,
    quests,
    boss,
    shopItems,
    inventory,
    activeTab,
    isLevelUpOpen,
    setIsLevelUpOpen,
    newLevelAnnounced,
    handleCompleteQuest,
    handleCreateQuest,
    handlePurchaseItem,
    handleToggleEquip,
    handleSoulSacrifice,
    handleAttackBoss,
  } = useGame();

  return (
    <div className="w-full">
      {/* Dynamic View Transition */}
      <AnimatePresence mode="wait">
        {activeTab === "quests" && (
          <motion.div
            key="quests"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <QuestBoard
              quests={quests}
              characterLevel={character.level}
              onCompleteQuest={handleCompleteQuest}
              onCreateQuest={handleCreateQuest}
            />
          </motion.div>
        )}

        {activeTab === "boss" && (
          <motion.div
            key="boss"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <BossRaidCard boss={boss} onAttackBoss={handleAttackBoss} />
          </motion.div>
        )}

        {activeTab === "shop" && (
          <motion.div
            key="shop"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <BlackMarket
              items={shopItems}
              userGold={character.gold}
              onPurchaseItem={handlePurchaseItem}
            />
          </motion.div>
        )}

        {activeTab === "inventory" && (
          <motion.div
            key="inventory"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <Inventory items={inventory} onToggleEquip={handleToggleEquip} />
          </motion.div>
        )}

        {activeTab === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="space-y-6"
          >
            <CharacterCard
              character={character}
              onSoulSacrifice={handleSoulSacrifice}
            />
            <FeatTranslationBar attributes={character.attributes} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Celebration Modal */}
      <LevelUpModal
        isOpen={isLevelUpOpen}
        newLevel={newLevelAnnounced}
        onClose={() => setIsLevelUpOpen(false)}
      />
    </div>
  );
}