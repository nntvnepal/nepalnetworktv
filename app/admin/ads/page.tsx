import { prisma } from "@/lib/prisma"
import Link from "next/link"
import AdsChart from "@/components/admin/AdsChart"
import AdActions from "@/components/admin/AdActions"

type Props = {
  searchParams?: { page?: string }
}

const PAGE_SIZE = 10

export default async function AdsDashboard({ searchParams }: Props) {

  //////////////////////////////////////////////////////
  // PAGINATION
  //////////////////////////////////////////////////////

  const page = Number(searchParams?.page || 1)
  const skip = (page - 1) * PAGE_SIZE

  //////////////////////////////////////////////////////
  // FETCH ADS
  //////////////////////////////////////////////////////

  const [ads, totalAds] = await Promise.all([
    prisma.ad.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        placement: true,
        views: true,
        clicks: true,
        status: true,
        cpc: true,
        endDate: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE
    }),
    prisma.ad.count()
  ])

  const totalPages = Math.ceil(totalAds / PAGE_SIZE)
  const today = new Date()

  //////////////////////////////////////////////////////
  // GLOBAL STATS
  //////////////////////////////////////////////////////

  const statsAds = await prisma.ad.findMany({
    select: {
      views: true,
      clicks: true,
      cpc: true,
      status: true
    }
  })

  const totalViews = statsAds.reduce((s, a) => s + (a.views || 0), 0)
  const totalClicks = statsAds.reduce((s, a) => s + (a.clicks || 0), 0)
  const activeAds = statsAds.filter(a => a.status === "active").length

  const totalRevenue = statsAds.reduce((sum, a) => {
    return sum + ((a.cpc || 0) * a.clicks)
  }, 0)

  //////////////////////////////////////////////////////
  // CHART DATA
  //////////////////////////////////////////////////////

  const chartData = statsAds.slice(0, 7).map((a, i) => ({
    date: `Ad ${i + 1}`,
    views: a.views,
    clicks: a.clicks
  }))

  //////////////////////////////////////////////////////
  // TOP ADS
  //////////////////////////////////////////////////////

  const topAds = await prisma.ad.findMany({
    orderBy: { clicks: "desc" },
    take: 5
  })

  //////////////////////////////////////////////////////
  // EXPIRED
  //////////////////////////////////////////////////////

  const expiredAds = await prisma.ad.findMany({
    where: {
      endDate: { lt: today }
    },
    select: { id: true, title: true }
  })

  //////////////////////////////////////////////////////
  // PAGE
  //////////////////////////////////////////////////////

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Ads Dashboard
          </h1>

          <p className="text-gray-400 text-sm">
            Manage campaigns, monitor performance and track revenue
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/ads/create"
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm"
          >
            Create Ad
          </Link>

          <Link
            href="/api/ads/report"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm"
          >
            Download Report
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <Card title="Total Ads" value={totalAds} />
        <Card title="Total Views" value={totalViews.toLocaleString()} />
        <Card title="Total Clicks" value={totalClicks.toLocaleString()} />
        <Card title="Active Campaigns" value={activeAds} />
        <Card title="Revenue" value={`$${totalRevenue.toFixed(2)}`} />
      </div>

      {/* CHART */}
      <div className="bg-[#1b0633] border border-white/10 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">
          Performance Overview
        </h2>
        <AdsChart data={chartData} />
      </div>

      {/* TOP ADS */}
      <div className="bg-[#1b0633] border border-white/10 rounded-xl p-6">

        <h2 className="text-white text-lg font-semibold mb-4">
          Top Performing Ads
        </h2>

        <table className="w-full text-sm text-gray-300">
          <thead className="text-gray-400 border-b border-white/10">
            <tr>
              <th className="p-3 text-left">Ad</th>
              <th className="p-3 text-center">Views</th>
              <th className="p-3 text-center">Clicks</th>
              <th className="p-3 text-center">CTR</th>
            </tr>
          </thead>

          <tbody>
            {topAds.map(ad => {
              const ctr = ad.views > 0 ? (ad.clicks / ad.views) * 100 : 0

              return (
                <tr key={ad.id} className="border-t border-white/10">
                  <td className="p-3 text-white">{ad.title}</td>
                  <td className="p-3 text-center">{ad.views}</td>
                  <td className="p-3 text-center">{ad.clicks}</td>

                  <td className={`p-3 text-center font-semibold ${
                    ctr >= 5
                      ? "text-green-400"
                      : ctr >= 2
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}>
                    {ctr.toFixed(2)}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

      </div>

      {/* MAIN TABLE */}
      <div className="bg-[#1b0633] border border-white/10 rounded-xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm text-gray-300">

            <thead className="bg-black/30 text-gray-400">
              <tr>
                <th className="p-4 text-left">Ad</th>
                <th className="p-4 text-center">Type</th>
                <th className="p-4 text-center">Placement</th>
                <th className="p-4 text-center">Views</th>
                <th className="p-4 text-center">Clicks</th>
                <th className="p-4 text-center">CTR</th>
                <th className="p-4 text-center">Days Left</th>
                <th className="p-4 text-center">Revenue</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {ads.map(ad => {

                const ctr = ad.views > 0 ? (ad.clicks / ad.views) * 100 : 0

                let daysLeft: number | "-" = "-"

                if (ad.endDate) {
                  const diff = Math.ceil(
                    (new Date(ad.endDate).getTime() - today.getTime()) /
                    (1000 * 60 * 60 * 24)
                  )
                  daysLeft = diff > 0 ? diff : 0
                }

                let status = ad.status

                if (ad.endDate && new Date(ad.endDate) < today) {
                  status = "expired"
                }

                const revenue = ad.cpc
                  ? ad.cpc * ad.clicks
                  : 0

                return (
                  <tr key={ad.id} className="border-t border-white/5 hover:bg-white/5">

                    <td className="p-4 text-white font-medium">{ad.title}</td>

                    <td className="p-4 text-center">{ad.type}</td>

                    <td className="p-4 text-center text-xs">{ad.placement}</td>

                    <td className="p-4 text-center">{ad.views}</td>

                    <td className="p-4 text-center">{ad.clicks}</td>

                    <td className={`p-4 text-center font-semibold ${
                      ctr >= 5
                        ? "text-green-400"
                        : ctr >= 2
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}>
                      {ctr.toFixed(2)}%
                    </td>

                    <td className="p-4 text-center">{daysLeft}</td>

                    <td className="p-4 text-center">
                      ${revenue.toFixed(2)}
                    </td>

                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${
                        status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : status === "expired"
                          ? "bg-gray-500/20 text-gray-300"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {status}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <AdActions ad={ad} />
                    </td>

                  </tr>
                )
              })}
            </tbody>

          </table>

        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-4 py-6">

          <Link
            href={`/admin/ads?page=${page - 1}`}
            className={`px-4 py-2 bg-white/10 rounded ${
              page <= 1 ? "pointer-events-none opacity-40" : ""
            }`}
          >
            Prev
          </Link>

          <span className="text-gray-300 text-sm">
            Page {page} / {totalPages || 1}
          </span>

          <Link
            href={`/admin/ads?page=${page + 1}`}
            className={`px-4 py-2 bg-white/10 rounded ${
              page >= totalPages ? "pointer-events-none opacity-40" : ""
            }`}
          >
            Next
          </Link>

        </div>

      </div>

      {/* EXPIRED */}
      <div className="bg-[#1b0633] border border-white/10 rounded-xl p-6">

        <h2 className="text-white text-lg font-semibold mb-4">
          Expired Campaigns
        </h2>

        {expiredAds.length === 0 ? (
          <p className="text-gray-400">No expired ads</p>
        ) : (
          <ul className="space-y-2">
            {expiredAds.map(ad => (
              <li key={ad.id} className="text-gray-300">
                {ad.title}
              </li>
            ))}
          </ul>
        )}

      </div>

    </div>
  )
}

//////////////////////////////////////////////////////
// CARD
//////////////////////////////////////////////////////

function Card({ title, value }: { title: string, value: any }) {
  return (
    <div className="bg-[#1b0633] border border-white/10 p-6 rounded-xl">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
  )
}