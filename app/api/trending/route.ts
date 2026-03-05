import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {

  try {

    /* ================= LAST 24 HOURS ================= */

    const last24Hours = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    );

    const trending = await prisma.article.findMany({

      where: {
        status: "approved",
        isDeleted: false,
        lastViewAt: {
          gte: last24Hours
        }
      },

      orderBy: {
        trendingScore: "desc"
      },

      take: 10,

      select: {
        id: true,
        title: true,
        slug: true,
        images: true,
        views: true,
        trendingScore: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }

    });

    return NextResponse.json({
      success: true,
      articles: trending
    });

  } catch (error) {

    console.error("TRENDING API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch trending articles"
      },
      { status: 500 }
    );

  }

}