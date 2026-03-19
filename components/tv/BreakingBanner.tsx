"use client"

import styles from "./breaking.module.css"

type Props = {
  text: string
}

export default function BreakingBanner({ text }: Props){

  const parts = text.split(",")

  const headline = parts[0]
  const subline = parts[1] || ""

  // 🔥 repeat text for smooth loop
  const loopText = subline
    ? `${subline} ✦ ${subline} ✦ ${subline}`
    : "BREAKING NEWS ✦ BREAKING NEWS ✦ BREAKING NEWS"

  return(
    <div className={styles.wrap}>

      <div className={styles.banner}>

        {/* 🔴 TOP LABEL */}
        <div className={styles.topLabel}>
          BREAKING NEWS
        </div>

        {/* 🟡 HEADLINE */}
        <div className={styles.mainBar}>
          <span>{headline}</span>
        </div>

        {/* 🔽 BOTTOM STRIP */}
        <div className={styles.bottomBar}>
          <span>{loopText}</span>
          <div className={styles.endPart}></div>
        </div>

      </div>

    </div>
  )
}