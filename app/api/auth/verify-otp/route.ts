import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { SignJWT } from "jose"
import { compare } from "bcryptjs" 

export const runtime = "nodejs" // 🔥 fix edge warning

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined")
}

const secret = new TextEncoder().encode(JWT_SECRET)

export async function POST(req: Request) {
  try {

    //////////////////////////////////////////////////////
    // PARSE BODY
    //////////////////////////////////////////////////////

    const body = await req.json()
    const email = String(body.email || "").trim().toLowerCase()
    const code = String(body.code || "").trim()

    //////////////////////////////////////////////////////
    // VALIDATION
    //////////////////////////////////////////////////////

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: "Email and OTP required" },
        { status: 400 }
      )
    }

    //////////////////////////////////////////////////////
    // FIND OTP (LATEST ONLY 🔥)
    //////////////////////////////////////////////////////

  
const otpRecord = await prisma.oTP.findFirst({
  where: { email },
  orderBy: { createdAt: "desc" },
})

if (!otpRecord) {
  return NextResponse.json(
    { success: false, error: "Invalid OTP" },
    { status: 400 }
  )
}

// 🔥 compare hashed
const isValid = await compare(code, otpRecord.code)

if (!isValid) {
  return NextResponse.json(
    { success: false, error: "Invalid OTP" },
    { status: 400 }
  )
}

    //////////////////////////////////////////////////////
    // CHECK EXPIRY
    //////////////////////////////////////////////////////

    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: "OTP expired" },
        { status: 400 }
      )
    }

    //////////////////////////////////////////////////////
    // FIND USER
    //////////////////////////////////////////////////////

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    //////////////////////////////////////////////////////
    // MARK VERIFIED (SAFE)
    //////////////////////////////////////////////////////

    if (!user.isVerified) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      })
    }

    //////////////////////////////////////////////////////
    // DELETE OTP (CLEANUP)
    //////////////////////////////////////////////////////

    await prisma.oTP.deleteMany({
      where: { email },
    })

    //////////////////////////////////////////////////////
    // CREATE JWT TOKEN
    //////////////////////////////////////////////////////

    const token = await new SignJWT({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret)

    //////////////////////////////////////////////////////
    // RESPONSE
    //////////////////////////////////////////////////////

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

    //////////////////////////////////////////////////////
    // COOKIE (PRODUCTION SAFE 🔥)
    //////////////////////////////////////////////////////

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // 🔥 fix
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    //////////////////////////////////////////////////////
    // UPDATE LAST LOGIN (AWAIT FIX 🔥)
    //////////////////////////////////////////////////////

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    }).catch(() => {})

    return response

  } catch (error) {
    console.error("❌ VERIFY OTP ERROR:", error)

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}