import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
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
    const id = body?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID required" },
        { status: 400 }
      );
    }

    //////////////////////////////////////////////////////
    // FIND USER
    //////////////////////////////////////////////////////

    const targetUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    //////////////////////////////////////////////////////
    // ROLE SECURITY 🔥
    //////////////////////////////////////////////////////

    if (currentUser.role !== "super_admin" && currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    if (currentUser.role === "admin" && targetUser.role === "super_admin") {
      return NextResponse.json(
        { success: false, message: "Cannot reset super admin password" },
        { status: 403 }
      );
    }

    //////////////////////////////////////////////////////
    // GENERATE TEMP PASSWORD 🔥
    //////////////////////////////////////////////////////

    const tempPassword = Math.random().toString(36).slice(-8);

    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    //////////////////////////////////////////////////////
    // UPDATE USER
    //////////////////////////////////////////////////////

    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword
      }
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successful",
      tempPassword // 👈 show once in UI
    });

  } catch (error) {
    console.error("RESET USER ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}