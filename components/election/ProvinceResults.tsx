interface Props{
results:any[]
}

export default function ProvinceResults({results}:Props){

//////////////////////////////////////////////////////
// GROUP BY PROVINCE
//////////////////////////////////////////////////////

const provinces:any = {}

results.forEach((r:any)=>{

const province = r.seat?.region?.name || "Unknown"
const party = r.candidate?.party?.name || "Independent"

if(!provinces[province]){
provinces[province] = {}
}

if(!provinces[province][party]){
provinces[province][party] = 0
}

provinces[province][party]++

})

//////////////////////////////////////////////////////
// SORT PROVINCES
//////////////////////////////////////////////////////

const sortedProvinces = Object.entries(provinces)
.sort((a:any,b:any)=>a[0].localeCompare(b[0]))

//////////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////////

return(

<div className="province-results">

{sortedProvinces.map(([province,parties]:any)=>{

const sorted = Object.entries(parties)
.sort((a:any,b:any)=>b[1]-a[1])

const maxSeats = Math.max(...sorted.map((p:any)=>p[1]))
const totalSeats = sorted.reduce((sum:any,p:any)=>sum+p[1],0)

return(

<div key={province} className="province-card">

<h3 className="province-title">
{province}
</h3>

{sorted.map(([party,seats]:any)=>{

const width = (seats / maxSeats) * 100
const percent = ((seats / totalSeats) * 100).toFixed(1)

return(

<div key={party} className="province-row">

<span className="province-party">
{party}
</span>

<div className="province-bar">

<div
className="province-bar-fill"
style={{width:`${width}%`}}
></div>

</div>

<span className="province-seats">
{seats}
<span className="province-percent">
{percent}%
</span>
</span>

</div>

)

})}

</div>

)

})}

</div>

)

}