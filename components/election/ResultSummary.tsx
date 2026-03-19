"use client"

import { useLiveResults } from "./LiveResultsProvider"

export default function ResultSummary(){

const { results } = useLiveResults()

//////////////////////////////////////////////////////
// CALCULATE
//////////////////////////////////////////////////////

const seatWinners:any = {}

results.forEach((r:any)=>{

const seat = r.seatId

if(!seatWinners[seat]){
seatWinners[seat] = r
return
}

if(r.votes > seatWinners[seat].votes){
seatWinners[seat] = r
}

})

const totalSeats = Object.keys(seatWinners).length

let leading = 0
let won = 0

Object.values(seatWinners).forEach((r:any)=>{

if(r.isWinner){
won++
}else{
leading++
}

})

//////////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////////

return(

<div className="summary-grid">

<div className="summary-card summary-total">

<div className="summary-title">
Total Seats
</div>

<div className="summary-value">
{totalSeats}
</div>

</div>


<div className="summary-card">

<div className="summary-title">
Leading
</div>

<div className="summary-value">
{leading}
</div>

</div>


<div className="summary-card">

<div className="summary-title">
Won
</div>

<div className="summary-value">
{won}
</div>

</div>

</div>

)

}