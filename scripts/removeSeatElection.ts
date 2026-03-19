import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function run(){

await prisma.$runCommandRaw({
  update: "Seat",
  updates: [
    {
      q: { electionId: { $exists: true } },
      u: { $unset: { electionId: "" } },
      multi: true
    }
  ]
})

console.log("Seat.electionId removed from all documents")

}

run()
.then(()=>prisma.$disconnect())
.catch(console.error)