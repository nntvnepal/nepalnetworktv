import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/* =========================
   SLUG GENERATOR
========================= */

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "-");
}

/* =========================
   GET ACTIVE CATEGORIES
========================= */

export async function GET() {
  try {

    const categories = await prisma.category.findMany({
      where: {
        status: "active",
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      categories
    });

  } catch (error) {

    console.error("CATEGORY GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories"
      },
      { status: 500 }
    );

  }
}

/* =========================
   CREATE CATEGORY
========================= */

export async function POST(req: Request) {

  try {

    let body;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const name = body?.name?.trim();

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Category name required" },
        { status: 400 }
      );
    }

    const slug = generateSlug(name);

    /* =========================
       CHECK EXISTING CATEGORY
    ========================= */

    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Category already exists" },
        { status: 409 }
      );
    }

    /* =========================
       CREATE CATEGORY
    ========================= */

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
        status: "active",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      category: newCategory
    });

  } catch (error) {

    console.error("CATEGORY CREATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create category"
      },
      { status: 500 }
    );

  }

}