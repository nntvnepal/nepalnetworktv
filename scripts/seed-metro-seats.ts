import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {

  const metros = await prisma.region.findMany({
    where: {
      type: { in: ["METRO", "SUB_METRO"] }
    }
  })

  for (const region of metros) {

    // Mayor
    await prisma.seat.create({
      data: {
        name: "Mayor",
        position: "MAYOR",
        regionId: region.id
      }
    })

    // Deputy Mayor
    await prisma.seat.create({
      data: {
        name: "Deputy Mayor",
        position: "DEPUTY_MAYOR",
        regionId: region.id
      }
    })

    console.log("Seats created for:", region.name)
  }
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })