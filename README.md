# Draft XI

A World Cup draft game for people who argue about lineups.

Roll a national team and a tournament year. Read the squad, take exactly one player, and watch the
next draw hand you something completely different. Fill eleven slots, name a bench, and send them out
to see how far they get.

Play it at `/play`.

---

## How it plays

**One draw, one squad, one player.** Each turn gives you a nation and a year — Brazil 1970, Cameroon
1990, Morocco 2022, Spain 2026. You can read every name in the squad, but only one of them joins your
side, and then the market closes. Every player you walk past is gone.

**You place him yourself.** Selecting a player arms him and lights up every slot he can fill, on the
pitch and on the bench. Nothing is committed until you choose one. Playing a centre-back in midfield
is allowed — the game will let you, and the balance score will tell you what it cost.

**The formation is the whole problem.** Eight shapes, from a 4-2-4 that needs four forwards and
forgives nothing at the back to a 5-3-2 that wants five defenders you will struggle to find. A player
is only worth taking if he solves a slot you actually have open.

**Three rerolls, and two ways to spend them.** Reroll for another nation in the same tournament, or
the same nation in a different one. Use them when a squad cannot solve your open position, not when
the names are unfamiliar.

**A real bench.** Seven substitute slots, laid out the way a manager fills a matchday sheet: reserve
keeper, two defensive covers, two in midfield, one attacker, one free impact slot. Each slot only
accepts a player who can genuinely do that job. Naming a bench raises your rating and lets you make
substitutions when legs go in the knockout rounds. Going without is a legitimate gamble — a strong XI
with nobody to bring on wins the tournament about a fifth as often.

**Then the campaign.** Three group games and four knockout rounds, scored on attack, defense, balance,
role fit, bench depth, and some tournament luck. Level after 90 in a knockout goes to penalties,
decided largely by your keeper. Fewer than four points in the group and you go home early.

**Injuries.** About one campaign in two loses a player, tired and less physical sides more often. If
the bench holds someone who can actually play that position he comes on and the run continues; if it
does not, the shape never recovers. A bench full of strikers will not cover an injured right-back.

**And the players remember.** Every campaign updates the record of each player who took part —
appearances, results, titles, and whether they started or came off the bench. That becomes ranking
points on `/players`, plus a form figure (▲/▼) shown next to their rating the next time they turn up
in a draw. Form is reputation, not a modifier: it changes what a player is worth to *you*, never what
the simulation does with them, so campaigns stay reproducible and leaderboard scores stay verifiable.

Two modes: **Classic** shows ratings, **Almanac** hides them and makes you draft on memory.

Three styles: **Defensive**, **Balanced**, **Attacking**. They redraw the same eleven on the pitch —
a deep, narrow block or a high, stretched line — and shift the goals at both ends: roughly 2.1–0.4 a
match defensive against 2.6–0.8 attacking. Neither is stronger; they win about equally often.

---

## Running it

```bash
npm install
npm run dev
```

| Command | |
| --- | --- |
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run check` | Validate the squad dataset and the pitch shapes, and print simulation calibration |
| `npm run db:seed` | Load the dataset into Postgres (needs `DATABASE_URL`) |

`npm run check` is the useful one when you touch the data or the model. It catches duplicate shirt
numbers, squads without a keeper, unfillable formation slots and out-of-range attributes, checks that
all 24 formation/style shapes draw without a token clipping the touchline or landing on a team-mate,
then runs a few hundred campaigns so you can see whether the goal, injury and style numbers still
look like football.

`npx tsx scripts/sample-campaign.ts [style] [benchSize]` prints example campaigns with their
injuries and substitutions, which is the quickest way to sanity-check the match narration.

Set `NEXT_PUBLIC_SITE_URL` in production so canonical URLs, the sitemap, and robots.txt point at the
right host.

---

## Layout

```
src/
  app/              routes, API handlers, sitemap, robots
  components/
    motion.tsx      Reveal / StaggerList / CountUp animation primitives
    draft/          the draft zone: phase bar, squad board, pitch, bench,
                    scorecard, result panel
  content/          the guide copy shared by the landing page and content routes
  lib/
    squads.ts       the dataset
    formations.ts   formations as x/y slot coordinates, plus the bench slots
    simulation.ts   the campaign model
    player-stats.ts the per-player record that feeds /players
```

A few things worth knowing before you change anything:

**Squads are written as tuples.** `[shirt, name, positions, rating]`, with attack/defense/passing/
physical derived from a per-position archetype. Override an attribute only where a player was
genuinely unusual for their role — Beckenbauer's passing, Gérson's, Roberto Carlos's shooting. This
keeps 559 players readable instead of a 4,000-line wall of objects.

**Formations are coordinates, not rows.** Each slot carries an `x` (left to right) and `y` (own goal
to opposition goal), so a 4-2-4 and a 4-5-1 both draw correctly without a lookup table of row counts.

**The simulation is deterministic.** Same picks, formation, style, and seed, same campaign. That is
what makes a result replayable and a leaderboard score verifiable.

**Scores are never trusted from the browser.** The client sends player ids; the server resolves them
back to real dataset entries, rejects anything invented, and recomputes the campaign itself. The
leaderboard re-simulates every submission before storing it, and throttles per client.

**Recording a campaign is idempotent.** `player-stats.ts` derives a run id from the picks, formation,
style and seed, so re-simulating the same draft — a refresh, a double click — cannot inflate anyone's
ranking.

**Animation must never gate content.** `AnimatePresence mode="wait"` is deliberately avoided in the
draft: a backgrounded tab stops firing animation frames, and waiting on an exit animation would leave
the board stuck. For the same reason `CountUp` starts at its target value and is only wound back to
animate, so an interrupted count still leaves the correct number on screen.

State lives in a small file-backed store under `data/` by default. There is a Drizzle schema and seed
script in `src/lib/db/` and `scripts/` for when you want Postgres behind it instead.

---

## Data

The squad dataset is a curated historical selection covering World Cups from 1970 to 2026, built for
gameplay rather than as a reference. Ratings are judgement calls. Not affiliated with FIFA or any
national association.
