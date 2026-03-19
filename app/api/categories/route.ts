import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

//////////////////////////////////////////////////////
// GET ALL CATEGORIES
//////////////////////////////////////////////////////

export async function GET() {
  try {

    const categories = await prisma.category.findMany({
      orderBy: {
        priority: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      categories,
    });

  } catch (error) {

    console.error("Category fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}

//////////////////////////////////////////////////////
// CREATE CATEGORY
//////////////////////////////////////////////////////

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const name = body.name?.trim();
    const slug = body.slug?.toLowerCase().trim();
    const description = body.description || "";

    //////////////////////////////////////////////////////
    // VALIDATION
    //////////////////////////////////////////////////////

    if (!name || !slug) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and slug are required",
        },
        { status: 400 }
      );
    }

    //////////////////////////////////////////////////////
    // CHECK EXISTING SLUG
    //////////////////////////////////////////////////////

    const existing = await prisma.category.findUnique({
      where: {
        slug,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug already exists",
        },
        { status: 400 }
      );
    }

    //////////////////////////////////////////////////////
    // CREATE CATEGORY
    //////////////////////////////////////////////////////

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        status: "active",
        priority: 0,
      },
    });

    return NextResponse.json({
      success: true,
      category,
    });

  } catch (error) {

    console.error("Category creation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Category creation failed",
      },
      { status: 500 }
    );
  }
}