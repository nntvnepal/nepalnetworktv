import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {

  try {

    const body = await req.json();
    const id = body?.id;

    /* ================= VALIDATION ================= */

    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID required" },
        { status: 400 }
      );
    }

    /* ================= CHECK USER ================= */

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    /* ================= HASH PASSWORD ================= */

    const hashedPassword = await bcrypt.hash("Nation123", 10);

    /* ================= UPDATE USER ================= */

    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword
      }
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (error) {

    console.error("RESET USER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong"
      },
      { status: 500 }
    );

  }

}