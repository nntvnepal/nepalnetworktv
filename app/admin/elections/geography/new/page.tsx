import { prisma } from "@/lib/prisma"
import GeographyForm from "./GeographyForm"

export default async function Page(){

  const [provinces, districts, municipalities] = await Promise.all([

    prisma.region.findMany({
      where:{ type:"PROVINCE" },
      orderBy:{ name:"asc" }
    }),

    prisma.region.findMany({
      where:{ type:"DISTRICT" },
      orderBy:{ name:"asc" }
    }),

    prisma.region.findMany({
      where:{
        type:{
          in:[
            "METRO",
            "SUB_METRO",
            "MUNICIPALITY",
            "RURAL_MUNICIPALITY"
          ]
        }
      },
      orderBy:{ name:"asc" }
    })

  ])

  return(
    <GeographyForm
      provinces={provinces}
      districts={districts}
      municipalities={municipalities}
    />
  )

}