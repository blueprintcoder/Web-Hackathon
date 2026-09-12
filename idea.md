# AETHERIA: THE HUNTER'S PROTOCOL
## Full-Stack "Life RPG" Hackathon Master Plan & Strategy
**Target:** Web Hackathon 2026 | **Concept:** Gamified Habit RPG | **Tech Stack:** Next.js 15 + PostgreSQL + Framer Motion

---

> [!CAUTION]
> **CRITICAL JUDGING WARNING:** Submissions relying solely on `localStorage`, broken live links, runtime crashes, single-commit dumps, or walkthrough videos outside 90–180 seconds (>100MB) receive an **AUTOMATIC ZERO**. Our plan strictly prevents all disqualification triggers.

---

## 1. Core Vision & Thematic Direction

Standard productivity tools and to-do lists suffer from the **"delayed gratification"** trap: studying, going to the gym, or coding takes weeks or months to yield visible results. Video games solve this problem through **instant dopamine loops, clear progression, and tangible rewards**.

### The Chosen Theme: Solo Leveling / Dark Fantasy Guild
Judges penalize generic Bootstrap / enterprise SaaS dashboards. The app needs an immersive identity:
- **Aesthetic:** Dark slate surfaces (`#0B0F17`), glowing amber gold and mana cyan accents, pixel-art emblems, and clean typography.
- **Thematic Vocabulary:**
  - Tasks $\rightarrow$ **Quests & Bounties** (Ranked E-Rank to S-Rank)
  - Points $\rightarrow$ **Gold & Mana Crystals**
  - Habits $\rightarrow$ **Daily Rites & Streaks**
  - Rewards $\rightarrow$ **Guild Black Market**
- **Alive & Tactile Feel:**
  - Integrated 8-bit/fantasy sound effects (blade swing, coin chime, fanfare) with a master mute toggle.
  - Floating `+75 XP` and `+15 Gold` spring animations flying towards the status bar on completion.
  - Celebratory Level-Up modal with confetti bursts.
- **Zero-Lag UX:**
  - Optimistic UI updates (checkmarks respond in 0ms; backend syncs asynchronously).
  - Clean loading skeletons and zero white-screen flashes.

---

## 2. Technical Architecture & Technology Stack

| Layer | Choice | Why It Wins / Evaluation Impact |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 15 (App Router, React 19, TypeScript)** | Server-side rendering for SEO, fast API routes, unified code structure, instant deployment on Vercel. |
| **Styling & Components** | **Tailwind CSS + shadcn/ui + Lucide Icons** | Polished dark mode, accessible Radix UI primitives with built-in keyboard navigation (`Tab`, `Enter`, `Space`). |
| **State & Animations** | **Framer Motion + Canvas-Confetti** | High-polish tactile interactions, XP spring animations, celebratory modals. |
| **Database & ORM** | **PostgreSQL (Supabase / Neon) + Prisma** | **100% Real Database Persistence** across hard refreshes and devices. Relational integrity for user data isolation. |
| **Authentication** | **NextAuth (Auth.js) or Supabase Auth** | Secure session cookies, password hashing, and a 1-click "Guest Hunter Demo" button for judges. |
| **Audio Engine** | **Web Audio API / Howler.js** | Lightweight, zero-latency retro sound effects with master volume toggle. |
| **Hosting & Deploy** | **Vercel + Supabase Cloud** | 99.9% uptime, global CDN edge, public HTTPS deployment required by hackathon guidelines. |

---

## 3. RPG Progression Engine & Game Mathematics

The problem statement mandates a **non-linear leveling system** (each subsequent level requires progressively more XP).

### Leveling Formula
$$\text{XP Required for Level } L = \lfloor 100 \times L^{1.5} \rfloor$$

- **Level 1 $\rightarrow$ 2:** 100 XP *(Immediate early dopamine hit)*
- **Level 2 $\rightarrow$ 3:** 283 XP
- **Level 3 $\rightarrow$ 4:** 520 XP
- **Level 5 $\rightarrow$ 6:** 1,118 XP
- **Level 9 $\rightarrow$ 10:** 2,700 XP *(Prestige accomplishment)*

### 5 Core Attributes & Task Categorization
When completing quests, users earn XP towards both their **Character Level** and their **Attribute Stats**:
1. **Strength (STR):** Workouts, gym, sports, physical labor.
2. **Intellect (INT):** Coding, studying, technical reading, research.
3. **Vitality (VIT):** Hydration, 8 hours sleep, meditation, meal prep.
4. **Agility (AGI):** Quick chores, errands, inbox zero, speed tasks.
5. **Charisma (CHA):** Team standups, public speaking, networking, social events.

---

## 4. Hackathon-Winning "Killer Features"

