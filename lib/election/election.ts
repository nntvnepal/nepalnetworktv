import { prisma } from "@/lib/prisma"

export async function generateSeats(electionId: string, type: string) {

  const seats: any[] = []

  // LOCAL
  if (type === "Local") {

    for (let i = 1; i <= 293; i++) {
      seats.push({ electionId, position: "Mayor" })
      seats.push({ electionId, position: "Deputy Mayor" })
    }

    for (let i = 1; i <= 460; i++) {
      seats.push({ electionId, position: "Chairperson" })
      seats.push({ electionId, position: "Vice Chairperson" })
    }

    for (let i = 1; i <= 6743; i++) {
      seats.push({ electionId, position: "Ward Chairperson" })
    }

    for (let i = 1; i <= 26972; i++) {
      seats.push({ electionId, position: "Ward Member" })
    }

  }

  // FEDERAL
  if (type === "Federal") {

    for (let i = 1; i <= 165; i++) {
      seats.push({
        electionId,
        position: "FPTP",
        number: i
      })
    }

    for (let i = 1; i <= 110; i++) {
      seats.push({
        electionId,
        position: "PR",
        number: i
      })
    }

  }

  // PROVINCIAL
  if (type === "Provincial") {

    for (let i = 1; i <= 330; i++) {
      seats.push({
        electionId,
        position: "FPTP",
        number: i
      })
    }

    for (let i = 1; i <= 220; i++) {
      seats.push({
        electionId,
        position: "PR",
        number: i
      })
    }

  }

  await prisma.seat.createMany({
    data: seats
  })

}