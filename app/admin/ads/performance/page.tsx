import { prisma } from "@/lib/prisma";
import Link from "next/link";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function PerformancePage() {

  const ads = await prisma.ad.findMany({
    orderBy: { createdAt: "desc" }
  });

  const totalViews = ads.reduce(
    (sum, ad) => sum + (ad.views ?? 0),
    0
  );

  const totalClicks = ads.reduce(
    (sum, ad) => sum + (ad.clicks ?? 0),
    0
  );

  const totalRevenue = ads.reduce(
    (sum, ad) => sum + (ad.clicks ?? 0) * (ad.cpc ?? 0),
    0
  );

  const ctr =
    totalViews > 0
      ? ((totalClicks / totalViews) * 100).toFixed(2)
      : "0.00";

  return (
    <div className="p-10 text-white">

      <h1 className="text-3xl font-bold mb-10">
        Campaign Performance
      </h1>

      {/* Stats */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">

        <StatBox label="Total Views" value={totalViews} />
        <StatBox label="Total Clicks" value={totalClicks} />
        <StatBox label="CTR" value={`${ctr}%`} />
        <StatBox label="Revenue" value={`₹${totalRevenue.toFixed(2)}`} />

      </div>

      {/* Table */}

      <div className="overflow-x-auto bg-gray-900 rounded-xl">

        <table className="w-full text-sm">

          <thead className="bg-gray-800 text-gray-300 uppercase text-xs">
            <tr>
              <th className="p-4 text-left">Campaign</th>
              <th>Placement</th>
              <th>Status</th>
              <th>Views</th>
              <th>Clicks</th>
              <th>CTR</th>
              <th>Revenue</th>
              <th>Report</th>
            </tr>
          </thead>

          <tbody>

            {ads.map((ad) => {

              const views = ad.views ?? 0;
              const clicks = ad.clicks ?? 0;

              const adCtr =
                views > 0
                  ? ((clicks / views) * 100).toFixed(2)
                  : "0.00";

              const revenue = clicks * (ad.cpc ?? 0);

              return (
                <tr
                  key={ad.id}
                  className="border-b border-gray-700 text-center hover:bg-gray-800"
                >

                  <td className="p-4 text-left font-medium">
                    {ad.title}
                  </td>

                  <td className="capitalize">
                    {ad.placement.replace(/_/g, " ")}
                  </td>

                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        ad.status === "active"
                          ? "bg-green-600"
                          : ad.status === "paused"
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                    >
                      {ad.status}
                    </span>

                  </td>

                  <td>{views}</td>

                  <td>{clicks}</td>

                  <td className="text-orange-400 font-semibold">
                    {adCtr}%
                  </td>

                  <td className="text-green-400 font-semibold">
                    ₹{revenue.toFixed(2)}
                  </td>

                  <td>

                    <Link
                      href={`/api/ads/report?id=${ad.id}`}
                      className="bg-orange-500 px-4 py-1 rounded text-xs hover:bg-orange-600"
                    >
                      Download
                    </Link>

                  </td>

                </tr>
              );

            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}

/* Stat Box */

function StatBox({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl">
      <h3 className="text-gray-400 text-sm">{label}</h3>
      <p className="text-3xl font-bold mt-2 text-orange-400">
        {value}
      </p>
    </div>
  );
}