import Providers from "./providers";
import "./globals.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import Link from "next/link";
import Image from "next/image";
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

/* ================= SEO ================= */

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nationpathindia.com"),
  title: {
    default: "Nation Path – Breaking News",
    template: "%s | Nation Path",
  },
  description:
    "Nation Path is an independent digital newsroom delivering credible journalism across politics, defence, technology and global affairs.",
};

/* ================= LAYOUT ================= */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-gray-50 dark:bg-[#0a0f1c] text-black dark:text-gray-200 min-h-screen flex flex-col font-[var(--font-body)]">

        <Providers>

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

                <div className="border rounded-md px-2 py-1 flex items-center">
                  <DarkModeToggle />
                </div>

                <Link
                  href="/login"
                  className="border px-3 py-1 rounded-md"
                >
                  Login
                </Link>

              </div>

            </div>

          </div>

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

                <h1 className="text-2xl font-bold font-[var(--font-heading)]">
                  NATION PATH
                </h1>

              </Link>

              <nav className="hidden md:flex items-center gap-6 text-sm">

                <Link href="/">Home</Link>
                <Link href="/category/politics">Politics</Link>
                <Link href="/category/defence">Defence</Link>
                <Link href="/category/world">World</Link>
                <Link href="/category/technology">Technology</Link>

              </nav>

            </div>

          </header>

          {/* MAIN */}

          <main className="flex-grow">
            {children}
          </main>

          {/* FOOTER */}

          <footer className="mt-24 bg-[#0e1a33] text-gray-300">

            <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-12">

              <div>

                <h3 className="text-xl font-bold text-white mb-4">
                  Nation Path
                </h3>

                <p className="text-sm">
                  Independent digital newsroom delivering credible journalism.
                </p>

              </div>

              <div>

                <h4 className="text-white mb-3">Sections</h4>

                <ul className="space-y-2 text-sm">
                  <li><Link href="/category/politics">Politics</Link></li>
                  <li><Link href="/category/defence">Defence</Link></li>
                  <li><Link href="/category/world">World</Link></li>
                </ul>

              </div>

              <div>

                <h4 className="text-white mb-3">Company</h4>

                <ul className="space-y-2 text-sm">
                  <li><Link href="/about">About</Link></li>
                  <li><Link href="/contact">Contact</Link></li>
                  <li><Link href="/privacy">Privacy</Link></li>
                </ul>

              </div>

              <div>

                <h4 className="text-white mb-3">Newsletter</h4>

                <NewsletterForm />

                <div className="flex gap-4 mt-4">

                  <Facebook size={18}/>
                  <Instagram size={18}/>
                  <Twitter size={18}/>
                  <Youtube size={18}/>
                  <Rss size={18}/>

                </div>

              </div>

            </div>

            <div className="text-center text-sm py-6 border-t border-gray-700">
              © {new Date().getFullYear()} Nation Path
            </div>

          </footer>

        </Providers>

      </body>
    </html>
  );
}