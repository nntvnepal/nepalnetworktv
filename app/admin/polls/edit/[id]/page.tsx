import { prisma } from "@/lib/prisma"

export default async function EditPoll({params}:any){

const poll = await prisma.poll.findUnique({
where:{id:params.id},
include:{options:true}
})

return(

<div className="p-8 max-w-3xl">

<h1 className="text-2xl font-bold mb-6">
Edit Poll
</h1>

<p>{poll?.question}</p>

</div>

)

}