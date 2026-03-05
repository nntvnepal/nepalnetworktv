import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {

  try {

    const users = await prisma.user.findMany({

      orderBy: {
        createdAt: "desc"
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }

    });

    return NextResponse.json({
      success: true,
      users
    });

  } catch (error) {

    console.error("USERS LIST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users"
      },
      { status: 500 }
    );

  }

}