import Providers from "./providers";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Playfair_Display, Inter } from "next/font/google";
import DarkModeToggle from "@/components/DarkModeToggle";
import TopDateTime from "@/components/TopDateTime";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Search,
  Rss
} from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";
import type { Metadata } from "next";

/* ⭐ IMPORTANT FIX */
export const dynamic = "force-dynamic";

/* ================= FONTS ================= */

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

/* ================= GLOBAL SEO ================= */

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nationpathindia.com"),
  title: {
    default: "Nation Path – Breaking News, Editorial & Policy Analysis",
    template: "%s | Nation Path",
  },
  description:
    "Nation Path is an independent digital newsroom delivering breaking news, politics, defence analysis, economy insights and world affairs.",
  openGraph: {
    title: "Nation Path – Breaking News & Editorial Authority",
    description:
      "Credible journalism and sharp editorial analysis shaping India's future.",
    url: "https://www.nationpathindia.com",
    siteName: "Nation Path",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nation Path – Breaking News",
    description:
      "Independent digital newsroom delivering credible journalism.",
  },
};

/* ================= LAYOUT ================= */

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  let breaking = null;

  try {
    breaking = await prisma.article.findFirst({
      where: {
        status: "approved",
        breaking: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Breaking fetch failed", error);
  }

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-gray-50 dark:bg-[#0a0f1c] text-black dark:text-gray-200 min-h-screen flex flex-col font-[var(--font-body)]">

        <Providers>

          <div
            id="scrollBar"
            className="fixed top-0 left-0 h-[3px] bg-red-600 z-[999] w-0"
          />

          {/* TOP BAR */}

          <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/30 dark:bg-black/30 border-b border-white/20">

            <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center text-xs">

              <TopDateTime />

              <div className="flex items-center gap-4">

                <Link
                  href="/search"
                  className="flex items-center gap-1 hover:text-red-600"
                >
                  <Search size={14}/>
                  Search
                </Link>

                <select className="bg-transparent outline-none cursor-pointer text-xs">
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Telugu</option>
                  <option>Tamil</option>
                  <option>Nepali</option>
                </select>

                <div className="border rounded-md px-2 py-1 flex items-center hover:bg-gray-100 dark:hover:bg-gray-800">
                  <DarkModeToggle />
                </div>

                <Link
                  href="/login"
                  className="border px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-xs"
                >
                  Login
                </Link>

              </div>

            </div>

          </div>

          {/* BREAKING BAR */}

          {breaking && (
            <div className="bg-[#0e1a33] text-white overflow-hidden">

              <div className="max-w-7xl mx-auto flex items-center h-10 relative">

                <span className="bg-red-600 px-4 py-2 text-xs font-semibold tracking-wider z-10">
                  BREAKING
                </span>

                <div className="absolute whitespace-nowrap animate-marquee px-6 text-sm">
                  <Link
                    href={`/article/${breaking.slug}`}
                    className="hover:underline"
                  >
                    {breaking.title}
                  </Link>
                </div>

              </div>

            </div>
          )}

          {/* HEADER */}

          <header className="border-b bg-white dark:bg-[#0a0f1c] sticky top-[36px] z-40">

            <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

              <Link href="/" className="flex items-center gap-4">

                <Image
                  src="/logo.png"
                  alt="Nation Path"
                  width={48}
                  height={48}
                />

                <h1 className="text-2xl md:text-3xl font-[var(--font-heading)] font-bold tracking-wide">
                  NATION PATH
                </h1>

              </Link>

              <nav className="hidden md:flex items-center gap-6 text-sm font-medium tracking-wide">

                <Link href="/" className="hover:text-red-600">Home</Link>
                <Link href="/category/politics" className="hover:text-red-600">Politics</Link>
                <Link href="/category/defence" className="hover:text-red-600">Defence</Link>
                <Link href="/category/world" className="hover:text-red-600">World</Link>
                <Link href="/category/technology" className="hover:text-red-600">Technology</Link>
                <Link href="/category/entertainment" className="hover:text-red-600">Entertainment</Link>

              </nav>

            </div>

          </header>

          <main className="flex-grow">{children}</main>

          {/* FOOTER */}

          <footer className="mt-24 bg-gradient-to-br from-[#0e1a33] to-[#081224] text-gray-300">

            <div className="max-w-7xl mx-auto px-6 py-20">

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                <div>

                  <h3 className="text-xl font-[var(--font-heading)] font-bold text-white mb-4">
                    NATION PATH
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed">
                    Nation Path is an independent digital newsroom delivering
                    credible journalism, analysis and commentary across
                    politics, defence, technology and global affairs.
                  </p>

                </div>

                <div>

                  <h4 className="text-white font-semibold mb-4">
                    Sections
                  </h4>

                  <ul className="space-y-3 text-sm">

                    <li><Link href="/category/politics">Politics</Link></li>
                    <li><Link href="/category/defence">Defence</Link></li>
                    <li><Link href="/category/world">World</Link></li>
                    <li><Link href="/category/technology">Technology</Link></li>

                  </ul>

                </div>

                <div>

                  <h4 className="text-white font-semibold mb-4">
                    Company
                  </h4>

                  <ul className="space-y-3 text-sm">

                    <li><Link href="/about">About</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                    <li><Link href="/privacy">Privacy Policy</Link></li>
                    <li><Link href="/terms">Terms & Conditions</Link></li>
                    <li><Link href="/rss.xml">RSS Feed</Link></li>

                  </ul>

                </div>

                <div>

                  <h4 className="text-white font-semibold mb-4">
                    Stay Updated
                  </h4>

                  <NewsletterForm />

                  <div className="flex gap-5 text-gray-400">

                    <a href="https://www.facebook.com/share/1DYmGS1Ef1/" target="_blank">
                      <Facebook size={20}/>
                    </a>

                    <a href="https://www.instagram.com/nationpathindia/?hl=en" target="_blank">
                      <Instagram size={20}/>
                    </a>

                    <a href="https://x.com/nationpathindia" target="_blank">
                      <Twitter size={20}/>
                    </a>

                    <a href="https://www.youtube.com/@NationPathIndia" target="_blank">
                      <Youtube size={20}/>
                    </a>

                    <a href="/rss.xml">
                      <Rss size={20}/>
                    </a>

                  </div>

                </div>

              </div>

            </div>

            <div className="border-t border-gray-700 text-center py-6 text-sm text-gray-400 tracking-wide bg-black/20">

              © {new Date().getFullYear()}
              <span className="text-white font-semibold"> Nation Path </span>
              — Operated by
              <span className="text-white font-medium"> Suryapath Media, India</span>.
              All Rights Reserved.

            </div>

          </footer>

        </Providers>

      </body>
    </html>
  );
}