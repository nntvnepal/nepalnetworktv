import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import slugify from "slugify";

export const dynamic = "force-dynamic";

/* ================= UTIL ================= */

function stripHtml(html: string) {
  return html?.replace(/<[^>]*>?/gm, "") || "";
}

/* ================= SLUG ================= */

function createBaseSlug(title: string) {

  const base = slugify(title, {
    lower: true,
    strict: true,
    trim: true
  });

  return base || `news-${Date.now()}`;
}

async function generateUniqueSlug(title: string) {

  const baseSlug = createBaseSlug(title);

  let slug = baseSlug;
  let counter = 1;

  while (true) {

    const exists = await prisma.article.findFirst({
      where: { slug }
    });

    if (!exists) break;

    slug = `${baseSlug}-${counter}`;
    counter++;

  }

  return slug;

}

/* ================= GET NEWS ARTICLES ================= */

export async function GET() {

  try {

    const articles = await prisma.article.findMany({

      where: {
        isDeleted: false,

        /* 🚨 VERY IMPORTANT */
        isAstrology: false
      },

      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },

      orderBy: {
        createdAt: "desc"
      }

    });

    return NextResponse.json({
      success: true,
      count: articles.length,
      articles
    });

  } catch (error) {

    console.error("GET ARTICLES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch articles"
      },
      { status: 500 }
    );

  }

}

/* ================= CREATE NEWS ARTICLE ================= */

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const title = body.title?.trim();
    const content = body.content?.trim();
    const categoryId = body.categoryId;

    /* VALIDATION */

    if (!title) {

      return NextResponse.json(
        { success: false, error: "Title required" },
        { status: 400 }
      );

    }

    if (!content) {

      return NextResponse.json(
        { success: false, error: "Content required" },
        { status: 400 }
      );

    }

    if (!categoryId) {

      return NextResponse.json(
        { success: false, error: "Category required" },
        { status: 400 }
      );

    }

    /* VERIFY CATEGORY */

    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {

      return NextResponse.json(
        { success: false, error: "Invalid category" },
        { status: 400 }
      );

    }

    /* SLUG */

    const slug = await generateUniqueSlug(title);

    const cleanContent = stripHtml(content);

    /* SAFE IMAGES */

    const images = Array.isArray(body.images)
      ? body.images.filter((img: any) => typeof img === "string")
      : [];

    const article = await prisma.article.create({

      data: {

        title,

        slug,

        content,

        excerpt:
          body.excerpt ||
          cleanContent.substring(0, 200),

        images,

        videoUrl: body.videoUrl || null,

        categoryId,

        /* NEWS AUTO APPROVED */

        status: "approved",

        /* ASTROLOGY FLAG OFF */

        isAstrology: false,

        metaTitle: body.metaTitle || title,

        metaDescription:
          body.metaDescription ||
          cleanContent.substring(0, 160)

      },

      include: {
        category: true
      }

    });

    return NextResponse.json({

      success: true,
      id: article.id,
      slug: article.slug

    });

  } catch (error: any) {

    console.error("CREATE ARTICLE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Server error"
      },
      { status: 500 }
    );

  }

}

/* ================= DELETE ARTICLE ================= */

export async function DELETE(req: Request) {

  try {

    const body = await req.json();

    if (!body.id) {

      return NextResponse.json(
        { success: false, error: "ID required" },
        { status: 400 }
      );

    }

    /* SOFT DELETE BETTER */

    await prisma.article.update({

      where: { id: body.id },

      data: {
        isDeleted: true
      }

    });

    return NextResponse.json({
      success: true
    });

  } catch (error: any) {

    console.error("DELETE ARTICLE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Delete failed"
      },
      { status: 500 }
    );

  }

}