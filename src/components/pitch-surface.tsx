/** The turf, markings and vignette. Shared by the draft pitch and the home preview. */
export function PitchSurface() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(0,224,138,0.05) 0 9%, transparent 9% 18%)",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(4,7,13,0.85)_100%)]" />

      <div className="absolute inset-[4%] border border-[var(--pitch-line)]" />
      <div className="absolute left-[4%] right-[4%] top-1/2 h-px bg-[var(--pitch-line)]" />
      <div className="absolute left-1/2 top-1/2 h-[15%] w-[21%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--pitch-line)]" />
      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]" />

      <div className="absolute bottom-[4%] left-1/2 h-[14%] w-[50%] -translate-x-1/2 border-x border-t border-[var(--pitch-line)]" />
      <div className="absolute bottom-[4%] left-1/2 h-[6%] w-[25%] -translate-x-1/2 border-x border-t border-[var(--pitch-line)]" />
      <div className="absolute top-[4%] left-1/2 h-[14%] w-[50%] -translate-x-1/2 border-x border-b border-[var(--pitch-line)]" />
      <div className="absolute top-[4%] left-1/2 h-[6%] w-[25%] -translate-x-1/2 border-x border-b border-[var(--pitch-line)]" />

      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(0,224,138,0.07),transparent)]" />
    </div>
  );
}
