"use client"

import { useEffect, useState } from "react"
import styles from "./flash.module.css"

export default function FlashNews({ text }: { text: string }) {

  const [flip, setFlip] = useState(false)

  ////////////////////////////////////////////////////////
  // LABEL FLIP LOOP
  ////////////////////////////////////////////////////////

  useEffect(() => {

    const interval = setInterval(() => {
      setFlip(prev => !prev)
    }, 3000) // 🔥 smooth

    return () => clearInterval(interval)

  }, [])

  ////////////////////////////////////////////////////////
  // RESET ON TEXT CHANGE (IMPORTANT)
  ////////////////////////////////////////////////////////

  useEffect(() => {
    setFlip(false)
  }, [text])

  ////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////

  return (
    <div className={styles.flashWrap}>

      <div className={styles.flashWrapper}>

        <div className={`${styles.flashLabel} ${flip ? styles.flip : ""}`}>
          <span>FLASH</span>
          <span>NEWS</span>
        </div>

        <div className={styles.flashText}>
          <span>{text}</span>
        </div>

      </div>

    </div>
  )
}