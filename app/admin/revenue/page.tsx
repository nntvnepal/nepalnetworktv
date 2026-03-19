import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function RevenuePage() {

  //////////////////////////////////////////////////////
  // FETCH ADS
  //////////////////////////////////////////////////////

  const ads = await prisma.ad.findMany({
    orderBy: { createdAt: "desc" },
  })

  //////////////////////////////////////////////////////
  // CALCULATIONS
  //////////////////////////////////////////////////////

  const totalViews = ads.reduce(
    (sum, ad) => sum + (ad.views ?? 0),
    0
  )

  const totalClicks = ads.reduce(
    (sum, ad) => sum + (ad.clicks ?? 0),
    0
  )

  const totalRevenue = ads.reduce((sum, ad) => {
    const clicks = ad.clicks ?? 0
    const cpc = ad.cpc ?? 0
    return sum + clicks * cpc
  }, 0)

  const activeCampaigns = ads.filter(
    (ad) => ad.status === "active"
  ).length

  //////////////////////////////////////////////////////
  // MONTHLY DATA
  //////////////////////////////////////////////////////

  const monthlyRevenue: Record<string, number> = {}

  ads.forEach((ad) => {
    const month = new Date(ad.createdAt).toLocaleString("default", {
      month: "short",
    })

    const revenue = (ad.clicks ?? 0) * (ad.cpc ?? 0)

    monthlyRevenue[month] =
      (monthlyRevenue[month] || 0) + revenue
  })

  const chartData = Object.keys(monthlyRevenue).map((month) => ({
    month,
    revenue: monthlyRevenue[month],
  }))

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <div className="p-8 space-y-8 text-white bg-gradient-to-br from-[#1a002f] to-[#0b001a] min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Revenue Dashboard
        </h1>
        <p className="text-purple-300">
          Ads Performance Overview
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <StatCard title="Total Views" value={totalViews} />
        <StatCard title="Total Clicks" value={totalClicks} />
        <StatCard title="Total Revenue" value={`₹ ${totalRevenue.toFixed(2)}`} />
        <StatCard title="Active Campaigns" value={activeCampaigns} />

      </div>

      {/* MONTHLY REVENUE */}
      <div className="bg-purple-900/40 p-6 rounded">

        <h2 className="mb-4 font-semibold">
          Monthly Revenue
        </h2>

        <div className="space-y-2">

          {chartData.map((d, i) => (
            <div
              key={i}
              className="flex justify-between bg-purple-800/40 px-4 py-2 rounded"
            >
              <span>{d.month}</span>
              <span className="text-green-400">
                ₹ {d.revenue.toFixed(2)}
              </span>
            </div>
          ))}

        </div>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border border-purple-800 rounded">

        <table className="min-w-full text-sm">

          <thead className="bg-purple-900">
            <tr>
              <th className="p-3 text-left">Ad</th>
              <th className="p-3 text-left">Views</th>
              <th className="p-3 text-left">Clicks</th>
              <th className="p-3 text-left">Revenue</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>

            {ads.map((ad) => {
              const revenue =
                (ad.clicks ?? 0) * (ad.cpc ?? 0)

              return (
                <tr
                  key={ad.id}
                  className="border-t border-purple-800 hover:bg-purple-900/40"
                >
                  <td className="p-3">{ad.title || "Ad"}</td>
                  <td className="p-3">{ad.views ?? 0}</td>
                  <td className="p-3">{ad.clicks ?? 0}</td>
                  <td className="p-3 text-green-400">
                    ₹ {revenue.toFixed(2)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        ad.status === "active"
                          ? "bg-green-600"
                          : "bg-gray-600"
                      }`}
                    >
                      {ad.status}
                    </span>
                  </td>
                </tr>
              )
            })}

          </tbody>

        </table>

      </div>

    </div>
  )
}

//////////////////////////////////////////////////////
// SMALL COMPONENT
//////////////////////////////////////////////////////

function StatCard({
  title,
  value,
}: {
  title: string
  value: any
}) {
  return (
    <div className="bg-purple-900/40 p-4 rounded">
      <p className="text-sm text-purple-300">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}