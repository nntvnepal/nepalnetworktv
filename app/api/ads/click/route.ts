import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {

  try {

    const body = await req.json();
    const { adId } = body;

    if (!adId) {
      return NextResponse.json(
        { success: false, message: "Ad ID missing" },
        { status: 400 }
      );
    }

    const ad = await prisma.ad.findUnique({
      where: { id: adId },
      select: {
        id: true,
        status: true,
        clicks: true,
        maxClicks: true
      }
    });

    if (!ad || ad.status !== "active") {
      return NextResponse.json({ success: false });
    }

    const updatedAd = await prisma.ad.update({
      where: { id: adId },
      data: {
        clicks: { increment: 1 }
      }
    });

    /* Auto pause when max clicks reached */

    if (updatedAd.maxClicks && updatedAd.clicks >= updatedAd.maxClicks) {

      await prisma.ad.update({
        where: { id: adId },
        data: {
          completed: true,
          status: "paused"
        }
      });

    }

    return NextResponse.json({ success: true });

  } catch (error) {

    console.error("Ad click error:", error);

    return NextResponse.json(
      { success: false, message: "Click tracking failed" },
      { status: 500 }
    );

  }

}