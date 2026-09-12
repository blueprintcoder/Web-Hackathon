# 🏆 AETHERIA: LIFE RPG — MASTER WORK DISTRIBUTION
**Target Submission:** 10:00 AM Today (13/09/2026)  
**Strategy:** Contract-First Modular Architecture (Zero Clashing & Zero Waiting)

---

## 👥 Master Team Alignment

| Member | Title / Role | Primary Ownership | Dedicated Guide File | Weightage |
| :--- | :--- | :--- | :--- | :---: |
| **Aniket** | Frontend & Sensory Immersion Lead | `components/`, `styles/`, `public/sounds/` | [`ANIKET_FRONTEND_GUIDE.md`](./ANIKET_FRONTEND_GUIDE.md) | **35%** |
| **Yash** | Backend & Database Architect | `prisma/`, `lib/db.ts`, `app/api/quests/`, `app/api/auth/` | [`YASH_BACKEND_GUIDE.md`](./YASH_BACKEND_GUIDE.md) | **35%** |
| **Team Leader** | Systems Architect, Engine, QA & Demo Producer | `types/`, `lib/rpg-engine.ts`, `app/page.tsx`, Deploy & Video | [`LEADER_ENGINE_VIDEO_GUIDE.md`](./LEADER_ENGINE_VIDEO_GUIDE.md) | **30%** |

---

## 🛡️ The Non-Clashing Architecture

To guarantee nobody's work overlaps or conflicts:
1. **Shared Contract (`types/game.ts`)**: Defines all data shapes. Nobody changes this without team agreement.
2. **Independent Testing**:
   * **Aniket** uses `lib/mock-data.ts` to build and test UI components immediately.
   * **Yash** tests his API endpoints and database models using Prisma Studio and API scripts.
   * **Team Leader** brings them together in `app/page.tsx` and handles deployment + video.

---

## 📅 Timeline to 10:00 AM Submission

```
01:30 AM ───► [Prerequisites & Scaffold by Leader] ───► (Types, Mock Data, Schemas)
02:15 AM ───► [Parallel Sprint 1] ───► Aniket: UI/Audio | Yash: Cloud DB/Auth | Leader: RPG Engine
05:30 AM ───► [Integration] ───► Wire UI to APIs in app/page.tsx & Error Boundaries
07:00 AM ───► [Cloud Deployment] ───► Vercel + PostgreSQL live & Ctrl+F5 Hard Refresh Audit
07:45 AM ───► [Code Freeze] ───► Only bug fixes permitted
08:00 AM ───► [Video Production] ───► Record 120s video (<100MB) & upload
09:30 AM ───► [Final Polish] ───► README.md, GitHub public repo check, form submission
10:00 AM ───► [DEADLINE] 🚀
```

---

## 🚫 The 6 Disqualification Rules (Zero Tolerance)
Submissions receive an **immediate zero** if they violate any of these rules:
1. **Broken Links**: Repo private or live link dead at evaluation time.
2. **Fake Persistence**: Storing data only in `localStorage`. Must persist in cloud PostgreSQL across hard refreshes.
3. **Build / Deploy Failure**: App crashes on load in production.
4. **Console / Runtime Crashes**: Unhandled exceptions or blank screens.
5. **Invalid Repository**: Fewer than 3 commits, missing backend, or single code-dump commit.
6. **Video Faults**: Missing, private/login required, >100MB, or duration outside 90–180 seconds.
