import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { Role } from "@prisma/client"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

//////////////////////////////////////////////////////
// 🔥 ROLE LEVEL (STRICT ENUM BASED)
//////////////////////////////////////////////////////

const ROLE_LEVEL: Record<Role, number> = {
  super_admin: 7,
  admin: 6,
  tv_admin: 5,
  editor: 4,
  tv_operator: 3,
  reporter: 2,
  advertiser: 1,
  user: 0,
}

function canManage(currentRole: Role, targetRole: Role) {
  return ROLE_LEVEL[currentRole] > ROLE_LEVEL[targetRole]
}

//////////////////////////////////////////////////////
// 🔥 VALID ROLES (FROM ENUM)
//////////////////////////////////////////////////////

const ALLOWED_ROLES: Role[] = [
  "super_admin",
  "admin",
  "editor",
  "reporter",
  "advertiser",
  "tv_admin",
  "tv_operator",
  "user",
]

export async function POST(req: Request) {
  try {

    //////////////////////////////////////////////////////
    // AUTH CHECK 🔐
    //////////////////////////////////////////////////////

    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    //////////////////////////////////////////////////////
    // PARSE BODY
    //////////////////////////////////////////////////////

    const body = await req.json()

    const name = String(body.name || "").trim()
    const email = String(body.email || "").trim().toLowerCase()
    const password = String(body.password || "").trim()

    //////////////////////////////////////////////////////
    // 🔥 ROLE SAFE PARSE
    //////////////////////////////////////////////////////

    const inputRole = String(body.role || "reporter").toLowerCase()

    const role: Role = ALLOWED_ROLES.includes(inputRole as Role)
      ? (inputRole as Role)
      : "reporter"

    //////////////////////////////////////////////////////
    // VALIDATION
    //////////////////////////////////////////////////////

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Invalid email" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    //////////////////////////////////////////////////////
    // ROLE PERMISSION 🔥
    //////////////////////////////////////////////////////

    if (currentUser.role !== "super_admin" && currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      )
    }

    //////////////////////////////////////////////////////
    // 🔥 HIERARCHY CHECK
    //////////////////////////////////////////////////////

    if (!canManage(currentUser.role as Role, role)) {
      return NextResponse.json(
        { success: false, message: "Cannot assign this role" },
        { status: 403 }
      )
    }

    //////////////////////////////////////////////////////
    // 🔥 ADMIN LIMIT (MAX 4)
    //////////////////////////////////////////////////////

    if (role === "admin") {
      const adminCount = await prisma.user.count({
        where: { role: "admin" },
      })

      if (adminCount >= 4) {
        return NextResponse.json(
          { success: false, message: "Max 4 admins allowed" },
          { status: 400 }
        )
      }
    }

    //////////////////////////////////////////////////////
    // CHECK EXISTING USER
    //////////////////////////////////////////////////////

    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      )
    }

    //////////////////////////////////////////////////////
    // HASH PASSWORD 🔐
    //////////////////////////////////////////////////////

    const hashedPassword = await bcrypt.hash(password, 10)

    //////////////////////////////////////////////////////
    // CREATE USER
    //////////////////////////////////////////////////////

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role, // ✅ FIXED ENUM
        isVerified: false,
      },
    })

    //////////////////////////////////////////////////////
    // RESPONSE
    //////////////////////////////////////////////////////

    return NextResponse.json({
      success: true,
      message: "User created. Verification pending.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    })

  } catch (error) {
    console.error("CREATE USER ERROR:", error)

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}