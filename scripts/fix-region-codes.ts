import { PrismaClient } from "@prisma/client"
import fs from "fs"
import csv from "csv-parser"

const prisma = new PrismaClient()

async function run(){

  console.log("Updating RURAL_MUNICIPALITY codes...")

  const rows:any[] = []

  await new Promise<void>((resolve)=>{

    fs.createReadStream("./data/municipalities.csv")
    .pipe(csv())
    .on("data",(row:any)=>{

      rows.push({
        name: row.name.trim(),
        code: row.id
      })

    })
    .on("end",()=>resolve())

  })

  console.log("CSV rows:", rows.length)

  const regions = await prisma.region.findMany({
    where:{
      type:{
        in:["RURAL_MUNICIPALITY","RURAL_RURAL_MUNICIPALITY","sub_metropolitan","metropolitan"]
      }
    }
  })

  let updated = 0

  for(const region of regions){

    const match = rows.find(r => r.name === region.name)

    if(match){

      await prisma.region.update({
        where:{ id: region.id },
        data:{ code: match.code }
      })

      updated++

    }

  }

  console.log("Regions updated:", updated)

  await prisma.$disconnect()

}

run()