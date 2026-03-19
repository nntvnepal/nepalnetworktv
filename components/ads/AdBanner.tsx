import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { AdPlacement } from "@prisma/client"

interface Props {
  placement: AdPlacement
}

export default async function AdBanner({ placement }: Props) {

  //////////////////////////////////////////////////////
  // FETCH AD (SAFE)
  //////////////////////////////////////////////////////

  let ad = null

  try {

    ad = await prisma.ad.findFirst({
      where: {
        placement,              // ✅ FIXED
        status: "active"        // ✅ FIXED
      },
      orderBy: {
        priority: "desc"
      }
    })

  } catch (error) {
    console.error("Ad fetch error:", error)
    return null // ❌ crash avoid
  }

  //////////////////////////////////////////////////////
  // NO AD
  //////////////////////////////////////////////////////

  if (!ad) return null

  //////////////////////////////////////////////////////
  // ADSENSE
  //////////////////////////////////////////////////////

  if (ad.type === "adsense" && ad.adsenseCode) {
    return (
      <div
        className="my-4"
        dangerouslySetInnerHTML={{ __html: ad.adsenseCode }}
      />
    )
  }

  //////////////////////////////////////////////////////
  // IMAGE AD
  //////////////////////////////////////////////////////

  if (ad.type === "image" && ad.imageUrl) {
    return (
      <div className="my-4">

        <a
          href={ad.link || "#"}
          target="_blank"
          rel="noopener noreferrer"
        >

          <Image
            src={ad.imageUrl}
            alt={ad.title || "Advertisement"}
            width={1200}
            height={200}
            className="w-full rounded"
          />

        </a>

      </div>
    )
  }

  //////////////////////////////////////////////////////
  // FALLBACK
  //////////////////////////////////////////////////////

  return null
}