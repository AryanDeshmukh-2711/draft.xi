/**
 * Checks every formation in every style still draws on the pitch:
 * nothing clipped at the edges, nothing overlapping a neighbour.
 * Run with `npm run check:shapes`.
 */
import { formations } from "../src/lib/formations";
import { applyStyleShape } from "../src/lib/style-shape";
import type { DraftStyle } from "../src/lib/types";

// The token reserves 19% of the pitch width, but its visible content — the
// circle and a truncated surname — sits inside about 15% by 11%.
const halfWidth = 9.5;
const collideX = 7.5;
const collideY = 6;

const problems: string[] = [];
const styles: DraftStyle[] = ["defensive", "balanced", "attacking"];

for (const base of formations) {
  for (const style of styles) {
    const shaped = applyStyleShape(base, style);
    const tag = `${base.id}/${style}`;

    for (const slot of shaped.slots) {
      if (slot.x - halfWidth < 0) problems.push(`${tag}: ${slot.id} clips the left touchline`);
      if (slot.x + halfWidth > 100) problems.push(`${tag}: ${slot.id} clips the right touchline`);
      if (slot.y - collideY < 0) problems.push(`${tag}: ${slot.id} clips its own goal line`);
      if (slot.y + collideY > 100) problems.push(`${tag}: ${slot.id} clips the far goal line`);
    }

    for (let i = 0; i < shaped.slots.length; i += 1) {
      for (let j = i + 1; j < shaped.slots.length; j += 1) {
        const a = shaped.slots[i];
        const b = shaped.slots[j];
        if (Math.abs(a.x - b.x) < collideX * 2 && Math.abs(a.y - b.y) < collideY * 2) {
          problems.push(
            `${tag}: ${a.id} (${a.x},${a.y}) too close to ${b.id} (${b.x},${b.y})`,
          );
        }
      }
    }
  }
}

const spread = formations.map((base) => {
  const rows = (style: DraftStyle) => {
    const shaped = applyStyleShape(base, style);
    const outfield = shaped.slots.filter((slot) => slot.position !== "GK");
    return Math.round(outfield.reduce((sum, slot) => sum + slot.y, 0) / outfield.length);
  };
  return `${base.id.padEnd(8)} def ${rows("defensive")} · bal ${rows("balanced")} · att ${rows("attacking")}`;
});

console.log("=== average outfield height by style ===");
for (const line of spread) console.log(line);

console.log(`\n${formations.length * styles.length} formation/style combinations checked.`);
if (problems.length > 0) {
  console.error(`${problems.length} problem(s):`);
  for (const problem of problems) console.error(` - ${problem}`);
  process.exitCode = 1;
} else {
  console.log("No slots clipped or overlapping.");
}
