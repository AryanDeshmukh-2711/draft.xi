import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

/**
 * Small JSON store with two backends.
 *
 * On a normal server it writes to `data/`. On a serverless host the project
 * directory is read-only, so it falls back to the OS temp directory — the game
 * still runs, but anything written there is per-instance and disappears on a
 * cold start.
 *
 * Set `KV_REST_API_URL` and `KV_REST_API_TOKEN` (the variables a Vercel KV or
 * Upstash Redis integration injects) and it uses that instead, which is what
 * makes the leaderboard and player rankings shared and durable.
 */

const kvUrl = process.env.KV_REST_API_URL;
const kvToken = process.env.KV_REST_API_TOKEN;
const useKv = Boolean(kvUrl && kvToken);

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const dataDirectory = isServerless
  ? path.join(os.tmpdir(), "draft-xi")
  : path.join(process.cwd(), "data");

let warnedAboutWrites = false;

function warnOnce(error: unknown) {
  if (warnedAboutWrites) return;
  warnedAboutWrites = true;
  console.warn(
    "[draft-xi] Could not persist state. Draft and simulation still work; " +
      "the leaderboard and player rankings will not be saved. " +
      "Connect a KV store to make them durable.",
    error,
  );
}

async function readFromKv<T>(key: string, fallback: T): Promise<T> {
  const response = await fetch(`${kvUrl}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${kvToken}` },
    cache: "no-store",
  });

  if (!response.ok) return fallback;

  const payload = (await response.json()) as { result?: string | null };
  if (!payload.result) return fallback;

  return JSON.parse(payload.result) as T;
}

async function writeToKv<T>(key: string, value: T) {
  await fetch(`${kvUrl}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${kvToken}` },
    body: JSON.stringify(value),
    cache: "no-store",
  });
}

export async function readJsonFile<T>(fileName: string, fallback: T): Promise<T> {
  try {
    if (useKv) return await readFromKv(fileName, fallback);

    const content = await readFile(path.join(dataDirectory, fileName), "utf8");
    return JSON.parse(content) as T;
  } catch {
    // A missing file, unreadable directory or unreachable store all mean the
    // same thing to the caller: nothing saved yet.
    return fallback;
  }
}

export async function writeJsonFile<T>(fileName: string, value: T) {
  try {
    if (useKv) {
      await writeToKv(fileName, value);
      return;
    }

    await mkdir(dataDirectory, { recursive: true });
    await writeFile(
      path.join(dataDirectory, fileName),
      `${JSON.stringify(value, null, 2)}\n`,
      "utf8",
    );
  } catch (error) {
    // Never let a failed write break a draft.
    warnOnce(error);
  }
}

export const storageBackend = useKv ? "kv" : isServerless ? "ephemeral" : "file";
