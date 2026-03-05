import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AD_PLACEMENTS } from "@/lib/adPlacements";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PlacementsPage() {

  const ads = await prisma.ad.findMany({
    where: {
      status: { not: "completed" }
    }
  });

  return (
    <div className="p-10 text-white">

      <h1 className="text-3xl font-bold mb-10">
        Ad Placement Performance
      </h1>

      <div className="space-y-6">

        {AD_PLACEMENTS.map((placement) => {

          const placementAds = ads.filter(
            (ad) => ad.placement === placement.value
          );

          const views = placementAds.reduce(
            (sum, ad) => sum + (ad.views ?? 0), 0
          );

          const clicks = placementAds.reduce(
            (sum, ad) => sum + (ad.clicks ?? 0), 0
          );

          const revenue = placementAds.reduce(
            (sum, ad) => sum + (ad.clicks ?? 0) * (ad.cpc ?? 0), 0
          );

          const ctr =
            views > 0
              ? ((clicks / views) * 100).toFixed(2)
              : "0.00";

          return (
            <div
              key={placement.value}
              className="bg-gray-800 p-6 rounded-xl flex justify-between items-center"
            >
              <div>

                <h3 className="font-semibold text-lg">
                  {placement.label} ({placement.size})
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  {placement.description}
                </p>

                <div className="flex gap-6 text-sm mt-3 text-gray-300">

                  <span>
                    Ads: {placementAds.length}
                  </span>

                  <span>
                    Views: {views}
                  </span>

                  <span>
                    Clicks: {clicks}
                  </span>

                  <span>
                    CTR: {ctr}%
                  </span>

                  <span className="text-green-400">
                    Revenue: ₹{revenue.toFixed(2)}
                  </span>

                </div>

              </div>

              <Link
                href={`/admin/ads?placement=${placement.value}`}
                className="bg-orange-500 px-5 py-2 rounded-lg hover:bg-orange-600"
              >
                Manage
              </Link>

            </div>
          );

        })}

      </div>

    </div>
  );
}