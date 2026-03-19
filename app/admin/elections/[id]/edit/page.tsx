import { prisma } from "@/lib/prisma"
import EditElectionForm from "./form"

export default async function EditElectionPage({ params }: any) {

  const election = await prisma.election.findUnique({
    where: { id: params.id }
  })

  if (!election) {
    return (
      <div className="text-white p-10">
        Election not found
      </div>
    )
  }

  return <EditElectionForm election={election} />
}