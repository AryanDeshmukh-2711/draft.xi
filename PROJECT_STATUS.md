# Draft XI Project Status

Last updated: 2026-07-16

This document tracks what is already done in the current workspace and what still needs to be built to reach the full product described in the PRD and build guide.

## What Has Been Done

### Project setup
- Created a Next.js + TypeScript + Tailwind project in `draft-xi`.
- Set up the app shell, metadata, and global theme styling.
- Replaced the default starter homepage with a branded Draft XI landing page.
- Added the core content routes:
  - `/play`
  - `/how-to-play`
  - `/rules`
  - `/strategy`
  - `/faq`
  - `/leaderboard`

### Core game foundation
- Added local type definitions for squads, players, formations, and draft modes.
- Added a local formation dataset with multiple common football formations.
- Added a local sample squad dataset with real-world-style historical squads.
- Added helper utilities for player-slot eligibility and seeded randomness.
- Added a pure simulation function that returns a deterministic result from an XI, formation, and seed.

### Database scaffold
- Added a Postgres-ready Drizzle schema for nations, squads, players, formations, draft sessions, draft picks, simulation results, and leaderboard entries.
- Added a Drizzle client scaffold that uses `DATABASE_URL` when present.
- Added a seed/import script plus `db:seed` package command for loading the current sample data into a Postgres database.
- Added file-backed persistence for session history and leaderboard state as a durable fallback in the app routes.

### API routes
- Added `GET /api/formations`.
- Added `GET /api/squads/random`.
- Added `POST /api/simulate`.
- Added `GET /api/leaderboard` and `POST /api/leaderboard` as a minimal in-memory implementation.

### Playable UI
- Reworked the play screen into a football-pitch layout with formation rows instead of a table-like grid.
- Added live form-based ratings that fluctuate over time and feed both the player card display and the simulation result.
- Added click-to-select pitch slots so the user can choose which position to fill before selecting a player.
- Added random, limited team rerolls so the user can switch to a different nation/year team up to three times per draft.
- Kept the loaded squad active so multiple picks can be made from the same squad before changing teams.

## What Is Still Left To Do

## Phase 1 - Data Layer Completion
1. Replace the local sample data with a real persistent database.
2. Design the production schema for Nation, Squad, Player, Formation, DraftSession, DraftPick, SimulationResult, and LeaderboardEntry.
3. Choose and configure a real database provider such as Supabase/PostgreSQL.
4. Add migrations for the full schema.
5. Build a seed/import pipeline for the historical squad dataset.
6. Expand the player pool from the sample set to a production-scale dataset.
7. Add versioning for the dataset so older results remain reproducible.
8. Add proper data-source and licensing handling.

## Phase 2 - Formation Selector and Pitch UI
1. Replace the current simple draft layout with a richer pitch visualization.
2. Position slots visually according to the selected formation.
3. Improve formation switching behavior and document whether switching resets the draft or is locked.
4. Add clearer slot highlighting and live pitch feedback.

## Phase 3 - Roll and Draft Loop Hardening
1. Enforce reroll limits in a durable state store.
2. Improve squad skipping behavior and its scoring impact.
3. Prevent duplicate squads more robustly across a real session store.
4. Add stronger eligibility filtering and player highlighting.
5. Add keyboard navigation for the draft flow.
6. Persist draft progress across refreshes if desired.

## Phase 4 - Simulation Engine Improvements
1. Expand the simulation model beyond the current seed-based result generator.
2. Add match-by-match or round-by-round campaign logic.
3. Weight the spine and team balance more deeply.
4. Add unit tests for reproducibility.
5. Add server-side verification of submitted leaderboard results against stored XI and seed.

## Phase 5 - Result and Share Card
1. Build a shareable result card layout.
2. Add Open Graph image generation.
3. Add share links for X, WhatsApp, and Facebook.
4. Add shareable URL state or result IDs.
5. Make the card legible at social preview size.

## Phase 6 - Leaderboard Completion
1. Replace the in-memory leaderboard with a persistent store.
2. Add rate limiting for submissions.
3. Add abuse protection and validation around result submissions.
4. Build a proper top 100 leaderboard page with live data.
5. Add server-side verification that the posted score matches the recomputed simulation.

## Phase 7 - Content and SEO Pages
1. Add stronger metadata for every route.
2. Add canonical URLs, OG tags, and Twitter tags.
3. Add sitemap.xml and robots.txt.
4. Add structured SEO copy for How to Play, Rules, Strategy, Checklist, and FAQ.
5. Cross-link the content pages with clear calls to action.

## Phase 8 - Polish, QA, and Launch
1. Test the draft flow on real mobile devices.
2. Run accessibility checks for contrast, keyboard access, and touch target sizing.
3. Run performance checks and optimize bundle size.
4. Add analytics for draft start, draft completion, sharing, and leaderboard submission.
5. Do browser compatibility testing.
6. Prepare production deployment and launch checks.

## Phase 9 - Post-MVP Features
1. Add real-time multiplayer drafting.
2. Add i18n routing and translations.
3. Add light and dark theme toggling if needed.
4. Expand the player attribute system.
5. Add difficulty and style modifiers to the simulation.

## Recommended Next Build Order

1. Replace local sample data with a persistent Supabase/PostgreSQL schema.
2. Seed the database with real squads and players.
3. Persist draft sessions, picks, and results.
4. Upgrade the simulation engine and add tests.
5. Build the share card and OG image flow.
6. Finish the leaderboard with persistence and verification.
7. Add SEO metadata, sitemap, and robots files.
8. Polish the UX, accessibility, and performance.

## Current State Summary

The app is now a functional scaffold with a pitch-based draft loop, file-backed persistence for app state, and a Postgres-ready database scaffold with a seed pipeline. The biggest remaining work is wiring a live Supabase/PostgreSQL instance, hardening the simulation/leaderboard flow, and finishing the share-card plus SEO launch work.
