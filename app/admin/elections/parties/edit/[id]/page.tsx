import { prisma } from "@/lib/prisma"

export default async function EditParty({params}:any){

const party = await prisma.party.findUnique({
where:{ id: params.id }
})

return(

<div className="p-6">

<h1 className="text-xl font-bold mb-4">
Edit Party
</h1>

<form
action={`/api/elections/parties/${party?.id}`}
method="POST"
className="flex flex-col gap-3 max-w-md"
>

<input
name="name"
defaultValue={party?.name}
className="border p-2"
/>

<input
name="code"
defaultValue={party?.code}
className="border p-2"
/>

<input
name="logo"
defaultValue={party?.logo || ""}
className="border p-2"
/>

<label>Party Color</label>

<input
type="color"
name="color"
defaultValue={party?.color || "#000000"}
className="border p-2"
/>

<button
className="bg-blue-600 text-white p-2 rounded"
>
Update Party
</button>

</form>

</div>

)
}