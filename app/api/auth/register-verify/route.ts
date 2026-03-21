import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {

    const body = await req.json()

    const name = String(body.name || "").trim()
    const email = String(body.email || "").trim().toLowerCase()
    const password = String(body.password || "").trim()

    //////////////////////////////////////////////////////
    // VALIDATION
    //////////////////////////////////////////////////////

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    //////////////////////////////////////////////////////
    // CHECK EXISTING USER
    //////////////////////////////////////////////////////

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    //////////////////////////////////////////////////////
    // HASH PASSWORD
    //////////////////////////////////////////////////////

    const hashedPassword = await hashPassword(password)

    //////////////////////////////////////////////////////
    // CREATE USER (UNVERIFIED)
    //////////////////////////////////////////////////////

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isVerified: false,
      },
    })

    //////////////////////////////////////////////////////
    // GENERATE OTP
    //////////////////////////////////////////////////////

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    await prisma.oTP.create({
      data: {
        email,
        code: otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    })

    //////////////////////////////////////////////////////
    // DEBUG (REMOVE LATER)
    //////////////////////////////////////////////////////
    console.log("📧 REGISTER OTP:", otp)

    //////////////////////////////////////////////////////
    // RESPONSE
    //////////////////////////////////////////////////////

    return NextResponse.json({
      success: true,
      step: "otp_required",
      email,
      message: "OTP sent to email",
    })

  } catch (error) {
    console.error("REGISTER ERROR:", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}