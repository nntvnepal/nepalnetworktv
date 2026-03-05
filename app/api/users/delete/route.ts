import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {

  try {

    const body = await req.json();
    const id = body?.id;

    /* ================= VALIDATION ================= */

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID missing" },
        { status: 400 }
      );
    }

    /* ================= CHECK USER ================= */

    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    /* ================= DELETE USER ================= */

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: "User deleted"
    });

  } catch (error) {

    console.error("DELETE USER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Delete failed"
      },
      { status: 500 }
    );

  }

}