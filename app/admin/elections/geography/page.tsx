import { prisma } from "@/lib/prisma"
import GeographyClient from "./GeographyClient"

export default async function Page(){

  const [data, stats] = await Promise.all([

    prisma.region.findMany({
      where:{ type:"PROVINCE" },

      include:{
        children:{
          include:{
            children:{
              include:{
                wards:true
              }
            }
          }
        }
      },

      orderBy:{ name:"asc" }

    }),

    (async () => {

      const [
        provinces,
        districts,
        metros,
        subMetros,
        municipalities,
        ruralMunicipalities,
        wards
      ] = await Promise.all([

        prisma.region.count({ where:{ type:"PROVINCE" } }),
        prisma.region.count({ where:{ type:"DISTRICT" } }),
        prisma.region.count({ where:{ type:"METRO" } }),
        prisma.region.count({ where:{ type:"SUB_METRO" } }),
        prisma.region.count({ where:{ type:"MUNICIPALITY" } }),
        prisma.region.count({ where:{ type:"RURAL_MUNICIPALITY" } }),
        prisma.ward.count()

      ])

      return {
        provinces,
        districts,
        metros,
        subMetros,
        municipalities,
        ruralMunicipalities,
        wards
      }

    })()

  ])

  return <GeographyClient data={data} stats={stats} />

}