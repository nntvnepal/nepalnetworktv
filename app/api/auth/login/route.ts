import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { sendOTPEmail } from "@/lib/mailer"
import { hash } from "bcryptjs" 

const OTP_EXPIRY_MINUTES = 5

export async function POST(req: Request) {
  try {

    //////////////////////////////////////////////////////
    // PARSE BODY
    //////////////////////////////////////////////////////

    const body = await req.json()

    const email = String(body.email || "").trim().toLowerCase()
    const password = String(body.password || "").trim()
    

    //////////////////////////////////////////////////////
    // VALIDATION
    //////////////////////////////////////////////////////

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password required" },
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

const hashedOTP = await hash(otp, 10)

await prisma.oTP.create({
  data: {
    email: user.email,
    code: hashedOTP, // 🔐 hashed save
    expiresAt,
  },
})

   //////////////////////////////////////////////////////
// 🔥 SEND EMAIL (NON-BLOCKING)
//////////////////////////////////////////////////////

sendOTPEmail(user.email, otp)
  .then(() => console.log("✅ EMAIL SENT"))
  .catch((err) => {
    console.error("❌ EMAIL ERROR:", err)
    console.log("📲 OTP (fallback):", otp)
  })

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