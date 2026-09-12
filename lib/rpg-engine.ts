import { AttributeKey, QuestRank, SolitudeStatus } from '@/types/game';

/**
 * Non-Linear Leveling Curve
 * Level 1 -> 2: 100 XP
 * Level 2 -> 3: 283 XP
 * Level 5 -> 6: 1,118 XP
 * Level 9 -> 10: 2,700 XP
 */
export function getRequiredXP(level: number): number {
  return Math.floor(100 * Math.pow(Math.max(1, level), 1.5));
}

/**
 * Base rewards by Hunter Rank
 */
export function getRankRewards(rank: QuestRank): { xp: number; gold: number } {
  switch (rank) {
    case 'E': return { xp: 15, gold: 5 };
    case 'D': return { xp: 25, gold: 10 };
    case 'C': return { xp: 40, gold: 20 };
    case 'B': return { xp: 75, gold: 35 };
    case 'A': return { xp: 120, gold: 60 };
    case 'S': return { xp: 250, gold: 120 };
    default: return { xp: 20, gold: 10 };
  }
}

/**
 * Section 9.2: Solitude Concentration Multiplier (Off-Peak Focus)
 * Off-peak hours (11 PM - 6 AM) grant +50% XP
 */
export function getSolitudeMultiplier(currentHour: number = new Date().getHours()): SolitudeStatus {
  if (currentHour >= 23 || currentHour < 6) {
    return {
      isActive: true,
      multiplier: 1.5,
      label: "🌙 Solitude Concentration Active (+50% XP)"
    };
  }
  return {
    isActive: false,
    multiplier: 1.0,
    label: "☀️ Standard Guild Focus (1.0x XP)"
  };
}

/**
 * Boss Damage Calculator
 */
export function calculateBossDamage(baseXp: number, strLevel: number): number {
  const strBonus = 1 + (strLevel * 0.05); // +5% damage per STR level
  return Math.round(baseXp * strBonus);
}

/**
 * Section 9.3: Real-World Feat Translation Bar
 * Maps abstract attribute levels to tangible, badass real-world accomplishments
 */
export function getFeatDescription(attr: AttributeKey, level: number): string {
  switch (attr) {
    case 'STR':
      if (level < 3) return "Can bench bodyweight and hike 5km uphill without fatigue.";
      if (level < 7) return "Capable of benching 85kg; strikes with enough force to crack hardwood.";
      if (level < 15) return "Possesses Olympic-level core strength; immune to physical exhaustion.";
      return "Sufficient physical power to breach a brick wall with an unarmed strike.";

    case 'INT':
      if (level < 3) return "Can read 20 pages of technical documentation with clear retention.";
      if (level < 7) return "Capable of parsing 50 pages of complex docs in 15 mins; solves hard algorithms.";
      if (level < 15) return "Deep-work architect: architectures complex full-stack systems in a single flow.";
      return "Monarch of Logic: absorbs entire programming paradigms in an afternoon.";

    case 'VIT':
      if (level < 3) return "Consistently sleeps 7+ hours; drinks 2.5L water daily.";
      if (level < 7) return "High biological resilience: maintains peak energy without caffeine crash.";
      if (level < 15) return "Half-marathon stamina; impenetrable immune shield against seasonal burnout.";
      return "Immortal Vitality: operates at 100% biological efficiency with instant recovery.";

    case 'AGI':
      if (level < 3) return "Zero unread notifications; cleans up workspace in under 5 minutes.";
      if (level < 7) return "Lightning workflow: navigates IDE strictly with keyboard shortcuts.";
      if (level < 15) return "Completes routine errands in half the standard time with surgical speed.";
      return "Phantom Reflexes: eliminates mundane friction before it even registers.";

    case 'CHA':
      if (level < 3) return "Speaks clearly in team standups and actively listens to peers.";
      if (level < 7) return "Inspires team confidence; commands attention during major presentations.";
      if (level < 15) return "Master diplomat: negotiates high-stakes hackathon agreements effortlessly.";
      return "Presence of the Guild Master: entire rooms align to your vision upon entry.";

    default:
      return "Honorable Hunter of Aetheria.";
  }
}

/**
 * Section 9.1: Soul Sacrifice Validation
 * User sacrifices 1 Full Level to recover broken streak (Max 2 times per month)
 */
export function validateSoulSacrifice(level: number, sacrificesThisMonth: number): { valid: boolean; reason?: string } {
  if (level < 2) {
    return { valid: false, reason: "You must be at least Level 2 to perform a Soul Sacrifice." };
  }
  if (sacrificesThisMonth >= 2) {
    return { valid: false, reason: "Soul Sacrifice limit reached (Maximum 2 per calendar month)." };
  }
  return { valid: true };
}
