import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {

  try {

    /* ================= SAFE BODY PARSE ================= */

    let body;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    const email = body?.email?.toLowerCase().trim();

    /* ================= VALIDATION ================= */

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email required" },
        { status: 400 }
      );
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address" },
        { status: 400 }
      );
    }

    /* ================= CHECK EXISTING ================= */

    const existing =
      await prisma.newsletterSubscriber.findUnique({
        where: { email }
      });

    if (existing) {
      return NextResponse.json({
        success: false,
        message: "Already subscribed"
      });
    }

    /* ================= CREATE SUBSCRIBER ================= */

    await prisma.newsletterSubscriber.create({
      data: { email }
    });

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully"
    });

  } catch (error) {

    console.error("NEWSLETTER API ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );

  }

}