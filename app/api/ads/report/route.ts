import { prisma } from "@/lib/prisma"

export async function GET(){

try{

const ads = await prisma.ad.findMany({
select:{
title:true,
placement:true,
type:true,
views:true,
clicks:true,
status:true
}
})

const csv = [
"Title,Placement,Type,Views,Clicks,CTR,Status"
]

ads.forEach(ad => {

const ctr = ad.views > 0
? ((ad.clicks/ad.views)*100).toFixed(2)
: "0"

csv.push(
`"${ad.title}","${ad.placement}","${ad.type}",${ad.views},${ad.clicks},"${ctr}%","${ad.status}"`
)

})

return new Response(csv.join("\n"),{
headers:{
"Content-Type":"text/csv",
"Content-Disposition":"attachment; filename=nntv-ads-report.csv"
}
})

}catch(e){

console.error("Ads report error",e)

return new Response("Report generation failed",{
status:500
})

}

}