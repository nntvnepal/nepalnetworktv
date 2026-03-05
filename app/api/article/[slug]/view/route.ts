import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const article = await prisma.article.findUnique({
      where: {
        slug: params.slug,
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.article.update({
      where: {
        slug: params.slug,
      },
      data: {
        views: {
          increment: 1,
        },
        lastViewAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      views: updated.views,
    });
  } catch (error) {
    console.error("View update error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}