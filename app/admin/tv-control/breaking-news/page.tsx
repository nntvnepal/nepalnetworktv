"use client"

import { useEffect, useState } from "react"

type TickerMode = "scroll" | "flash" | "breaking"

type Ticker = {
id: string
text: string
mode: TickerMode
isActive: boolean
}

export default function TickerControl(){

const [text,setText] = useState("")
const [mode,setMode] = useState<TickerMode>("scroll")
const [ticker,setTicker] = useState<Ticker[]>([])
const [loading,setLoading] = useState(false)
const [saving,setSaving] = useState(false)

//////////////////////////////////////////
// LOAD TICKERS
//////////////////////////////////////////

async function loadTicker(){

try{

  setLoading(true)

  const res = await fetch("/api/tv-control/ticker")
  const data = await res.json()

  setTicker(data)

}catch(err){

  console.error("Ticker load error:",err)

}finally{

  setLoading(false)

}


}

//////////////////////////////////////////
// INITIAL LOAD
//////////////////////////////////////////

useEffect(()=>{


loadTicker()

const interval = setInterval(loadTicker,5000)

return ()=>clearInterval(interval)


},[])

//////////////////////////////////////////
// ADD TICKER
//////////////////////////////////////////

async function addTicker(){

if(!text.trim()) return

try{

  setSaving(true)

  await fetch("/api/tv-control/ticker",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      text,
      mode
    })
  })

  setText("")
  setMode("scroll")

  loadTicker()

}catch(err){

  console.error("Add ticker failed:",err)

}finally{

  setSaving(false)

}


}

//////////////////////////////////////////
// DELETE
//////////////////////////////////////////

async function deleteTicker(id:string){

await fetch("/api/tv-control/ticker",{
  method:"DELETE",
  headers:{ "Content-Type":"application/json" },
  body:JSON.stringify({id})
})

loadTicker()


}

//////////////////////////////////////////
// TOGGLE LIVE
//////////////////////////////////////////

async function toggleTicker(id:string){


await fetch("/api/tv-control/ticker",{
  method:"POST",
  headers:{ "Content-Type":"application/json" },
  body:JSON.stringify({
    toggleId:id
  })
})

loadTicker()


}

//////////////////////////////////////////
// UI
//////////////////////////////////////////

return(


<div className="text-white max-w-4xl">

  <div className="flex justify-between items-center mb-6">

    <h1 className="text-2xl font-bold">
      TV Ticker Control
    </h1>

    <button
      onClick={loadTicker}
      className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded"
    >
      Refresh
    </button>

  </div>

  <div className="flex gap-3 mb-6">

    <select
      value={mode}
      onChange={(e)=>setMode(e.target.value as TickerMode)}
      className="bg-black/40 border border-white/10 px-3 rounded"
    >
      <option value="scroll">Scroll</option>
      <option value="flash">Flash</option>
      <option value="breaking">Breaking</option>
    </select>

    <input
      value={text}
      maxLength={160}
      onChange={(e)=>setText(e.target.value)}
      onKeyDown={(e)=>{
        if(e.key==="Enter") addTicker()
      }}
      placeholder="Enter ticker text..."
      className="flex-1 p-3 rounded bg-black/40 outline-none border border-white/10"
    />

    <button
      onClick={addTicker}
      disabled={saving}
      className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-medium"
    >
      {saving ? "Adding..." : "Add"}
    </button>

  </div>

  <p className="text-xs text-gray-400 mb-6">
    Max 160 characters • Toggle LIVE to send ticker to TV
  </p>

  <div className="space-y-3">

    {loading && (
      <div className="text-gray-400 text-sm">
        Loading ticker...
      </div>
    )}

    {!loading && ticker.length===0 && (
      <div className="text-gray-400 text-sm">
        No ticker added yet.
      </div>
    )}

    {ticker.map((item)=>(
      <div
        key={item.id}
        className="flex justify-between items-center bg-black/30 border border-white/10 p-4 rounded"
      >

        <div className="flex flex-col flex-1 pr-4">

          <span>{item.text}</span>

          <span className="text-xs text-purple-300 uppercase mt-1">
            {item.mode}
          </span>

        </div>

        <div className="flex gap-3 items-center">

          <button
            onClick={()=>toggleTicker(item.id)}
            className={
              "px-3 py-1 rounded text-xs font-medium " +
              (item.isActive
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-600 hover:bg-gray-700")
            }
          >
            {item.isActive ? "LIVE" : "OFF"}
          </button>

          <button
            onClick={()=>deleteTicker(item.id)}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            Delete
          </button>

        </div>

      </div>
    ))}

  </div>

</div>


)

}
