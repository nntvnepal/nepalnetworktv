import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req: Request) {

  try {

    const body = await req.json();
    const id = body?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID required" },
        { status: 400 }
      );
    }

    await prisma.newsletterSubscriber.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true
    });

  } catch (error) {

    console.error("NEWSLETTER DELETE ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );

  }

}