1. **Weekly Boss Raid ("The Procrastination Demon"):**
   - A weekly dungeon boss (e.g., *Malakor the Sloth*, 3,000 HP).
   - Completing any quest deals attack damage to the boss based on quest XP and user Strength.
   - Slaying the boss before the timer expires awards rare loot chests and guild profile badges.
2. **Guild Black Market (Dual Economy):**
   - **In-Game Relics:** *Scroll of Focus* (+10% INT XP), *Aegis Shield* (Streak freeze: protects streak if one day is missed).
   - **Real-Life Custom Rewards:** Users configure their own real-world rewards (e.g., "1 Hour Video Games" = 120 Gold, "Order Takeout" = 400 Gold). Bridges in-game progress with actual life incentives.
3. **Hunter Rank Difficulty Tiers:**
   - **E-Rank:** Minor tasks (10 XP, 5 Gold)
   - **C-Rank:** Standard tasks (35 XP, 15 Gold)
   - **A/S-Rank:** Major milestones (150+ XP, 80 Gold).
4. **Command Palette (`Ctrl+K` / `Cmd+K`):**
   - Full keyboard accessibility: Press `C` to create a quest, `1-3` to switch tabs, `Space` to complete.

---

## 5. Database Schema & Data Isolation

```
Users (id [UUID], email [STRING], password_hash [STRING], created_at [TIMESTAMP])
  │
  ├── Character (id, user_id, name, title, level, current_xp, gold, streak_count, last_active_date)
  ├── Attributes (character_id, str_xp, int_xp, vit_xp, agi_xp, cha_xp)
  ├── Quests (id, user_id, title, description, category, rank, xp_reward, gold_reward, status, is_daily, due_date)
  ├── Inventory (id, user_id, item_id, equipped [BOOL], acquired_at)
  ├── ShopItems (id, name, description, cost, type, stat_boost, icon_slug)
  └── BossRaid (id, user_id, name, max_hp, current_hp, deadline, reward_gold, defeated [BOOL])
```

---

## 6. Disqualification Checklist & Prevention Strategy

| Disqualification Vector | Official Rule | Our Prevention Strategy |
| :--- | :--- | :--- |
| **Broken Links** | Private repo or 404 live link at judging time | Verify public GitHub repo setting; Vercel deployment with SSL and custom health-check. |
| **Fake Data Persistence** | Solely using `localStorage` | All state stored in PostgreSQL. Verified via hard refresh (`Ctrl + F5`) across separate devices. |
| **Build / Deploy Failure** | App crashes on initial load | Run local production builds (`npm run build`) before pushing; verify all environment variables. |
| **Runtime / Console Crashes** | Unhandled exceptions or blank screens | Wrap UI with React Error Boundaries; validate all API inputs with Zod schemas. |
| **Invalid Repository** | Fewer than 3 commits or single code dump | Maintain 15+ clean chronological commits following conventional commit standards. |
| **Missing / Restricted Video** | Missing, private, outside 90–180s, or >100MB | Record strictly 120s walkthrough, compress to ~25MB MP4, host on YouTube (unlisted) + repo link. |

---

## 7. Walkthrough Video Script (Strict 90–180s Target)

- **0:00 – 0:20 (Authentication):** Show signup/login screen. Click "Demo Hunter" for instant access. Point out character status bar (Level 1 Novice, 0 XP, 50 Gold).
- **0:20 – 0:50 (Add & Complete Quest):** Add a B-Rank Quest ("Build Auth API", category: Intellect). Mark it complete: show floating `+75 XP` animation, sound chime, and boss taking damage.
- **0:50 – 1:15 (Level Up Celebration):** Complete second quest to hit XP threshold. Trigger confetti, sound fanfare, and animated Level Up modal showing stat boosts.
- **1:15 – 1:35 (Persistence Proof):** **Perform a hard browser refresh (Ctrl+F5)**. Show that XP, Level, Gold, and quest state remain identical from PostgreSQL.
- **1:35 – 2:00 (Shop & Boss Raid):** Open Guild Market, buy a Relic with earned Gold, show the Boss HP bar, and demonstrate responsive mobile view.

---

## 8. Team Task Distribution (Customizable)

- **Member 1 (Frontend & Immersion):** Dark theme UI, Framer Motion animations, celebratory level-up modal, sound effects toggle, responsive mobile navigation.
- **Member 2 (Backend & Database):** PostgreSQL setup, Next.js API routes (Auth, Quests CRUD, Character Leveling, Boss damage), database migrations.
- **Member 3 (Game Systems, Polish & Demo):** In-game economy/shop, streak calculation, keyboard command palette (`Ctrl+K`), walkthrough video recording & editing (<100MB, 120s).
