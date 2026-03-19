import { prisma } from "@/lib/prisma"
import AdSlot from "@/components/ads/AdSlot"
import { AdPlacement } from "@prisma/client"

interface Props {
  placement: AdPlacement
}

export default async function AdRenderer({ placement }: Props) {

  const now = new Date()

  //////////////////////////////////////////////////////
  // FETCH ADS (SAFE)
  //////////////////////////////////////////////////////

  let ads: any[] = []

  try {

    ads = await prisma.ad.findMany({

      where: {
        placement,
        status: "active",

        OR: [
          { startDate: null },
          { startDate: { lte: now } }
        ],

        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } }
            ]
          }
        ]
      },

      orderBy: [
        { priority: "asc" },
        { createdAt: "desc" }
      ]

    })

  } catch (error) {
    console.error("AdRenderer fetch error:", error)
    return null // ❌ crash avoid
  }

  //////////////////////////////////////////////////////
  // SIZE DETECTION (SAFE STRING)
  //////////////////////////////////////////////////////

  const placementStr = String(placement)

  let width = "max-w-[970px]"
  let height = "h-[180px]"

  if (placementStr.includes("sidebar")) {
    width = "max-w-[300px]"
    height = "h-[250px]"
  } 
  else if (
    placementStr.includes("mid") ||
    placementStr.includes("paragraph") ||
    placementStr.includes("block")
  ) {
    width = "max-w-[728px]"
    height = "h-[90px]"
  }

  //////////////////////////////////////////////////////
  // FALLBACK (NO ADS)
  //////////////////////////////////////////////////////

  if (!ads || ads.length === 0) {

    return (
      <div className="w-full flex justify-center my-6">
        <div
          className={`w-full ${width} ${height}
          border border-dashed border-gray-300
          flex items-center justify-center
          text-gray-400 text-sm`}
        >
          Advertisement
        </div>
      </div>
    )
  }

  //////////////////////////////////////////////////////
  // ROTATION (SAFE)
  //////////////////////////////////////////////////////

  const randomIndex = Math.floor(Math.random() * ads.length)
  const ad = ads[randomIndex]

  if (!ad) return null

  //////////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////////

  return (
    <div className="w-full flex justify-center my-6">
      <div className={`w-full ${width}`}>
        <AdSlot ad={ad} />
      </div>
    </div>
  )
}