import Link from "next/link";

const columns = [
  {
    title: "Play",
    links: [
      { href: "/play", label: "Draft zone" },
      { href: "/leaderboard", label: "Top 100" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/how-to-play", label: "How to play" },
      { href: "/rules", label: "Rules and scoring" },
      { href: "/strategy", label: "Strategy" },
      { href: "/faq", label: "FAQ" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-black/25">
      <div className="mx-auto grid w-full max-w-[104rem] gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-10">
        <div>
          <p className="text-lg font-black tracking-tight text-white">DRAFT XI</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
            A free World Cup draft game. Roll a national squad, take one player a turn, name a bench,
            and find out whether your XI survives the tournament.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[var(--muted)]">
              {column.title}
            </p>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/80 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--border)] px-4 py-4 text-center text-xs text-[var(--muted)] sm:px-6 lg:px-10">
        Player and squad data is a curated historical dataset for gameplay. Not affiliated with FIFA or
        any national association.
      </div>
    </footer>
  );
}
