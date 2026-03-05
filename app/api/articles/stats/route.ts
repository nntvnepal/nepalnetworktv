import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { PostStatus } from "@prisma/client";

/* IMPORTANT: prevents build-time execution */
export const dynamic = "force-dynamic";

export async function GET() {

  try {

    const [
      total,
      pending,
      approved,
      rejected,
      draft,
      featured,
      breaking,
      editorial
    ] = await Promise.all([

      prisma.article.count(),

      prisma.article.count({
        where: { status: PostStatus.pending }
      }),

      prisma.article.count({
        where: { status: PostStatus.approved }
      }),

      prisma.article.count({
        where: { status: PostStatus.rejected }
      }),

      prisma.article.count({
        where: { status: PostStatus.draft }
      }),

      prisma.article.count({
        where: { featured: true }
      }),

      prisma.article.count({
        where: { breaking: true }
      }),

      prisma.article.count({
        where: { isEditorial: true }
      }),

    ]);

    return NextResponse.json({
      success: true,
      stats: {
        total,
        pending,
        approved,
        rejected,
        draft,
        featured,
        breaking,
        editorial
      }
    });

  } catch (error) {

    console.error("ARTICLE STATS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch article stats"
      },
      { status: 500 }
    );

  }

}