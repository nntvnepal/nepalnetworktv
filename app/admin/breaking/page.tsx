import { prisma } from "@/lib/prisma"
import BreakingAdmin from "@/components/admin/BreakingAdmin"

export default async function Page(){

const list = await prisma.breakingNews.findMany({
orderBy:{priority:"desc"}
})

return <BreakingAdmin initialData={list} />

}