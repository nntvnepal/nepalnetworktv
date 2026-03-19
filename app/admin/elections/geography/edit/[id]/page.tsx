import { prisma } from "@/lib/prisma"
import EditForm from "./EditForm"
import { notFound } from "next/navigation"

export default async function Page({ params }: { params:{ id:string } }) {

const id = params.id

const [region, provinces, districts, locals] = await Promise.all([

prisma.region.findUnique({
where:{ id }
}),

prisma.region.findMany({
where:{ type:"PROVINCE" },
orderBy:{ name:"asc" }
}),

prisma.region.findMany({
where:{ type:"DISTRICT" },
orderBy:{ name:"asc" }
}),

prisma.region.findMany({
where:{
type:{
in:[
"METRO",
"SUB_METRO",
"MUNICIPALITY",
"RURAL_MUNICIPALITY"
]
}
},
orderBy:{ name:"asc" }
})

])

if(!region){
notFound()
}

return(

<div className="space-y-6 max-w-xl">

{/* HEADER */}

<div>

<h1 className="text-xl font-semibold text-white">
Edit Geography
</h1>

<p className="text-xs text-purple-300 mt-1">
Update region information and hierarchy
</p>

</div>


{/* FORM */}

<div className="
backdrop-blur-xl
bg-white/10
border border-white/10
rounded-xl
p-6
">

<EditForm
region={region}
provinces={provinces}
districts={districts}
locals={locals}
/>

</div>

</div>

)

}