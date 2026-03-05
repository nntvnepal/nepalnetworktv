import { prisma } from "@/lib/prisma";
import RevenueDashboard from "@/components/admin/RevenueDashboard";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function RevenuePage() {

  const ads = await prisma.ad.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalViews = ads.reduce((sum, ad) => sum + (ad.views ?? 0), 0);
  const totalClicks = ads.reduce((sum, ad) => sum + (ad.clicks ?? 0), 0);

  const totalRevenue = ads.reduce((sum, ad) => {
    const clicks = ad.clicks ?? 0;
    const cpc = ad.cpc ?? 0;
    return sum + clicks * cpc;
  }, 0);

  const activeCampaigns = ads.filter(
    (ad) => ad.status === "active"
  ).length;

  const monthlyRevenue: Record<string, number> = {};

  ads.forEach((ad) => {
    const month = new Date(ad.createdAt).toLocaleString("default", {
      month: "short",
    });

    const revenue = (ad.clicks ?? 0) * (ad.cpc ?? 0);

    if (!monthlyRevenue[month]) {
      monthlyRevenue[month] = 0;
    }

    monthlyRevenue[month] += revenue;
  });

  const chartData = Object.keys(monthlyRevenue).map((month) => ({
    month,
    revenue: monthlyRevenue[month],
  }));

  return (
    <RevenueDashboard
      ads={ads}
      totalViews={totalViews}
      totalClicks={totalClicks}
      totalRevenue={totalRevenue}
      activeCampaigns={activeCampaigns}
      chartData={chartData}
    />
  );
}