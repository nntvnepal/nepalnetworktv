import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

const polls = await prisma.poll.findMany({
include:{options:true},
orderBy:{createdAt:"desc"}
})

const rows = polls.flatMap(p=>
p.options.map(o=>({
question:p.question,
option:o.text,
votes:o.votes
}))
)

const csv = [
"Question,Option,Votes",
...rows.map(r=>`${r.question},${r.option},${r.votes}`)
].join("\n")

return new Response(csv,{
headers:{
"Content-Type":"text/csv",
"Content-Disposition":"attachment; filename=poll-report.csv"
}
})

}