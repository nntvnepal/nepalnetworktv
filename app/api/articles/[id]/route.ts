import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { PostStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

/* ================= UTIL ================= */

function stripHtml(html: string) {
  return html?.replace(/<[^>]*>?/gm, "") || "";
}

async function generateUniqueSlug(title: string, currentId: string) {

  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

  let slug = baseSlug;
  let counter = 1;

  while (true) {

    const existing = await prisma.article.findFirst({
      where: {
        slug,
        NOT: { id: currentId }
      }
    });

    if (!existing) break;

    slug = `${baseSlug}-${counter++}`;

  }

  return slug;

}

/* ================= GET ================= */

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {

  try {

    if (!params?.id) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const article = await prisma.article.findUnique({
      where: { id: params.id },
      include: { category: true }
    });

    if (!article) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      article
    });

  } catch (error) {

    console.error("GET ARTICLE ERROR:", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );

  }

}

/* ================= PATCH STATUS ================= */

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {

  try {

    const body = await req.json();

    const existing = await prisma.article.findUnique({
      where: { id: params.id }
    });

    if (!existing) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    let status: PostStatus = existing.status;

    if (body.status && Object.values(PostStatus).includes(body.status)) {
      status = body.status;
    }

    const updated = await prisma.article.update({
      where: { id: params.id },
      data: {
        status,
        publishedAt:
          status === PostStatus.approved
            ? new Date()
            : existing.publishedAt
      }
    });

    return NextResponse.json({
      success: true,
      article: updated
    });

  } catch (error) {

    console.error("PATCH ERROR:", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );

  }

}

/* ================= UPDATE ARTICLE ================= */

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {

  try {

    const body = await req.json();

    const existing = await prisma.article.findUnique({
      where: { id: params.id }
    });

    if (!existing) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    /* ---------- CLEAN IMAGES ---------- */

    const cleanImages = Array.isArray(body.images)
      ? body.images.filter(
          (img: any) =>
            typeof img === "string" && img.trim()
        )
      : existing.images;

    /* ---------- CLEAN CONTENT ---------- */

    const cleanContent = stripHtml(
      body.content || existing.content
    );

    /* ---------- SLUG ---------- */

    const slug =
      body.title && body.title !== existing.title
        ? await generateUniqueSlug(body.title, params.id)
        : existing.slug;

    /* ---------- HOROSCOPE DATE ---------- */

    let horoscopeDate = existing.horoscopeDate;

    if (body.horoscopeDate) {
      horoscopeDate = new Date(body.horoscopeDate);
    }

    /* ---------- AUTO STATUS RULE ---------- */

    let status: PostStatus = body.status ?? existing.status;

    if (body.isAstrology) {
      status = PostStatus.approved;
    }

    /* ---------- UPDATE ---------- */

    const updated = await prisma.article.update({

      where: { id: params.id },

      data: {

        title: body.title || existing.title,

        slug,

        content: body.content || existing.content,

        excerpt: body.excerpt ?? existing.excerpt,

        images: cleanImages,

        videoUrl: body.videoUrl ?? existing.videoUrl,

        breaking: body.breaking ?? existing.breaking,

        featured: body.featured ?? existing.featured,

        status,

        publishedAt:
          status === PostStatus.approved
            ? new Date()
            : existing.publishedAt,

        isEditorial: body.isEditorial ?? existing.isEditorial,

        isAstrology: body.isAstrology ?? existing.isAstrology,

        zodiacSign: body.zodiacSign ?? existing.zodiacSign,

        horoscopeDate,

        categoryId:
          body.isEditorial || body.isAstrology
            ? null
            : body.categoryId ?? existing.categoryId,

        metaTitle:
          body.metaTitle ||
          body.title ||
          existing.title,

        metaDescription:
          body.metaDescription ||
          cleanContent.substring(0, 160),

        metaKeywords:
          body.metaKeywords ||
          (body.title || existing.title)
            .toLowerCase()
            .split(" ")
            .slice(0, 10)
            .join(", ")

      }

    });

    return NextResponse.json({
      success: true,
      article: updated
    });

  } catch (error: any) {

    console.error("UPDATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Update failed"
      },
      { status: 500 }
    );

  }

}

/* ================= DELETE ================= */

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {

  try {

    await prisma.article.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true
    });

  } catch (error) {

    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );

  }

}