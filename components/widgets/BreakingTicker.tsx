import { prisma } from "@/lib/prisma"

export default async function BreakingTicker() {
  try {
    //////////////////////////////////////////////////////
    // FETCH (ACTIVE + NOT EXPIRED)
    //////////////////////////////////////////////////////

    const now = new Date()

    const news = await prisma.breakingNews.findMany({
      where: {
        isActive: true,
        OR: [
          { expireAt: null },
          { expireAt: { gte: now } }
        ]
      },
      orderBy: { priority: "desc" },
      take: 5,
    })

    //////////////////////////////////////////////////////
    // FALLBACK (if filter fails)
    //////////////////////////////////////////////////////

    const safeNews = news.length
      ? news
      : await prisma.breakingNews.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
        })

    //////////////////////////////////////////////////////
    // CLEAN DATA
    //////////////////////////////////////////////////////

    const headlines = safeNews
      .map((n) => n.headline?.trim())
      .filter((h): h is string => !!h)

    if (headlines.length === 0) return null

    //////////////////////////////////////////////////////
    // UI
    //////////////////////////////////////////////////////

    return (
      <div className="breaking-wrapper flex items-center rounded-xl overflow-hidden mb-6 shadow-md border border-gray-200">

        {/* LABEL */}
        <div className="flex items-center gap-2 px-5 py-2 text-white font-semibold
        bg-gradient-to-r from-[#4b0c4b] via-[#5e145e] to-[#3d063d] whitespace-nowrap">

          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>

          ब्रेकिङ
        </div>

        {/* TICKER */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          <div className="ticker-track flex whitespace-nowrap text-gray-800 font-medium py-2">

            {[...headlines, ...headlines].map((h, i) => (
              <span
                key={i}
                className="ticker-item px-6 inline-block"
              >
                {h}
              </span>
            ))}

          </div>
        </div>

      </div>
    )
  } catch (error) {
    //////////////////////////////////////////////////////
    // FAIL SAFE UI (IMPORTANT)
    //////////////////////////////////////////////////////
    console.error("BreakingTicker Error:", error)

    return (
      <div className="p-2 text-sm text-red-500">
        Breaking news unavailable
      </div>
    )
  }
}