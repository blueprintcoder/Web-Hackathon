# 🎨 ANIKET'S FRONTEND & UI/UX IMPLEMENTATION GUIDE
**Role:** Frontend Lead & Sensory Immersion Specialist  
**Weightage:** ~35%  
**Sandbox:** `components/`, `styles/`, `public/sounds/`  
**Data Source to use immediately:** `lib/mock-data.ts` (No need to wait for DB/Backend!)

---

## 🎯 Your Mission
You are responsible for making **Aetheria: Life RPG** look and feel like an authentic, dopamine-pumping video game instead of a boring enterprise SaaS dashboard. The judges explicitly stated: **Generic unstyled CRUD apps will score poorly.**

---

## 🎨 Theme & Color System (Solo Leveling / Dark Fantasy)
Use Tailwind classes matching these tokens:
- **Background Slate:** `bg-[#0B0F19]` / `bg-[#111827]` (Card backgrounds)
- **Primary Borders:** `border-slate-800` or `border-indigo-900/40`
- **Amber Gold (Currency & Legendary):** `text-amber-400`, `bg-amber-500/10`, `border-amber-500/30`
- **Mana Cyan (Intellect & Magic):** `text-cyan-400`, `bg-cyan-500/10`, `border-cyan-500/30`
- **Amethyst Purple (Rank S / Epic):** `text-purple-400`, `bg-purple-500/10`, `border-purple-500/30`
- **Health / Boss Red:** `text-rose-400`, `bg-rose-500/20`, `border-rose-500/40`

---

## 📂 Your Assigned Files & Deliverables

### 1. `components/quest-board.tsx`
* **What to build**:
  * Quest list with two tabs: **"Daily Rites"** (habits that reset daily) and **"Hunter Bounties"** (one-off tasks).
  * Filter buttons by Rank: **All | E-Rank | D-Rank | C-Rank | B-Rank | A-Rank | S-Rank**.
  * Each quest card displays:
    * Rank badge (e.g. `[S-RANK]`, colored purple/red).
    * Attribute tag with icon (e.g. `💪 STR`, `🧠 INT`, `⚡ AGI`, `❤️ VIT`, `👑 CHA`).
    * Reward pill: `+75 XP` & `+20 Gold`.
    * Custom animated checkbox. When checked:
      * Checkbox pulses using Framer Motion (`whileTap={{ scale: 0.9 }}`).
      * Floating `+XP` and `+Gold` fly upward and fade out.
      * Triggers completion sound effect.

### 2. `components/feat-translation-bar.tsx` (Section 9 Innovation)
* **What to build**:
  * Displays the 5 Hunter Attributes with progress bars.
  * Below each stat, dynamically render the **Real-World Feat Translation**:
    * **STR (Level 1-20):** *"Can bench bodyweight / hike 10km without strain."*
    * **INT (Level 1-20):** *"Capable of parsing 50 pages of complex tech docs in 15 minutes."*
    * **VIT (Level 1-20):** *"Resilient against burnout; maintains sharp focus through 8h deep work."*
    * **AGI (Level 1-20):** *"Maintains zero unread inbox items; lightning speed on daily errands."*
    * **CHA (Level 1-20):** *"Charismatic communicator; leads team syncs with absolute composure."*

### 3. `components/boss-raid.tsx`
* **What to build**:
  * Visual boss card for **"Malakor, Lord of Distraction"** (Weekly Boss).
  * Health bar showing: `Current HP / Max HP (e.g., 2,450 / 3,000 HP)`.
  * Visual shake animation on the card when a quest is checked off (simulating attack damage).
  * Countdown timer: *"Dungeon resets in: 4d 12h"*.
  * Defeat reward badge: *"Drops: 200 Gold + 'Demon Slayer' Profile Crest"*.

### 4. `components/black-market.tsx`
* **What to build**:
  * Grid of items split into 2 categories:
    * **Virtual Relics:**
      * *Scroll of Focus* (+10% INT XP on coding tasks)
      * *Aegis Shield* (Streak freeze: protects streak if 1 day missed)
      * *XP Surge Elixir* (2x XP for next 3 quests)
      * *Shadow Monarch Aura* (Cosmetic glowing avatar frame)
    * **Real-World Custom Rewards (Section 9.4):**
      * *1-Hour Gaming Session* (100 Gold)
      * *Guilt-Free Cheat Meal* (300 Gold)
      * *Binge Watch Movie Pass* (250 Gold)
      * *Sleep-In Pass* (400 Gold)
  * Click "Claim / Buy" button with gold deduction feedback.

### 5. `components/level-up-modal.tsx`
* **What to build**:
  * Celebratory overlay triggered when user crosses level XP threshold.
  * Screen dims, gold glowing rays rotate behind a spinning 3D/animated Hunter Crest.
  * Displays: *"LEVEL UP! You have advanced to Level X Hunter"*.
  * Shows stat boosts: `+2 STR`, `+3 INT`, `+50 Max Mana`.
  * Triggers confetti explosion via `canvas-confetti`.

### 6. `components/audio-controller.tsx`
* **What to build**:
  * Audio toggle button in top-right header (Speaker icon: On / Mute).
  * Web Audio API synthesized sounds (or tiny wav/mp3 clips):
    * Quest Complete: Crisp blade slash or coin drop.
    * Level Up: Glorious fanfare chime.
    * Error: Low dungeon thud.

---

## 🛠️ How to Work Immediately (Zero Waiting)
1. In `app/page.tsx`, import `mockGameData` from `@/lib/mock-data`.
2. Pass `mockGameData.character`, `mockGameData.quests`, `mockGameData.boss`, and `mockGameData.shopItems` into your components as props.
3. Test your layout and animations in browser (`npm run dev`).
4. You do not have to touch any API route or Prisma file!
