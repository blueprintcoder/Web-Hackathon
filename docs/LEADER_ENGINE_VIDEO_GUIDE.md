# 👑 TEAM LEADER: GAME ENGINE, INTEGRATION & VIDEO GUIDE
**Role:** Systems Architect, Game Engine Developer, Cloud DevOps & Video Producer  
**Weightage:** ~30%  
**Sandbox:** `types/`, `lib/rpg-engine.ts`, `app/page.tsx`, `app/api/sacrifice/`, `app/api/boss/`, Vercel, Video

---

## 🎯 Your Mission
You lead the project from start to finish:
1. Provide the **Shared Contract (`types/game.ts`)** and **Launchpad** so Aniket and Yash never clash.
2. Build the **Advanced Game Engine & Section 9 Innovations** (`lib/rpg-engine.ts`, Soul Sacrifice, Solitude Multiplier).
3. Connect Aniket's UI to Yash's API in `app/page.tsx`.
4. Deploy to **Vercel** and verify **Zero Disqualification Bugs**.
5. Record and produce the **Strict 120-Second Walkthrough Video (<100MB)**.

---

## 🧠 1. The Game Engine (`lib/rpg-engine.ts`)

### Non-Linear Leveling Formula
```typescript
export function getRequiredXP(level: number): number {
  // Lvl 1 -> 2: 100 XP
  // Lvl 2 -> 3: 283 XP
  // Lvl 5 -> 6: 1,118 XP
  // Lvl 9 -> 10: 2,700 XP
  return Math.floor(100 * Math.pow(level, 1.5));
}
```

### Solitude Multiplier (Section 9.2 Off-Peak Grinding)
```typescript
export function getSolitudeMultiplier(currentHour: number = new Date().getHours()): { multiplier: number; label: string } {
  // Off-peak hours: 11:00 PM (23) to 6:00 AM (6)
  if (currentHour >= 23 || currentHour < 6) {
    return { multiplier: 1.5, label: "Solitude Concentration Active (+50% XP)" };
  }
  return { multiplier: 1.0, label: "Standard Dungeon Focus (1.0x XP)" };
}
```

### Soul Sacrifice Streak Reclaim (Section 9.1 Emergency Lifeline)
* Built in `app/api/sacrifice/route.ts`.
* If a user broke their streak yesterday:
  * Check character level: Must be $\ge 2$.
  * Check sacrifice count this month: Must be $< 2$ (anti-abuse rule).
  * Deduct 1 Full Level: `character.level -= 1`.
  * Restore active streak: `character.streakCount += 1`.
  * Increment `character.sacrificesThisMonth += 1`.

---

## 🎬 2. The 120-Second Video Script (Strictly Under 100MB)
The hackathon problem statement dictates:
* Must be **strictly between 90 and 180 seconds**.
* Must be **under 100 MB**.
* Must demonstrate:
  1. Signup / Login
  2. Adding and completing a task
  3. Leveling up process
  4. **A hard page refresh (`Ctrl+F5`) to prove database persistence**

### Step-by-Step Recording Plan:
* **0:00 – 0:20 (Login & Overview):** Click "Demo Hunter Login". Camera pans across the Hunter Status Bar (Level 1 Novice, 0 XP, 50 Gold, 3-Day Streak).
* **0:20 – 0:50 (Add & Complete Quest):** Click `+ New Quest`. Title: *"Implement Cloud Database"*, Category: *Intellect*, Rank: *B-Rank (50 XP, 25 Gold)*. Click Checkmark. Show floating `+50 XP`, sound chime, and Boss HP decreasing.
* **0:50 – 1:15 (Level Up Celebration):** Check off a second quest. XP bar fills, screen dims, celebratory modal pops up with confetti and fanfare! Show stat boost.
* **1:15 – 1:35 (CRUCIAL: Hard Page Refresh):** Press **Ctrl + F5**. Explicitly state: *"Notice that across hard browser refresh, all XP, Level 2 status, completed quest history, and Gold are fully retained from our PostgreSQL database."*
* **1:35 – 2:00 (Shop & Mobile View):** Open Guild Black Market, buy a Focus Relic with Gold. Show the Soul Sacrifice button. Switch to mobile developer view (F12) to show flawless responsiveness.

---

## 🚀 3. Deployment & Final Checklist
* [ ] Vercel deployment is live with green build status.
* [ ] Database connection works on production URL.
* [ ] GitHub repository has **15+ clean chronological commits**.
* [ ] Walkthrough video is uploaded as unlisted YouTube + linked in `README.md`.
* [ ] Submission finalized before 10:00 AM!
