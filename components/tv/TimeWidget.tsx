"use client"

import { useEffect, useState } from "react"
import styles from "./TimeWidget.module.css"

export default function TimeWidget(){

  const [time,setTime] = useState("")

  useEffect(()=>{

    const updateTime = () => {
      const now = new Date()

      const formatted = now.toLocaleTimeString("en-GB",{
        hour:"2-digit",
        minute:"2-digit"
      })

      setTime(formatted)
    }

    updateTime() // 🔥 instant render (no 1s delay)

    const clock = setInterval(updateTime,1000)

    return ()=>clearInterval(clock)

  },[])

  return(
    <div className={styles.timeWidget}>
      <span className={styles.timeText}>
        {time} Hrs
      </span>
    </div>
  )
}