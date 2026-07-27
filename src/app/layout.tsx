import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://draft-xi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Draft XI — build your World Cup dream team",
    template: "%s | Draft XI",
  },
  description:
    "A free World Cup draft game. Roll a national squad, pick one real player per turn, name a bench, and simulate the campaign with your XI.",
  keywords: [
    "world cup draft game",
    "football draft",
    "draft xi",
    "build your world cup xi",
    "football manager draft",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Draft XI",
    title: "Draft XI — build your World Cup dream team",
    description:
      "Roll a national squad, pick one real player per turn, name a bench, and simulate the campaign.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Draft XI — build your World Cup dream team",
    description:
      "Roll a national squad, pick one real player per turn, name a bench, and simulate the campaign.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[var(--background)] text-[var(--foreground)]">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
