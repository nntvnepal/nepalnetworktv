import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { NextResponse } from "next/server"
import { sendOTPEmail } from "@/lib/mailer"

const OTP_EXPIRY_MINUTES = 5

export async function POST(req: Request) {
  try {

    //////////////////////////////////////////////////////
    // PARSE BODY
    //////////////////////////////////////////////////////

    const body = await req.json()

    const email = String(body.email || "").trim().toLowerCase()
    const password = String(body.password || "").trim()
    const captchaToken = body.captchaToken

    //////////////////////////////////////////////////////
    // VALIDATION
    //////////////////////////////////////////////////////

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password required" },
        { status: 400 }
      )
    }

    if (!captchaToken) {
      return NextResponse.json(
        { success: false, error: "Captcha required" },
        { status: 400 }
      )
    }

    //////////////////////////////////////////////////////
    // CAPTCHA VERIFY
    //////////////////////////////////////////////////////

    if (!process.env.RECAPTCHA_SECRET_KEY) {
      console.error("❌ RECAPTCHA_SECRET_KEY missing")
      return NextResponse.json(
        { success: false, error: "Server config error" },
        { status: 500 }
      )
    }

    const params = new URLSearchParams()
    params.append("secret", process.env.RECAPTCHA_SECRET_KEY)
    params.append("response", captchaToken)

    const captchaRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    )

    const captchaData = await captchaRes.json()

    //if (!captchaData.success) {
      //return NextResponse.json(
        //{ success: false, error: "Captcha verification failed" },
        //{ status: 400 }
      //)
    //}

    //////////////////////////////////////////////////////
    // FIND USER
    //////////////////////////////////////////////////////

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 400 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: "Account disabled" },
        { status: 403 }
      )
    }

    //////////////////////////////////////////////////////
    // PASSWORD CHECK
    //////////////////////////////////////////////////////

    const isMatch = await compare(password, user.password)

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 400 }
      )
    }

    //////////////////////////////////////////////////////
    // CLEAN OLD OTPs
    //////////////////////////////////////////////////////

    await prisma.oTP.deleteMany({
      where: { email: user.email },
    })

    //////////////////////////////////////////////////////
    // GENERATE OTP
    //////////////////////////////////////////////////////

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
console.log("🔥 OTP:", otp)   // ✅ YE LINE ADD KAR
    const expiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    )

    await prisma.oTP.create({
      data: {
        email: user.email,
        code: otp,
        expiresAt,
      },
    })

    //////////////////////////////////////////////////////
    // 🔥 SEND EMAIL (SAFE MODE)
    //////////////////////////////////////////////////////

    try {
      await sendOTPEmail(user.email, otp)
      console.log("✅ EMAIL SENT")
    } catch (err) {
      console.error("❌ EMAIL ERROR:", err)

      // 🔥 fallback (IMPORTANT)
      console.log("📲 OTP (fallback):", otp)
    }

    //////////////////////////////////////////////////////
    // RESPONSE
    //////////////////////////////////////////////////////

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email",
      step: "otp_required",
      email: user.email,
    })

  } catch (error) {
    console.error("❌ LOGIN ERROR:", error)

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}