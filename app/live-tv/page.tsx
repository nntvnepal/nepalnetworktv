import { prisma } from "@/lib/prisma";

export default async function LiveTV(){

const live = await prisma.liveTV.findFirst({
  where:{ isActive:true }
});

if(!live) return null;

return(

<div className="max-w-6xl mx-auto p-6">

<h1 className="text-2xl font-bold mb-4">
🔴 {live.title}
</h1>

<video
controls
autoPlay
className="w-full rounded-lg"
src={live.streamUrl}
/>

</div>

)

}