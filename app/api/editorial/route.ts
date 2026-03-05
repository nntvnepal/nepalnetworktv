import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {

  try {

    /* ================= SAFE BODY PARSE ================= */

    let body;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { title, slug, content, excerpt, images } = body;

    /* ================= VALIDATION ================= */

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Title and content required" },
        { status: 400 }
      );
    }

    /* ================= CREATE EDITORIAL ================= */

    const article = await prisma.article.create({

      data: {
        title: title.trim(),
        slug,
        content,
        excerpt: excerpt || "",
        images: Array.isArray(images) ? images : [],
        isEditorial: true,
        status: "approved",
        publishedAt: new Date()
      },

      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true
      }

    });

    return NextResponse.json({
      success: true,
      article
    });

  } catch (error) {

    console.error("EDITORIAL CREATE ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Failed to create editorial" },
      { status: 500 }
    );

  }

}