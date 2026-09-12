import {
  AttributeKey,
  QuestRank,
  SolitudeStatus,
} from '@/types/game';

/**
 * ============================================================
 * LEVELING
 * ============================================================
 */

export function getRequiredXP(level: number): number {
  return Math.floor(
    100 * Math.pow(Math.max(1, level), 1.5)
  );
}

/**
 * ============================================================
 * RANK REWARDS
 * ============================================================
 */

export function getRankRewards(
  rank: QuestRank
): { xp: number; gold: number } {
  switch (rank) {
    case 'E':
      return { xp: 15, gold: 5 };

    case 'D':
      return { xp: 25, gold: 10 };

    case 'C':
      return { xp: 40, gold: 20 };

    case 'B':
      return { xp: 75, gold: 35 };

    case 'A':
      return { xp: 120, gold: 60 };

    case 'S':
      return { xp: 250, gold: 120 };

    default:
      return { xp: 20, gold: 10 };
  }
}

/**
 * ============================================================
 * SOLITUDE MULTIPLIER
 * ============================================================
 */

export function getSolitudeMultiplier(
  currentHour: number = new Date().getHours()
): SolitudeStatus {
  if (currentHour >= 23 || currentHour < 6) {
    return {
      isActive: true,
      multiplier: 1.5,
      label:
        '🌙 Solitude Concentration Active (+50% XP)',
    };
  }

  return {
    isActive: false,
    multiplier: 1.0,
    label:
      '☀️ Standard Guild Focus (1.0x XP)',
  };
}

/**
 * ============================================================
 * BOSS DAMAGE
 * ============================================================
 */

export function calculateBossDamage(
  baseXp: number,
  strLevel: number
): number {
  const strBonus =
    1 + strLevel * 0.05;

  return Math.round(
    baseXp * strBonus
  );
}

/**
 * ============================================================
 * REAL-WORLD FEAT TRANSLATION
 * ============================================================
 */

export function getFeatDescription(
  attr: AttributeKey,
  level: number
): string {
  switch (attr) {
    case 'STR':
      if (level < 3) {
        return 'Can bench bodyweight and hike 5km uphill without fatigue.';
      }

      if (level < 7) {
        return 'Capable of benching 85kg; strikes with enough force to crack hardwood.';
      }

      if (level < 15) {
        return 'Possesses Olympic-level core strength; immune to physical exhaustion.';
      }

      return 'Sufficient physical power to breach a brick wall with an unarmed strike.';

    case 'INT':
      if (level < 3) {
        return 'Can read 20 pages of technical documentation with clear retention.';
      }

      if (level < 7) {
        return 'Capable of parsing 50 pages of complex docs in 15 mins; solves hard algorithms.';
      }

      if (level < 15) {
        return 'Deep-work architect: architectures complex full-stack systems in a single flow.';
      }

      return 'Monarch of Logic: absorbs entire programming paradigms in an afternoon.';

    case 'VIT':
      if (level < 3) {
        return 'Consistently sleeps 7+ hours; drinks 2.5L water daily.';
      }

      if (level < 7) {
        return 'High biological resilience: maintains peak energy without caffeine crash.';
      }

      if (level < 15) {
        return 'Half-marathon stamina; impenetrable immune shield against seasonal burnout.';
      }

      return 'Immortal Vitality: operates at 100% biological efficiency with instant recovery.';

    case 'AGI':
      if (level < 3) {
        return 'Zero unread notifications; cleans up workspace in under 5 minutes.';
      }

      if (level < 7) {
        return 'Lightning workflow: navigates IDE strictly with keyboard shortcuts.';
      }

      if (level < 15) {
        return 'Completes routine errands in half the standard time with surgical speed.';
      }

      return 'Phantom Reflexes: eliminates mundane friction before it even registers.';

    case 'CHA':
      if (level < 3) {
        return 'Speaks clearly in team standups and actively listens to peers.';
      }

      if (level < 7) {
        return 'Inspires team confidence; commands attention during major presentations.';
      }

      if (level < 15) {
        return 'Master diplomat: negotiates high-stakes hackathon agreements effortlessly.';
      }

      return 'Presence of the Guild Master: entire rooms align to your vision upon entry.';

    default:
      return 'Honorable Hunter of Aetheria.';
  }
}

/**
 * ============================================================
 * SOUL SACRIFICE VALIDATION
 * ============================================================
 */

