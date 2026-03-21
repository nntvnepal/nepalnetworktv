import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "./auth"

type TokenPayload = {
  id: string
  role: string
}

export async function getCurrentUser() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value

    if (!token) return null

    //////////////////////////////////////////////////////
    // 🔥 SAFE DECODE (FIX TS ERROR)
    //////////////////////////////////////////////////////

    const decoded = verifyToken(token) as unknown as TokenPayload

    if (!decoded?.id) return null

    //////////////////////////////////////////////////////
    // FETCH USER
    //////////////////////////////////////////////////////

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    })

    //////////////////////////////////////////////////////
    // SAFETY CHECKS
    //////////////////////////////////////////////////////

    if (!user) return null
    if (!user.isActive) return null

    return user

  } catch (error) {
    console.error("getCurrentUser error:", error)
    return null
  }
}