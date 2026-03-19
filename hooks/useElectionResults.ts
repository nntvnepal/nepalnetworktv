"use client"

import { useEffect, useState } from "react"

export default function useElectionResults(){

const [data,setData] = useState<any>(null)
const [loading,setLoading] = useState(true)

async function load(){

try{

const res = await fetch("/api/elections/map-results")

const json = await res.json()

setData(json)

setLoading(false)

}catch(err){

console.error("LIVE FETCH ERROR",err)

}

}

useEffect(()=>{

load()

const timer = setInterval(load,5000)

return ()=>clearInterval(timer)

},[])

return { data, loading }

}