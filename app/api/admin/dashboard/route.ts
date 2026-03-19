import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {

  try {

    //////////////////////////////////////////////////
    // SAFE COUNTS
    //////////////////////////////////////////////////

    const totalArticles = await prisma.article.count()
    const totalUsers = await prisma.user.count()

    let totalComments = 0 // ❌ removed but kept for UI safety
    let activeAds = 0
    let totalViews = 0
    let adClicks = 0

    //////////////////////////////////////////////////
    // ADS
    //////////////////////////////////////////////////

    try {

      activeAds = await prisma.ad.count({
        where: { status: "active" }
      })

      const clickAgg = await prisma.ad.aggregate({
        _sum: { clicks: true }
      })

      adClicks = clickAgg._sum.clicks ?? 0

    } catch (e) {
      console.warn("Ads data failed")
    }

    //////////////////////////////////////////////////
    // VIEWS
    //////////////////////////////////////////////////

    try {

      const viewAgg = await prisma.article.aggregate({
        _sum: { views: true }
      })

      totalViews = viewAgg._sum.views ?? 0

    } catch (e) {
      console.warn("Views aggregation failed")
    }

    //////////////////////////////////////////////////
    // ARTICLES
    //////////////////////////////////////////////////

    const latest = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        views: true,
        createdAt: true
      }
    })

    const top = await prisma.article.findMany({
      orderBy: { views: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        views: true
      }
    })

    //////////////////////////////////////////////////
    // RESPONSE
    //////////////////////////////////////////////////

    return NextResponse.json({

      stats: {
        totalArticles,
        totalUsers,
        totalComments, // always 0 (safe)
        totalViews,
        activeAds,
        adClicks,

        // placeholders (future ready)
        pendingArticles: 0,
        drafts: 0,
        publishedToday: 0,
        weekArticles: 0,
      },

      latest,
      top,

      trending: [],
      viral: [],
      activity: [],

      chart: [
        { day: "Mon", views: 120 },
        { day: "Tue", views: 200 },
        { day: "Wed", views: 150 },
        { day: "Thu", views: 300 },
        { day: "Fri", views: 250 },
      ],

      categories: []

    })

  } catch (error) {

    console.error("Dashboard API error:", error)

    return NextResponse.json(
      { error: "Dashboard failed" },
      { status: 500 }
    )

  }
}