import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { PostStatus } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function GET() {

  try {

    //////////////////////////////////////////////////////
    // DATE RANGE
    //////////////////////////////////////////////////////

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    //////////////////////////////////////////////////////
    // FETCH HOROSCOPE
    //////////////////////////////////////////////////////

    const horoscopes = await prisma.article.findMany({

      where: {
        isAstrology: true,
        isDeleted: false,

        // ✅ FIXED ENUM
        status: PostStatus.approved,

        // today's horoscope
        horoscopeDate: {
          gte: today,
          lt: tomorrow
        },

        // publish check
        publishedAt: {
          lte: new Date()
        }
      },

      select: {
        zodiacSign: true,
        slug: true
      },

      orderBy: {
        zodiacSign: "asc"
      }

    })

    //////////////////////////////////////////////////////
    // RESPONSE
    //////////////////////////////////////////////////////

    return NextResponse.json({
      success: true,
      count: horoscopes.length,
      horoscopes
    })

  } catch (error) {

    console.error("HOROSCOPE API ERROR:", error)

    return NextResponse.json({
      success: false,
      error: "Failed to fetch horoscope"
    }, { status: 500 })

  }

}