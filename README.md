# ⚔️ Aetheria: The Hunter's Protocol (Life RPG)

> **A gamified full-stack web application translating mundane real-world tasks into an immersive RPG progression system.**  
> Built for **Web Hackathon 2026** under the **Life RPG** problem statement.

---

## 🌟 The Core Vision & Theme
Standard habit trackers fail because real-life habits suffer from **delayed gratification** (gym, reading, and coding take months to see results). Video games engage players through **instant feedback loops, tangible rewards, and clear progression**.

Instead of a generic Bootstrap dashboard, **Aetheria** implements the **Solo Leveling / Dark Fantasy Guild** aesthetic:
* **Cohesive RPG Vocabulary:** Quests & Bounties (Rank E to S), Gold & Mana Crystals, Daily Rites & Streaks, Guild Black Market.
* **Alive & Tactile Audio/Visuals:** Built-in retro audio effects (blade slashes, coin drops, fanfare), spring physics, floating XP numbers, and confetti-packed level-up modals.
* **Zero-Lag Feel:** Instant optimistic UI updates backed by cloud PostgreSQL persistence.

---

## 🚀 Key Features

1. **Non-Linear RPG Progression Engine**:
   $$\text{Required XP}(L) = \lfloor 100 \times L^{1.5} \rfloor$$
   Early levels offer instant gratification, while higher levels represent prestigious achievements.
2. **5 Core Attributes & Real-World Feats Translation Bar (Section 9.3)**:
   * Attributes: **Strength (STR)**, **Intellect (INT)**, **Vitality (VIT)**, **Agility (AGI)**, **Charisma (CHA)**.
   * Dynamically translates abstract stats into tangible real-world feats (e.g. *STR: "Capable of benching 85kg"*, *INT: "Can parse 50 pages of tech docs in 15 mins"*).
3. **Weekly Boss Raid ("The Procrastination Demon")**:
   * Slay *Malakor the Sloth* (3,000 HP). Every completed quest deals attack damage based on quest XP and user Strength.
4. **Guild Black Market (Dual Economy - Section 9.4)**:
   * **Virtual Relics:** *Scroll of Focus* (+10% INT XP), *Aegis Streak Shield* (Streak freeze), *XP Surge Elixir*.
   * **Real-World Custom Rewards:** Users redeem earned Gold for self-rewards (*1-Hour Gaming Pass*, *Cheat Meal Pass*, *Sleep-In Pass*).
5. **Soul Sacrifice Streak Lifeline (Section 9.1)**:
   * High-stakes emergency recovery: Sacrifice **1 Full Character Level** to reclaim and preserve a broken streak (anti-abuse limit: max 2/month).
6. **Solitude Concentration Multiplier (Section 9.2)**:
   * +50% bonus XP multiplier during quiet/off-peak hours (11:00 PM – 6:00 AM) to reward dedicated solo focus.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | **Next.js 15 (App Router, React 19, TypeScript)** |
| **Styling & UI** | **Tailwind CSS + Lucide Icons** |
| **Animations & SFX** | **Framer Motion + Canvas-Confetti + Web Audio API** |
| **Database & ORM** | **PostgreSQL (Supabase / Neon) + Prisma** |
| **Hosting & CI/CD** | **Vercel** |

---

## ⚡ Quickstart & Setup Guide

### 1. Clone & Install Dependencies
```bash
git clone <YOUR_REPO_URL>
cd "Web Hackathon"
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Provide your cloud PostgreSQL connection string:
```env
DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"
```

### 3. Synchronize Database
```bash
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to enter the realm.

---

## 👥 Team Work Distribution

* **Aniket (Frontend Lead)**: UI/UX, Dark Fantasy Theme, Spring Animations & Audio Controller (`components/`, `styles/`). See [`docs/ANIKET_FRONTEND_GUIDE.md`](docs/ANIKET_FRONTEND_GUIDE.md).
* **Yash (Backend Lead)**: Cloud PostgreSQL Schema, Auth & Quest CRUD APIs (`prisma/`, `app/api/`). See [`docs/YASH_BACKEND_GUIDE.md`](docs/YASH_BACKEND_GUIDE.md).
* **Team Leader**: Architecture, Game Engine Formulas, Deployment QA & 120s Demo Video. See [`docs/LEADER_ENGINE_VIDEO_GUIDE.md`](docs/LEADER_ENGINE_VIDEO_GUIDE.md).
* **Master Distribution Matrix**: See [`docs/MASTER_WORK_DISTRIBUTION.md`](docs/MASTER_WORK_DISTRIBUTION.md).

---

## 🛡️ Zero-Tolerance Compliance Checklist
- [x] **100% Real Database Persistence**: All state stored in PostgreSQL; zero reliance on `localStorage` for primary data.
- [x] **Zero Console/Runtime Crashes**: Tested input validation and graceful fallback handling.
- [x] **Valid Repository**: Clean chronological commits, full frontend and backend codebase included.
- [x] **Strict Walkthrough Video**: 120-second screen capture (<100MB) demonstrating auth, quest completion, level-up celebration, and hard refresh persistence proof.
