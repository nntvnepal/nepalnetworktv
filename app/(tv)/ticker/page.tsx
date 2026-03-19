"use client"

import { useEffect, useState } from "react"
import styles from "./ticker.module.css"

import LowerThird from "@/components/tv/LowerThird"
import ScrollTicker from "@/components/tv/ScrollTicker"
import BreakingBanner from "@/components/tv/BreakingBanner"
import FlashNews from "@/components/tv/FlashNews"

type Ticker = {
  id: string
  text: string
  mode: "scroll" | "flash" | "breaking"
  isActive: boolean
}

////////////////////////////////////////////////////////
// 👇 NEW TYPE (LOWER THIRD)
////////////////////////////////////////////////////////

type LowerThirdData = {
  name: string
  role: string
  tag?: "LIVE" | "REPORTING" | "EXCLUSIVE"
  isActive: boolean
}

export default function TVTickerPage(){

  const [scroll,setScroll] = useState<Ticker[]>([])
  const [flash,setFlash] = useState<Ticker | null>(null)
  const [breaking,setBreaking] = useState<Ticker | null>(null)

  ////////////////////////////////////////////////////////
  // 👇 LOWER THIRD STATE
  ////////////////////////////////////////////////////////

  const [lower,setLower] = useState<LowerThirdData | null>(null)

  ////////////////////////////////////////////////////////
  // LOAD DATA
  ////////////////////////////////////////////////////////

  async function loadTicker(){

    try{

      const res = await fetch("/api/tv-control/ticker",{ cache:"no-store" })
      const data = await res.json()

      const active = data.filter((t:Ticker)=>t.isActive)

      setScroll(active.filter((t:Ticker)=>t.mode==="scroll"))

      const newFlash = active.find((t:Ticker)=>t.mode==="flash") || null
      const newBreaking = active.find((t:Ticker)=>t.mode==="breaking") || null

      setFlash(prev=>{
        if(!newFlash) return null
        if(!prev) return newFlash
        if(prev.text !== newFlash.text) return newFlash
        return { ...newFlash }
      })

      setBreaking(prev=>{
        if(!newBreaking) return null
        if(!prev) return newBreaking
        if(prev.text !== newBreaking.text) return newBreaking
        return { ...newBreaking }
      })

      ////////////////////////////////////////////////////////
      // 👇 TEMP STATIC LOWER THIRD (TEST MODE)
      ////////////////////////////////////////////////////////

      setLower({
        name: "Ravi Sharma",
        role: "Senior Correspondent, Kathmandu",
        tag: "LIVE",
        isActive: true
      })

    }catch(err){
      console.error(err)
    }
  }

  ////////////////////////////////////////////////////////
  // POLLING
  ////////////////////////////////////////////////////////

  useEffect(()=>{
    loadTicker()
    const interval = setInterval(loadTicker,2000)
    return ()=>clearInterval(interval)
  },[])

  ////////////////////////////////////////////////////////
  // RENDER
  ////////////////////////////////////////////////////////

  return(

    <div className={styles.tvScreen}>

      {/* ⚡ FLASH FIRST */}
      {flash && (
        <FlashNews key={flash.id + flash.text} text={flash.text}/>
      )}

      {/* 🔴 BREAKING ONLY IF NO FLASH */}
      {!flash && breaking && (
        <BreakingBanner key={breaking.id + breaking.text} text={breaking.text}/>
      )}

      {/* 🟡 SCROLL ALWAYS */}
      <ScrollTicker items={scroll}/>

      {/* 🧑 LOWER THIRD (NEW) */}
      {lower?.isActive && (
        <LowerThird
          name={lower.name}
          role={lower.role}
          tag={lower.tag}
        />
      )}

    </div>
  )
}