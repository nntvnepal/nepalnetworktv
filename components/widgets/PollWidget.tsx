"use client"

import { useEffect, useMemo, useState } from "react"

export default function PollWidget({ poll }: any){

const [selected,setSelected] = useState<string | null>(null)
const [showResults,setShowResults] = useState(false)
const [loading,setLoading] = useState(false)

if(!poll) return null

const options = poll.options || []

//////////////////////////////////////////////////////
// CALCULATIONS (MEMOIZED)
//////////////////////////////////////////////////////

const { totalVotes, maxVotes } = useMemo(()=>{

const total = options.reduce(
(a:number,b:any)=>a + b.votes,
0
)

const max = Math.max(...options.map((o:any)=>o.votes),0)

return{
totalVotes:total,
maxVotes:max
}

},[options])

//////////////////////////////////////////////////////
// CHECK LOCAL STORAGE
//////////////////////////////////////////////////////

useEffect(()=>{

try{

const voted = localStorage.getItem(`poll_${poll.id}`)

if(voted){
setShowResults(true)
}

}catch(err){}

},[poll.id])

//////////////////////////////////////////////////////
// VOTE
//////////////////////////////////////////////////////

async function submitVote(){

if(!selected || loading) return

try{

const voted = localStorage.getItem(`poll_${poll.id}`)

if(voted){
setShowResults(true)
return
}

setLoading(true)

await fetch("/api/poll/vote",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
optionId:selected,
pollId:poll.id
})

})

localStorage.setItem(`poll_${poll.id}`,"true")

setShowResults(true)

}catch(err){

console.error("Vote failed",err)

}

setLoading(false)

}

//////////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////////

return(

<section className="poll-wrapper w-full">

<div className="poll-card w-full">

{/* HEADER */}

<div className="poll-header">

<div className="poll-badge">

<span className="poll-lines"></span>

<span className="poll-title-text">
जनआवाज
</span>

</div>

<span className="poll-sub">
NNTV Audience Poll
</span>

</div>

{/* QUESTION */}

<h2 className="poll-question">
{poll.question}
</h2>

{/* OPTIONS */}

{!showResults &&(

<div className="poll-options">

{options.map((opt:any)=>(

<label
key={opt.id}
className={`poll-option ${selected===opt.id ? "active":""}`}
>

<input
type="radio"
name="poll"
checked={selected===opt.id}
onChange={()=>setSelected(opt.id)}
/>

<span>{opt.text}</span>

</label>

))}

</div>

)}

{/* RESULTS */}

{showResults &&(

<div className="poll-results">

{options.map((opt:any)=>{

const percent = totalVotes
? Math.round((opt.votes/totalVotes)*100)
: 0

const isWinner = opt.votes === maxVotes

return(

<div
key={opt.id}
className={`result-row ${isWinner ? "winner":""}`}
>

<span className="result-label">
{opt.text}
</span>

<div className="result-bar">

<div
className="result-fill"
style={{
width:percent+"%",
background:isWinner
? "linear-gradient(135deg,#6b0f63,#a21caf)"
: "#4b5563"
}}
/>

</div>

<span className="result-num">
{percent}%
</span>

</div>

)

})}

</div>

)}

{/* BUTTON */}

{!showResults &&(

<button
disabled={!selected || loading}
className="poll-vote"
onClick={submitVote}
>

{loading ? "Submitting..." : "मत दिनुहोस्"}

</button>

)}

</div>

</section>

)

}