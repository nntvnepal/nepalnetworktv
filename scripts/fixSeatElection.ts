import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function run() {

  const election = await prisma.election.findFirst({
    where: { isActive: true }
  })

  if (!election) {
    console.log("No active election found")
    return
  }

  const result = await prisma.seat.updateMany({
    data: {
      electionId: election.id
    }
  })

  console.log("Seats fixed:", result.count)
  console.log("Linked with election:", election.name)

}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect())