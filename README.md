# Draft XI

A free browser game for World Cup fans. Roll a national team and a tournament year, draft one real
player per turn into a formation, name a seven-man bench, and simulate the campaign to see how far
your XI goes.

## The game

- **One draw, one squad, one player.** Each turn draws a nation and a World Cup year. You can read
  the whole squad, but only one player joins your side.
- **Eight formations.** 4-3-3, 4-4-2, 4-2-3-1, 4-2-4, 3-5-2, 5-3-2, 4-5-1, 3-4-3. The shape decides
  which slots are open, and a player is only worth taking if he helps it.
- **Three rerolls.** Reroll for another nation in the same tournament, or the same nation in a
  different one.
- **A manager's bench.** Seven substitute slots — reserve keeper, two defensive covers, two in
  midfield, one attacker, and a free impact slot. Filling it raises your rating and lets you make
  substitutions when fatigue hits in the knockout rounds.
- **Styles and modes.** Defensive / Balanced / Attacking change how the campaign is scored. Classic
  shows player ratings; Almanac hides them and turns the draft into a memory test.
- **A seven-match campaign.** Three group games and four knockout rounds, scored on attack, defense,
  balance, role fit, bench depth, and a little tournament luck.

## Running it

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>. The draft lives at `/play`.

| Command | Does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run check` | Validate the squad dataset and print simulation calibration |
| `npm run db:seed` | Load the dataset into Postgres (needs `DATABASE_URL`) |

## How it is put together

- **Next.js App Router + TypeScript + Tailwind.**
- `src/lib/squads.ts` — the squad dataset. Players are written as compact tuples
  (`[shirt, name, positions, rating]`) and per-position archetypes derive the attack, defense,
  passing, and physical attributes, with overrides for players who were unusual for their role.
- `src/lib/formations.ts` — formations as x/y slot coordinates, so every shape draws correctly on the
  pitch, plus the bench slot definitions.
- `src/lib/simulation.ts` — the campaign model. Deterministic: the same picks, formation, style, and
  seed always produce the same result.
- `src/lib/simulation-request.ts` — resolves client picks back to real dataset players, so scores are
  always computed server-side from ids rather than trusted from the browser.
- `src/app/api/*` — formations and bench setup, random squad draws, simulation, and the leaderboard.
- Leaderboard submissions are re-simulated on the server and rate limited before they are stored.

State is kept in a small file-backed store under `data/` by default. A Drizzle schema and seed script
for Postgres live in `src/lib/db/` and `scripts/seed-db.ts` for when you want a real database — set
`DATABASE_URL` and run `npm run db:seed`.

Set `NEXT_PUBLIC_SITE_URL` in production so the canonical URLs, sitemap, and robots file point at the
right host.

## Data

The squad dataset is a curated historical selection covering World Cup squads from 1970 to 2026,
built for gameplay rather than as a reference database. Ratings are judgement calls, not official
numbers. Not affiliated with FIFA or any national association.
