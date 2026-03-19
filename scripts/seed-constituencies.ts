import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main(){

const districts = await prisma.region.findMany({
where:{ type:"DISTRICT" }
})

for(const district of districts){

for(let i=1;i<=3;i++){

const base = `${district.name}-${i}`

// MP Seat

const mpExists = await prisma.seat.findFirst({
where:{ name:base }
})

if(!mpExists){

await prisma.seat.create({
data:{
name:base,
position:"MP",
regionId:district.id
}
})

}

// MLA A

const mlaA = `${base} (A)`

const mlaAExists = await prisma.seat.findFirst({
where:{ name:mlaA }
})

if(!mlaAExists){

await prisma.seat.create({
data:{
name:mlaA,
position:"MLA",
regionId:district.id
}
})

}

// MLA B

const mlaB = `${base} (B)`

const mlaBExists = await prisma.seat.findFirst({
where:{ name:mlaB }
})

if(!mlaBExists){

await prisma.seat.create({
data:{
name:mlaB,
position:"MLA",
regionId:district.id
}
})

}

console.log("Seats created for:",base)

}

}

}

main()
.catch(console.error)
.finally(()=>prisma.$disconnect())