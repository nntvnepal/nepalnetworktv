"use client"

interface Props{
partySeats:Record<string,number>
totalSeats:number
}

export default function PartySeatDistribution({
partySeats,
totalSeats
}:Props){

//////////////////////////////////////////////////////
// SORT PARTIES
//////////////////////////////////////////////////////

const sortedParties = Object.entries(partySeats)
.sort((a,b)=>b[1]-a[1])

//////////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////////

return(

<div className="party-seat-distribution">

<h3 className="card-title">
Party Control
</h3>

<div className="party-bars">

{sortedParties.map(([party,seats])=>{

const percent = Math.round((seats / totalSeats) * 100)

return(

<div key={party} className="party-row">

<div className="party-name">
{party}
</div>

<div className="party-bar">

<div
className="party-bar-fill"
style={{width:`${percent}%`}}
/>

</div>

<div className="party-seats">

<div className="party-seat-number">
{seats}
</div>

<div className="party-seat-percent">
{percent}%
</div>

</div>

</div>

)

})}

</div>

</div>

)

}