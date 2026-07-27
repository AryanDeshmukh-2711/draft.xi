import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { formations as formationSeed } from "../src/lib/formations";
import { squads as squadSeed } from "../src/lib/squads";
import * as schema from "../src/lib/db/schema";

// Bump when the squad data changes so old results stay reproducible.
const DATASET_VERSION = "1.0.0";

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required to seed the database.");
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  try {
    const nationMap = new Map<string, string>();

    for (const squad of squadSeed) {
      const [nation] = await db
        .insert(schema.nations)
        .values({ name: squad.nation, code: squad.code, flag: squad.flag })
        .onConflictDoUpdate({
          target: schema.nations.code,
          set: { name: squad.nation, flag: squad.flag },
        })
        .returning({ id: schema.nations.id, code: schema.nations.code });

      if (!nation) continue;
      nationMap.set(nation.code, nation.id);
    }

    for (const formation of formationSeed) {
      await db
        .insert(schema.formations)
        .values({ name: formation.name, slotList: formation.slots })
        .onConflictDoNothing();
    }

    for (const squad of squadSeed) {
      const nationId = nationMap.get(squad.code);
      if (!nationId) continue;

      const [insertedSquad] = await db
        .insert(schema.squads)
        .values({
          nationId,
          tournamentYear: squad.year,
          meta: { nation: squad.nation, code: squad.code, flag: squad.flag, externalId: squad.id },
          datasetVersion: DATASET_VERSION,
        })
        .onConflictDoUpdate({
          target: [schema.squads.nationId, schema.squads.tournamentYear],
          set: {
            meta: { nation: squad.nation, code: squad.code, flag: squad.flag, externalId: squad.id },
            datasetVersion: DATASET_VERSION,
          },
        })
        .returning({ id: schema.squads.id });

      if (!insertedSquad) continue;

      await db.delete(schema.players).where(eq(schema.players.squadId, insertedSquad.id));

      for (const player of squad.players) {
        await db.insert(schema.players).values({
          squadId: insertedSquad.id,
          externalId: player.id,
          shirtNumber: player.number,
          name: player.name,
          position: player.positions[0],
          positions: player.positions,
          rating: player.rating,
          attack: player.attack,
          defense: player.defense,
          passing: player.passing,
          physical: player.physical,
        });
      }
    }

    console.log(`Seeded Draft XI dataset version ${DATASET_VERSION}`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
