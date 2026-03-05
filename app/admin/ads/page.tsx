import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";
export const revalidate = 0;
export const dynamic = "force-dynamic";

/* ---------------- SERVER ACTIONS ---------------- */

async function toggleStatus(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  const currentStatus = formData.get("status") as string;

  await prisma.ad.update({
    where: { id },
    data: {
      status: currentStatus === "active" ? "paused" : "active",
    },
  });

  revalidatePath("/admin/ads");
}

async function deleteAd(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;

  await prisma.ad.delete({
    where: { id },
  });

  revalidatePath("/admin/ads");
}

/* ---------------- HELPERS ---------------- */

function getDaysLeft(endDate: Date | null) {
  if (!endDate) return "N/A";

  const today = new Date();
  const end = new Date(endDate);

  const diff = end.getTime() - today.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return "Expired";
  return `${days} days`;
}

/* ---------------- PAGE ---------------- */

export default async function AdsPage() {

  const today = new Date();

  /* Auto complete expired ads */
  await prisma.ad.updateMany({
    where: {
      endDate: { not: null, lt: today },
      completed: false,
    },
    data: {
      status: "completed",
      completed: true,
    },
  });

  const ads = await prisma.ad.findMany({
    orderBy: { createdAt: "desc" },
  });

  const activeAds = ads.filter((ad) => ad.status !== "completed");
  const expiredAds = ads
    .filter((ad) => ad.status === "completed")
    .slice(0, 3);

  /* ---------------- CALCULATIONS ---------------- */

  const totalViews = activeAds.reduce((sum, ad) => sum + (ad.views ?? 0), 0);
  const totalClicks = activeAds.reduce((sum, ad) => sum + (ad.clicks ?? 0), 0);

  const totalRevenue = activeAds.reduce(
    (sum, ad) => sum + (ad.clicks ?? 0) * (ad.cpc ?? 0),
    0
  );

  const overallCTR =
    totalViews > 0
      ? ((totalClicks / totalViews) * 100).toFixed(2)
      : "0.00";

  const rpm =
    totalViews > 0
      ? ((totalRevenue / totalViews) * 1000).toFixed(2)
      : "0.00";

  const stats = {
    total: activeAds.length,
    active: activeAds.filter((ad) => ad.status === "active").length,
    paused: activeAds.filter((ad) => ad.status === "paused").length,
  };

  return (
    <div className="p-10 text-white">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold tracking-wide">
          Advertisement Manager
        </h1>

        <Link
          href="/admin/ads/create"
          className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg transition"
        >
          + Create Ad
        </Link>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 mb-10">

        <StatBox label="Total Ads" value={stats.total} />
        <StatBox label="Active Ads" value={stats.active} />
        <StatBox label="Paused Ads" value={stats.paused} />
        <StatBox label="Views" value={totalViews} />
        <StatBox label="Clicks" value={totalClicks} />
        <StatBox label="CTR" value={`${overallCTR}%`} />
        <StatBox label="Revenue" value={`₹${totalRevenue.toFixed(2)}`} />
        <StatBox label="RPM" value={`₹${rpm}`} />

      </div>

      {/* ACTIVE ADS TABLE */}

      <div className="overflow-x-auto bg-gray-900 rounded-xl shadow-lg mb-12">

        <table className="w-full text-sm">

          <thead className="bg-gray-800 text-gray-300 uppercase text-xs">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th>Placement</th>
              <th>Status</th>
              <th>Valid Upto</th>
              <th>Days</th>
              <th>Views</th>
              <th>Clicks</th>
              <th>CTR</th>
              <th>Revenue</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {activeAds.map((ad) => {

              const views = ad.views ?? 0;
              const clicks = ad.clicks ?? 0;

              const ctr =
                views > 0
                  ? ((clicks / views) * 100).toFixed(2)
                  : "0.00";

              const revenue = clicks * (ad.cpc ?? 0);
              const daysLeft = getDaysLeft(ad.endDate);

              return (
                <tr
                  key={ad.id}
                  className="border-b border-gray-700 hover:bg-gray-800 text-center"
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
                          : "bg-yellow-600"
                      }`}
                    >
                      {ad.status}
                    </span>
                  </td>

                  <td>
                    {ad.endDate
                      ? new Date(ad.endDate).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td>{daysLeft}</td>

                  <td>{views}</td>
                  <td>{clicks}</td>

                  <td className="text-orange-400 font-semibold">
                    {ctr}%
                  </td>

                  <td className="text-green-400 font-semibold">
                    ₹{revenue.toFixed(2)}
                  </td>

                  <td className="space-x-3">

                    <form action={toggleStatus} className="inline">
                      <input type="hidden" name="id" value={ad.id} />
                      <input type="hidden" name="status" value={ad.status} />

                      <button
                        type="submit"
                        className="text-yellow-400 hover:underline"
                      >
                        {ad.status === "active"
                          ? "Pause"
                          : "Activate"}
                      </button>
                    </form>

                    <form action={deleteAd} className="inline">
                      <input type="hidden" name="id" value={ad.id} />

                      <button
                        type="submit"
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </form>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

      {/* RECENT EXPIRED ADS */}

      {expiredAds.length > 0 && (

        <div className="bg-gray-900 rounded-xl p-6">

          <h2 className="text-xl font-semibold mb-4 text-red-400">
            Recently Completed Ads
          </h2>

          <div className="space-y-3">

            {expiredAds.map((ad) => {

              const revenue = (ad.clicks ?? 0) * (ad.cpc ?? 0);

              return (
                <div
                  key={ad.id}
                  className="flex justify-between border-b border-gray-700 pb-2"
                >

                  <span className="font-medium">
                    {ad.title}
                  </span>

                  <span className="text-gray-400">
                    Views: {ad.views ?? 0}
                  </span>

                  <span className="text-gray-400">
                    Clicks: {ad.clicks ?? 0}
                  </span>

                  <span className="text-green-400">
                    ₹{revenue.toFixed(2)}
                  </span>

                </div>
              );
            })}

          </div>

        </div>

      )}

    </div>
  );
}

/* ---------------- STAT BOX ---------------- */

function StatBox({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="text-gray-400 text-sm">{label}</h3>
      <p className="text-3xl font-bold mt-2 text-orange-400">{value}</p>
    </div>
  );
}