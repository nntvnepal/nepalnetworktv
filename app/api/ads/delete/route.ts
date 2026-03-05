import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
      select: { id: true }
    });

    if (!ad) {
      return NextResponse.json(
        { success: false, message: "Ad not found" },
        { status: 404 }
      );
    }

    await prisma.ad.delete({
      where: { id: adId }
    });

    return NextResponse.json({ success: true });

  } catch (error) {

    console.error("Ad delete error:", error);

    return NextResponse.json(
      { success: false, message: "Delete failed" },
      { status: 500 }
    );

  }

}