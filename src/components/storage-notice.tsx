import { storageBackend } from "@/lib/server-json-store";

/**
 * Shown when the host has no durable store, so nobody wonders why their
 * submission vanished an hour later.
 */
export function StorageNotice() {
  if (storageBackend !== "ephemeral") return null;

  return (
    <p className="mt-6 border-l-2 border-[var(--amber)] bg-white/[0.03] px-4 py-3 text-xs leading-6 text-[var(--muted)]">
      This deployment has no database connected yet, so results are held in
      memory and clear whenever the server restarts. Connect a KV store and they
      become permanent and shared.
    </p>
  );
}
