import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function run(){

  const municipalities = await prisma.region.findMany({
    where:{
      type:{
        in:[
          "RURAL_MUNICIPALITY",
          "RURAL_RURAL_MUNICIPALITY"
        ]
      }
    }
  })

  console.log("Municipalities found:", municipalities.length)

  const wards:any[] = []

  for(const m of municipalities){

    let wardCount = 9

    if(m.type === "RURAL_RURAL_MUNICIPALITY") wardCount = 7
    if(m.type === "RURAL_MUNICIPALITY") wardCount = 11

    for(let i=1;i<=wardCount;i++){

      wards.push({
        number:i,
        RURAL_MUNICIPALITYId:m.id
      })

    }

  }

  console.log("Creating wards:", wards.length)

  if(wards.length === 0){
    console.log("No wards generated.")
    process.exit()
  }

  await prisma.ward.createMany({
    data: wards
  })

  console.log("WARDS CREATED SUCCESSFULLY")

  process.exit()

}

run()