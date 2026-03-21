import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export const dynamic = "force-dynamic";

//////////////////////////////////////////////////////
// 🔥 ROLE LEVEL (HIERARCHY)
//////////////////////////////////////////////////////

const ROLE_LEVEL: Record<string, number> = {
  super_admin: 7,
  admin: 6,
  tv_admin: 5,
  editor: 4,
  tv_operator: 3,
  reporter: 2,
  advertiser: 1,
};

function canManage(currentRole: string, targetRole: string) {
  return ROLE_LEVEL[currentRole] > ROLE_LEVEL[targetRole];
}

//////////////////////////////////////////////////////
// PUT (UPDATE USER)
//////////////////////////////////////////////////////

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    //////////////////////////////////////////////////////
    // SELF PROTECTION
    //////////////////////////////////////////////////////

    if (currentUser.id === targetUser.id) {
      return NextResponse.json(
        { error: "Cannot modify yourself" },
        { status: 403 }
      );
    }

    const body = await req.json();

    //////////////////////////////////////////////////////
    // SAFE DATA 🔐
    //////////////////////////////////////////////////////

    const safeData: any = {};

    if (body.name !== undefined) safeData.name = String(body.name).trim();

    if (body.email !== undefined)
      safeData.email = String(body.email).trim().toLowerCase();

    if (body.isActive !== undefined)
      safeData.isActive = Boolean(body.isActive);

    //////////////////////////////////////////////////////
    // ROLE CONTROL (FINAL 🔥)
    //////////////////////////////////////////////////////

    // 🧠 SUPER ADMIN → full control
    if (currentUser.role === "super_admin") {
      if (body.role) safeData.role = body.role;

      await prisma.user.update({
        where: { id: params.id },
        data: safeData,
      });

      return NextResponse.json({ success: true });
    }

    // ❌ hierarchy check
    if (!canManage(currentUser.role, targetUser.role)) {
      return NextResponse.json(
        { error: "Not allowed to modify this user" },
        { status: 403 }
      );
    }

    // ❌ cannot assign higher role
    if (body.role && !canManage(currentUser.role, body.role)) {
      return NextResponse.json(
        { error: "Cannot assign higher role" },
        { status: 403 }
      );
    }

    // 🔥 ADMIN RULES
    if (currentUser.role === "admin") {
      if (body.role === "admin" || body.role === "super_admin") {
        return NextResponse.json(
          { error: "Cannot assign admin or super_admin role" },
          { status: 403 }
        );
      }
    }

    // 🔵 EDITOR restriction
    if (currentUser.role === "editor") {
      if (targetUser.role !== "reporter") {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }

      delete safeData.role;
    }

    if (body.role) safeData.role = body.role;

    await prisma.user.update({
      where: { id: params.id },
      data: safeData,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

//////////////////////////////////////////////////////
// DELETE USER
//////////////////////////////////////////////////////

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    //////////////////////////////////////////////////////
    // SELF PROTECTION
    //////////////////////////////////////////////////////

    if (currentUser.id === targetUser.id) {
      return NextResponse.json(
        { error: "Cannot delete yourself" },
        { status: 403 }
      );
    }

    //////////////////////////////////////////////////////
    // ROLE BASED DELETE (FINAL 🔥)
    //////////////////////////////////////////////////////

    // 🧠 SUPER ADMIN
    if (currentUser.role === "super_admin") {
      await prisma.user.delete({
        where: { id: params.id },
      });

      return NextResponse.json({ success: true });
    }

    // ❌ hierarchy check
    if (!canManage(currentUser.role, targetUser.role)) {
      return NextResponse.json(
        { error: "Not allowed to delete this user" },
        { status: 403 }
      );
    }

    // 🔥 ADMIN restriction
    if (currentUser.role === "admin") {
      if (targetUser.role === "admin" || targetUser.role === "super_admin") {
        return NextResponse.json(
          { error: "Cannot delete admin or super_admin" },
          { status: 403 }
        );
      }
    }

    // 🔵 EDITOR restriction
    if (currentUser.role === "editor") {
      if (targetUser.role !== "reporter") {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }
    }

    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}