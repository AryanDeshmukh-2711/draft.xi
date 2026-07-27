import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Geist, Geist_Mono } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const display = Chakra_Petch({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://draft-xi.vercel.app";

export const viewport: Viewport = {
  themeColor: "#04070d",
};

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <MotionProvider>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