export function validateSoulSacrifice(
  level: number,
  sacrificesThisMonth: number
): {
  valid: boolean;
  reason?: string;
} {
  if (level < 2) {
    return {
      valid: false,
      reason:
        'You must be at least Level 2 to perform a Soul Sacrifice.',
    };
  }

  if (sacrificesThisMonth >= 2) {
    return {
      valid: false,
      reason:
        'Soul Sacrifice limit reached (Maximum 2 per calendar month).',
    };
  }

  return {
    valid: true,
  };
}

/**
 * ============================================================
 * STREAK SYSTEM
 * ============================================================
 */

/**
 * Returns a local calendar date in YYYY-MM-DD format.
 *
 * We deliberately use calendar days rather than comparing
 * milliseconds because:
 *
 * 11:59 PM Monday
 * and
 * 12:01 AM Tuesday
 *
 * should count as two different active days.
 */
export function getDayKey(
  date: Date = new Date()
): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Returns the number of calendar days between
 * two dates in local time.
 *
 * Example:
 *
 * Monday -> Monday = 0
 * Monday -> Tuesday = 1
 * Monday -> Wednesday = 2
 */
export function getCalendarDayDifference(
  from: string | Date,
  to: Date = new Date()
): number {
  const fromDate =
    typeof from === 'string'
      ? new Date(from)
      : from;

  if (Number.isNaN(fromDate.getTime())) {
    return Number.POSITIVE_INFINITY;
  }

  const fromKey = getDayKey(fromDate);
  const toKey = getDayKey(to);

  const [fromYear, fromMonth, fromDay] =
    fromKey.split('-').map(Number);

  const [toYear, toMonth, toDay] =
    toKey.split('-').map(Number);

  const fromUtc = Date.UTC(
    fromYear,
    fromMonth - 1,
    fromDay
  );

  const toUtc = Date.UTC(
    toYear,
    toMonth - 1,
    toDay
  );

  return Math.round(
    (toUtc - fromUtc) /
      (1000 * 60 * 60 * 24)
  );
}

/**
 * Current calendar month.
 *
 * Used later by Soul Sacrifice.
 */
export function getMonthKey(
  date: Date = new Date()
): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  return `${year}-${month}`;
}

/**
 * Result of evaluating the Hunter's streak.
 */
export interface StreakEvaluation {
  daysSinceActive: number;

  /**
   * Number of completely missed days.
   *
   * 0 = no missed day
   * 1 = exactly one missed day
   * 2+ = multiple missed days
   */
  missedDays: number;

  /**
   * Whether the current streak can continue.
   */
  canContinue: boolean;

  /**
   * Whether the streak should be considered broken.
   */
  shouldBreak: boolean;
}

/**
 * Evaluate streak state before a new quest completion.
 */
export function evaluateStreak(
  lastActiveDate: string,
  now: Date = new Date()
): StreakEvaluation {
  const daysSinceActive =
    getCalendarDayDifference(
      lastActiveDate,
      now
    );

  /**
   * Invalid/missing date:
   * treat it as a fresh start rather than
   * accidentally destroying the user's streak.
   */
  if (!Number.isFinite(daysSinceActive)) {
    return {
      daysSinceActive: 0,
      missedDays: 0,
      canContinue: true,
      shouldBreak: false,
    };
  }

  /**
   * Same calendar day.
   *
   * Completing multiple quests today must NOT
   * increase the streak multiple times.
   */
  if (daysSinceActive <= 0) {
    return {
      daysSinceActive: 0,
      missedDays: 0,
      canContinue: true,
      shouldBreak: false,
    };
  }

  /**
   * One day between activities.
   *
   * Example:
   *
   * Monday active
   * Tuesday missed
   * Wednesday active
   *
   * There is exactly one missed day.
   */
  if (daysSinceActive === 2) {
    return {
      daysSinceActive,
      missedDays: 1,
      canContinue: true,
      shouldBreak: false,
    };
  }

  /**
   * Consecutive calendar day.
   */
  if (daysSinceActive === 1) {
    return {
      daysSinceActive,
      missedDays: 0,
      canContinue: true,
      shouldBreak: false,
    };
  }

  /**
   * Two or more days have passed since the
   * previous active day.
   */
  return {
    daysSinceActive,
    missedDays:
      daysSinceActive - 1,
    canContinue: false,
    shouldBreak: true,
  };
}