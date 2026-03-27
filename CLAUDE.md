# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**בוחר חכם (Bocher Hacham)** — An Israeli voter research platform. A Hebrew RTL web app helping Israeli voters explore, compare, and research Knesset candidates and party lists through interactive visualizations and smart filtering. All UI text is in Hebrew with full RTL layout.

## Commands

```bash
# Development
bun run dev          # Start dev server (Vite)
bun run build        # Production build
bun run lint         # ESLint
bun run test         # Run tests once (Vitest)
bun run test:watch   # Watch mode for tests
```

## Architecture

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + React Router v6 + TanStack Query + Framer Motion + Recharts

### Routing (src/App.tsx)
All routes are wrapped in `AppLayout` (header + mobile nav + favorites drawer):
- `/` → `HomePage` — hero + onboarding quiz + entry points
- `/people` → `PeoplePage` — candidate grid with filters
- `/lists` → `ListsPage` — party cards with comparison
- `/lists/:id` → `PartyDetailPage`
- `/explore` → `ExplorePage` — category landing
- `/explore/:key` → `CategoryDetailPage` — charts & rankings per category
- `/mockups` → `MockupPage`

### Data Layer (src/data/)
All data is static mock data — no backend or API calls:
- `types.ts` — `Candidate`, `Party`, `CategoryKey`, `CategoryInfo` interfaces
- `candidates.ts` — ~120 mock candidates with Hebrew names, parties, regions, etc.
- `parties.ts` — party list with stats (seats, gender ratio, avg age, education)
- `categories.ts` — 6 explore categories: `gender | periphery | professionalism | education | age | seniority`

Data is structured for easy future migration to Supabase.

### State Management
- **Favorites** — `useFavorites` hook → `FavoritesContext` → persisted in `localStorage` under key `bocher-hacham-favorites`
- **Filtered candidates** — `useFilteredCandidates` hook encapsulates search + gender/region/party filters with `useMemo`
- No global state library; context is used only for favorites

### Layout (src/components/layout/)
- `AppLayout` — shell with `<Outlet>`, manages favorites drawer open state
- `Header` — sticky, logo + nav links + favorites badge + share menu
- `MobileNav` — bottom nav bar (mobile only)
- `FavoritesDrawer` — right-side drawer for saved candidates

### UI Components
- `src/components/ui/` — shadcn/ui primitives (do not edit manually; regenerate via shadcn CLI)
- `src/components/` — app-specific: `CandidateCard`, `CandidateModal`, `ComparisonModal`, `PartyCard`, `IsraelMap`

## Design System

The design is intentionally **vibrant and playful** (Duolingo-meets-data-viz aesthetic) — NOT minimalist. Key conventions:
- Primary font: `font-rubik` for headings/bold text; `font-heebo` for body
- Custom gradient classes: `gradient-cool`, `gradient-warm`, `gradient-fun` (defined in `index.css`)
- Custom shadow classes: `shadow-card`, `shadow-card-hover`, `shadow-glow`
- Custom color tokens: `--coral`, `--amber`, `--emerald`, `--sky`, `--rose`, `--violet`, `--teal`
- Framer Motion for all transitions: cards lift on hover, staggered list animations, 300–400ms durations
- All text/layout is RTL; use `text-right`, `dir="rtl"`, and RTL-aware flex ordering

## Key Conventions

- Path alias `@/` maps to `src/`
- The homepage quiz can be skipped; state persisted in `localStorage` under key `skip-homepage-quiz`
- `PeoplePage` implements infinite scroll via `IntersectionObserver` with page size 24
- `ComparisonModal` supports comparing exactly 2 parties side-by-side
- Tests live in `src/test/` using Vitest + Testing Library; setup in `src/test/setup.ts`
