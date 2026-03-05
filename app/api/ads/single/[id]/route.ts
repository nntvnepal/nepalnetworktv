import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/* ===============================
   GET SINGLE AD
=============================== */

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {

  try {

    if (!params?.id) {
      return NextResponse.json(
        { error: "Ad ID required" },
        { status: 400 }
      );
    }

    const ad = await prisma.ad.findUnique({
      where: { id: params.id }
    });

    if (!ad) {
      return NextResponse.json(
        { error: "Ad not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(ad);

  } catch (error) {

    console.error("Fetch ad error:", error);

    return NextResponse.json(
      { error: "Failed to fetch ad" },
      { status: 500 }
    );

  }

}

/* ===============================
   UPDATE AD
=============================== */

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {

  try {

    if (!params?.id) {
      return NextResponse.json(
        { error: "Ad ID required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const updatedAd = await prisma.ad.update({
      where: { id: params.id },
      data: body
    });

    return NextResponse.json(updatedAd);

  } catch (error) {

    console.error("Update ad error:", error);

    return NextResponse.json(
      { error: "Failed to update ad" },
      { status: 500 }
    );

  }

}

/* ===============================
   DELETE AD
=============================== */

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {

  try {

    if (!params?.id) {
      return NextResponse.json(
        { error: "Ad ID required" },
        { status: 400 }
      );
    }

    await prisma.ad.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      message: "Ad deleted successfully"
    });

  } catch (error) {

    console.error("Delete ad error:", error);

    return NextResponse.json(
      { error: "Failed to delete ad" },
      { status: 500 }
    );

  }

}