"use client"

import { useEffect, useState } from "react"
import styles from "./scrollTicker.module.css"
import TimeWidget from "@/components/tv/TimeWidget"

type Item = {
  id: string
  text: string
}

export default function ScrollTicker({ items }: { items: Item[] }) {

  const [flip,setFlip] = useState(false)

  useEffect(()=>{
    const i = setInterval(()=>{
      setFlip(f=>!f)
    },4000) // same as flash

    return ()=>clearInterval(i)
  },[])

  const loopItems = items.length ? [...items, ...items] : []

  return (
    <div className={styles.wrap}>

      <div className={styles.bar}>

        {/* ✅ LEFT STACK FIXED */}
        <div className={`${styles.leftStack} ${flip ? styles.flip : ""}`}>

          <div className={styles.timeBox}>
            <TimeWidget/>
          </div>

          <div className={styles.labelBox}>
            ताजा खबरहरु
          </div>

        </div>

        {/* SCROLL */}
        <div className={styles.scroll}>
          <div className={styles.track}>
            {loopItems.map((item,index)=>(
              <span key={index} className={styles.item}>
                {item.text}
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}