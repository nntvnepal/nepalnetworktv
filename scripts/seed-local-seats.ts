import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {

console.log("Generating Local Seats...")

const locals = await prisma.region.findMany({

where:{
type:{
in:[
"metro",
"sub_metro",
"RURAL_MUNICIPALITY",
"MUNICIPALITY"
]
}
},

include:{
wards:true
}

})

for(const local of locals){

/* MAYOR / CHAIR */

await prisma.seat.create({

data:{
name:`${local.name} Mayor`,
position:"MAYOR",
regionId:local.id
}

})

await prisma.seat.create({

data:{
name:`${local.name} Deputy Mayor`,
position:"DEPUTY_MAYOR",
regionId:local.id
}

})


/* WARD SEATS */

for(const ward of local.wards){

await prisma.seat.create({

data:{
name:`Ward ${ward.number} Chair`,
position:"WARD_CHAIR",
wardId:ward.id
}

})

await prisma.seat.create({

data:{
name:`Ward ${ward.number} Member Open 1`,
position:"WARD_MEMBER",
wardId:ward.id
}

})

await prisma.seat.create({

data:{
name:`Ward ${ward.number} Member Open 2`,
position:"WARD_MEMBER",
wardId:ward.id
}

})

await prisma.seat.create({

data:{
name:`Ward ${ward.number} Woman Member`,
position:"WARD_MEMBER",
wardId:ward.id
}

})

await prisma.seat.create({

data:{
name:`Ward ${ward.number} Dalit Woman Member`,
position:"WARD_MEMBER",
wardId:ward.id
}

})

}

}

console.log("Seats Generated Successfully")

}

main()
.catch(console.error)
.finally(()=>prisma.$disconnect())