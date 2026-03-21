import "leaflet/dist/leaflet.css"
import Providers from "./providers"
import "./globals.css"

import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { headers } from "next/headers"

import TopDateTime from "@/components/TopDateTime"
import DarkModeToggle from "@/components/DarkModeToggle"
import NewsletterForm from "@/components/NewsletterForm"
import HeaderMenu from "@/components/HeaderMenu"

import { prisma } from "@/lib/prisma"

import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Search,
  Rss
} from "lucide-react"

/* ================= SEO ================= */

export const metadata: Metadata = {
  title: "नेपाल नेटवर्क टेलिभिजन (NNTV)",
  description:
    "नेपाल नेटवर्क टेलिभिजन (NNTV) ‘Media Beyond the Nation’ समाचार, मनोरञ्जन, संस्कृति र प्रविधिका विविध सामग्रीसहित आधुनिक विश्वसँग जोडिने स्वर",
}

/* ================= LAYOUT ================= */

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  /* ================= ROUTE DETECTION (FIXED) ================= */

  let pathname = ""

  try {
    const h = headers()

    // ✅ multi-source fallback (THIS IS THE FIX)
    pathname =
      h.get("x-invoke-path") ||
      h.get("next-url") ||
      h.get("referer") ||
      ""
  } catch {
    pathname = ""
  }

  const isAdmin = pathname.includes("/admin")

  const isTV =
    pathname.includes("/ticker") ||
    pathname.includes("/tv") ||
    pathname.includes("/teleprompter")

  /* ================= FETCH CATEGORIES (SAFE) ================= */

  let categories: any[] = []

  if (!isAdmin && !isTV) {
    try {
      categories = await prisma.category.findMany({
        where: { status: "active" },
        orderBy: { priority: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          priority: true,
          status: true,
          createdAt: true,
        },
      })
    } catch (err) {
      console.error("CATEGORY LOAD ERROR:", err)
      categories = []
    }
  }

  /* ================= UI ================= */

  return (
    <html lang="ne">
      <body className="bg-[#f6f7fb] text-[#111] min-h-screen flex flex-col">

        <div className="scroll-indicator"></div>

        <Providers>

          {/* ================= ADMIN / TV MODE ================= */}

          {(isAdmin || isTV) ? (
            children
          ) : (
            <>
              {/* ================= TOP BAR ================= */}

              <div className="nntv-bg text-white">
                <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center text-xs">
                  <TopDateTime />

                  <div className="flex items-center gap-4">
                    <Link
                      href="/search"
                      className="flex items-center gap-1 hover:text-yellow-300"
                    >
                      <Search size={14} />
                      खोज्नुहोस्
                    </Link>

                    <DarkModeToggle />

                    <Link href="/login" className="hover:text-yellow-300">
                      लगइन
                    </Link>
                  </div>
                </div>
              </div>

              {/* ================= HEADER ================= */}

              <header className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                  <Link href="/" className="flex items-center gap-5">

                    <Image
                      src="/logo.png"
                      alt="NNTV"
                      width={60}
                      height={60}
                      className="logo-shadow"
                      style={{ height: "auto" }}
                      priority
                    />

                    <div>
                      <h1 className="logo-title text-2xl text-[#3b0a45] font-semibold">
                        नेपाल नेटवर्क टेलिभिजन <span className="ml-2">NNTV</span>
                      </h1>

                      <p className="text-sm text-gray-600">
                        Media Beyond the Nation
                      </p>
                    </div>

                  </Link>

                  <HeaderMenu categories={categories || []} />

                </div>

                <div className="h-[2px] w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400"></div>
              </header>

              {/* ================= MAIN ================= */}

              <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8">
                {children}
              </main>

              {/* ================= FOOTER ================= */}

              <footer className="nntv-bg text-gray-300 mt-20">
                <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">

                  <div>
                    <h3 className="logo-title text-white text-lg font-semibold">
                      नेपाल नेटवर्क टेलिभिजन <span className="ml-2">NNTV</span>
                    </h3>

                    <p className="text-sm mt-3">
                      समाचार, मनोरञ्जन, संस्कृति र प्रविधिका विविध सामग्रीसहित आधुनिक विश्वसँग जोडिने स्वर।
                    </p>
                  </div>

                  <div>
                    <h4 className="text-white mb-3 font-semibold">खण्डहरू</h4>
                    <ul className="space-y-2 text-sm">
                      <li><Link href="/category/news">समाचार</Link></li>
                      <li><Link href="/category/entertainment">मनोरञ्जन</Link></li>
                      <li><Link href="/category/technology">प्रविधि</Link></li>
                      <li><Link href="/astrology">राशिफल</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white mb-3 font-semibold">कम्पनी</h4>
                    <ul className="space-y-2 text-sm">
                      <li><Link href="/about">हाम्रो बारेमा</Link></li>
                      <li><Link href="/contact">सम्पर्क</Link></li>
                      <li><Link href="/privacy-policy">गोपनीयता नीति</Link></li>
                      <li><Link href="/editorial-policy">सम्पादकीय नीति</Link></li>
                      <li><Link href="/terms">प्रयोग सर्तहरू</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white mb-3 font-semibold">न्युजलेटर</h4>

                    <NewsletterForm />

                    <div className="flex gap-4 mt-4">
                      <Facebook size={18} />
                      <Instagram size={18} />
                      <Twitter size={18} />
                      <Youtube size={18} />
                      <Rss size={18} />
                    </div>
                  </div>

                </div>

                <div className="text-center text-xs py-4 border-t border-purple-900">
                  © {new Date().getFullYear()} नेपाल नेटवर्क टेलिभिजन (NNTV) DAR Group of Industries द्वारा सञ्चालित, Designed by TitanArt Studio-Chennai
                </div>

              </footer>

            </>
          )}

        </Providers>

      </body>
    </html>
  )
}