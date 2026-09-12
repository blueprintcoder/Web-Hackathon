# ⚙️ YASH'S BACKEND & DATABASE IMPLEMENTATION GUIDE
**Role:** Backend Lead & Database Architect  
**Weightage:** ~35%  
**Sandbox:** `prisma/`, `lib/db.ts`, `app/api/quests/`, `app/api/auth/`, `app/api/shop/`  
**Core Deliverable:** 100% Real Cloud Persistence & Rock-Solid REST APIs

---

## 🎯 Your Mission
You are responsible for the heart of the application: **eliminating the Disqualification Risk of "Fake localStorage persistence"**. 
The judges explicitly stated: **"If user data does not persist across a hard refresh or from different browsers, it will be disqualified."** You ensure every change is written securely to cloud PostgreSQL.

---

## 🗄️ 1. Database Setup (Cloud PostgreSQL via Supabase or Neon)
The schema has already been pre-built in `prisma/schema.prisma`.
Your steps:
1. Create a free project on [Supabase](https://supabase.com) or [Neon](https://neon.tech).
2. Copy the PostgreSQL connection string into `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"
   ```
3. Push schema to cloud DB:
   ```bash
   npx prisma db push
   ```
4. Verify models:
   * `User`: Auth, email, password hash.
   * `Character`: Hunter level, current XP, gold, streak count, last active date.
   * `Attributes`: `str_xp`, `int_xp`, `vit_xp`, `agi_xp`, `cha_xp`.
   * `Quest`: Title, description, category (`STR`|`INT`|`VIT`|`AGI`|`CHA`), rank (`E`|`D`|`C`|`B`|`A`|`S`), `xpReward`, `goldReward`, `status`, `isDaily`.
   * `Inventory`: User items, equipped boolean.
   * `ShopItem`: Item catalogue, cost, stat boosts.
   * `BossRaid`: Boss name, max HP, current HP, defeated boolean.

---

## 🔌 2. API Routes to Implement

### `POST /api/auth/demo` (1-Click Judge Access)
* **Goal**: Instant login without requiring judges to fill out signup forms.
* **Logic**: Find or create a user `demo@aetheria.rpg` with pre-populated Level 3 character, 5 active quests, and 120 starter Gold. Set session cookie.

### `GET /api/quests` & `POST /api/quests`
* `GET`: Return all active and completed quests for current authenticated user.
* `POST`: Accept `{ title, description, category, rank, isDaily }`.
  * Compute `xpReward` and `goldReward` server-side based on rank:
    * E-Rank: 10 XP, 5 Gold
    * D-Rank: 20 XP, 10 Gold
    * C-Rank: 35 XP, 15 Gold
    * B-Rank: 50 XP, 25 Gold
    * A-Rank: 80 XP, 40 Gold
    * S-Rank: 150 XP, 80 Gold
  * Save to DB and return created quest.

### `PATCH /api/quests/[id]` (The Completion Engine)
* When quest status changes to `COMPLETED`:
  * Use a Prisma transaction (`prisma.$transaction`) to:
    1. Mark quest `status = COMPLETED`, set `completedAt = now()`.
    2. Add `xpReward` to user's character. Check if `currentXP >= requiredXP(level)`. If yes, increment `level += 1`.
    3. Add `goldReward` to character gold.
    4. Add XP to the matching attribute (`int_xp`, `str_xp`, etc.).
    5. Deal damage to the active Boss: `boss.currentHp -= xpReward`.
    6. Update daily streak if this is the first completion today.
  * Return `{ quest, character, levelUp: boolean, bossDamage: number }`.

### `DELETE /api/quests/[id]`
* Delete quest by ID (verifying `userId` belongs to caller).

### `POST /api/shop/purchase`
* Accept `{ itemId }`.
* Check if user has enough gold.
* Deduct gold and create record in `Inventory`. Return updated gold and inventory.

---

## ⚡ 3. How to Test Your Endpoints (Zero Waiting)
* Run `npx prisma studio` to inspect and manipulate database rows in real-time.
* Use curl or the test script in `scripts/test-api.ts` to verify responses.
* You do not need to touch any UI component in `components/`!
