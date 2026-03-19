"use client"

import styles from "./lowerthird.module.css"

interface Props{
  name: string
  role: string
  tag?: "LIVE" | "REPORTING" | "EXCLUSIVE"
}

export default function LowerThird({ name, role, tag = "LIVE" }: Props){
  return (
    <div className={styles.wrap}>

      <div className={styles.container}>

        {/* FRAME */}
        <div className={styles.frameTop}></div>
        <div className={styles.frameTopRight}></div>
        <div className={styles.frameBottom}></div>
        <div className={styles.cornerLeft}></div>
        <div className={styles.cornerRight}></div>

        {/* LEFT */}
        <div className={styles.leftBox}>LIVE</div>

        {/* MAIN */}
        <div className={styles.main}>

          <div className={styles.text}>
            <div className={styles.name}>{name}</div>
            <div className={styles.role}>{role}</div>
          </div>

          <div className={styles.bottomStrip}></div>

        </div>

        {/* RIGHT */}
        <div className={styles.rightBox}>
          <span>{tag}</span>
        </div>

      </div>

    </div>
  )
}