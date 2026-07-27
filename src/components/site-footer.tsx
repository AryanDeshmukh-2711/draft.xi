import Link from "next/link";

const columns = [
  {
    title: "Play",
    links: [
      { href: "/play", label: "Draft zone" },
      { href: "/leaderboard", label: "Manager Top 100" },
      { href: "/players", label: "Player rankings" },
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
    <footer className="mt-20 border-t border-[var(--border)] bg-[rgba(4,7,13,0.6)]">
      <div className="mx-auto grid w-full max-w-[104rem] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr] lg:px-10">
        <div>
          <p className="display text-xl font-bold tracking-tight text-white">
            DRAFT<span className="text-[var(--accent)]">.</span>XI
          </p>
          <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">
            Roll a national squad, take one player a turn, name a bench, and find out whether your XI
            survives the tournament.
          </p>
          <Link
            href="/play"
            className="clip-btn display mt-5 inline-flex bg-[var(--accent)] px-5 py-2.5 text-[0.8rem] font-bold uppercase tracking-[0.12em] text-[#04070d] transition hover:brightness-110"
          >
            Start a draft
          </Link>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <p className="eyebrow">{column.title}</p>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/75 transition hover:text-[var(--accent)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--border)] px-4 py-5 text-center text-xs text-[var(--muted)] sm:px-6 lg:px-10">
        Squad data is a curated historical set built for gameplay. Not affiliated with FIFA or any
        national association.
      </div>
    </footer>
  );
}
