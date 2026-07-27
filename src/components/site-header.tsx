import Link from "next/link";

const links = [
  { href: "/how-to-play", label: "How to play" },
  { href: "/rules", label: "Rules" },
  { href: "/strategy", label: "Strategy" },
  { href: "/faq", label: "FAQ" },
  { href: "/leaderboard", label: "Top 100" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[rgba(4,7,13,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[104rem] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="clip-tag flex h-8 w-8 items-center justify-center bg-[var(--accent)] text-sm font-bold text-[#04070d] transition group-hover:brightness-110">
            XI
          </span>
          <span className="display text-lg font-bold leading-none tracking-tight text-white">
            DRAFT<span className="text-[var(--accent)]">.</span>XI
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="display px-3 py-1.5 text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-[var(--muted)] transition hover:text-[var(--accent)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/play"
          className="clip-btn display bg-[var(--accent)] px-5 py-2 text-[0.8rem] font-bold uppercase tracking-[0.12em] text-[#04070d] transition hover:brightness-110"
        >
          Play
        </Link>
      </div>
    </header>
  );
}
