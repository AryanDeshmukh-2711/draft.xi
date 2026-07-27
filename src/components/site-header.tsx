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
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[rgba(7,17,29,0.86)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[104rem] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-lg font-black tracking-tight text-white">DRAFT XI</span>
          <span className="hidden text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[var(--muted)] sm:inline">
            World Cup draft
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-[var(--muted)] transition hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/play"
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-bold text-white transition hover:bg-[var(--accent-strong)]"
        >
          Play now
        </Link>
      </div>
    </header>
  );
}
