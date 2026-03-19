import { prisma } from "@/lib/prisma"

export async function calculateSeatResults(electionId:string,seatId:string){

const results = await prisma.electionResult.findMany({

where:{
electionId,
seatId
},

orderBy:{
votes:"desc"
}

})

const totalVotes = results.reduce((sum,r)=>sum+r.votes,0)

for(let i=0;i<results.length;i++){

const r = results[i]

const percent = totalVotes
? (r.votes/totalVotes)*100
: 0

await prisma.electionResult.update({

where:{ id:r.id },

data:{
rank:i+1,
votePercent:Number(percent.toFixed(2)),
isLeader:i===0,
isWinner:i===0
}

})

}

}