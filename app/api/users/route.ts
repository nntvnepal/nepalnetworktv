import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export const dynamic = "force-dynamic";

//////////////////////////////////////////////////////
// ROLE LEVEL 🔥
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

export async function GET() {

  try {

    //////////////////////////////////////////////////////
    // AUTH CHECK
    //////////////////////////////////////////////////////

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    //////////////////////////////////////////////////////
    // ALLOWED ROLES
    //////////////////////////////////////////////////////

    if (!["super_admin", "admin", "editor", "tv_admin"].includes(currentUser.role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    //////////////////////////////////////////////////////
    // FETCH USERS
    //////////////////////////////////////////////////////

    let users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    //////////////////////////////////////////////////////
    // 🔥 FILTER BASED ON HIERARCHY
    //////////////////////////////////////////////////////

    if (currentUser.role !== "super_admin") {
      users = users.filter(
        (u) => ROLE_LEVEL[currentUser.role] > ROLE_LEVEL[u.role]
      );
    }

    //////////////////////////////////////////////////////
    // RESPONSE
    //////////////////////////////////////////////////////

    return NextResponse.json({
      success: true,
      users
    });

  } catch (error) {

    console.error("USERS API ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );

  }

}