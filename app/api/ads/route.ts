import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      title,
      placement,
      type,
      imageUrl,
      link,
      adsenseCode,
      priority,
      status,
      totalBudget,
      cpc,
      maxClicks,
      startDate,
      endDate
    } = body;

    /* ===============================
       VALIDATION
    =============================== */

    if (!title || !placement || !type) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    if (type === "image" && !imageUrl) {
      return NextResponse.json(
        { success: false, message: "Image required for image ads" },
        { status: 400 }
      );
    }

    /* ===============================
       DATE HANDLING
    =============================== */

    let start: Date | null = null;
    let end: Date | null = null;

    if (startDate) {
      start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
    }

    if (endDate) {
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    }

    /* ===============================
       CREATE AD
    =============================== */

    const ad = await prisma.ad.create({

      data: {

        title,

        placement: placement as any,
        type: type as any,

        imageUrl: imageUrl || null,
        link: link || null,
        adsenseCode: adsenseCode || null,

        priority: priority ? Number(priority) : 1,

        status: status || "active",

        startDate: start,
        endDate: end,

        totalBudget: totalBudget ? Number(totalBudget) : null,
        cpc: cpc ? Number(cpc) : null,
        maxClicks: maxClicks ? Number(maxClicks) : null

      }

    });

    return NextResponse.json({
      success: true,
      ad
    });

  } catch (error) {

    console.error("Ad creation error:", error);

    return NextResponse.json(
      { success: false, message: "Ad creation failed" },
      { status: 500 }
    );

  }

}