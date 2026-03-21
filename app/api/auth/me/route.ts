import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { NextResponse } from "next/server"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "secret")

export async function GET() {
  try {
    const token = cookies().get("token")?.value

    if (!token) {
      return NextResponse.json({ user: null })
    }

    const { payload } = await jwtVerify(token, secret)

    return NextResponse.json({
      user: payload,
    })
  } catch (error) {
    return NextResponse.json({ user: null })
  }
}