import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/getCurrentUser";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {

    //////////////////////////////////////////////////////
    // AUTH CHECK 🔐
    //////////////////////////////////////////////////////

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    //////////////////////////////////////////////////////
    // PARSE BODY
    //////////////////////////////////////////////////////

    const body = await req.json();
    const newPassword = body?.newPassword;

    if (!newPassword) {
      return NextResponse.json(
        { success: false, message: "Password required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password too short" },
        { status: 400 }
      );
    }

    //////////////////////////////////////////////////////
    // HASH PASSWORD
    //////////////////////////////////////////////////////

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //////////////////////////////////////////////////////
    // UPDATE
    //////////////////////////////////////////////////////

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { password: hashedPassword }
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}