import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import EditAdForm from "@/components/admin/EditAdForm"

interface Props{
params:{id:string}
}

export default async function EditAdPage({params}:Props){

const ad = await prisma.ad.findUnique({
where:{id:params.id}
})

if(!ad){
notFound()
}

return(

<div className="max-w-3xl">

<h1 className="text-2xl font-bold text-white mb-6">
Edit Advertisement
</h1>

<EditAdForm ad={ad}/>

</div>

)

}