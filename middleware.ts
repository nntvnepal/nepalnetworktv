import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "supersecretkey"
)

export async function middleware(req: NextRequest) {

  const token = req.cookies.get("token")?.value

  //////////////////////////////////////////////////////
  // ONLY PROTECT ADMIN ROUTES
  //////////////////////////////////////////////////////

  if (!req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  //////////////////////////////////////////////////////
  // NO TOKEN → LOGIN
  //////////////////////////////////////////////////////

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  //////////////////////////////////////////////////////
  // VERIFY TOKEN
  //////////////////////////////////////////////////////

  try {
    await jwtVerify(token, secret)

    console.log("✅ TOKEN OK")

    return NextResponse.next()

  } catch (err) {

    console.log("❌ TOKEN FAIL")

    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
  matcher: ["/admin/:path*"],
}