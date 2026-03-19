"use client"

import styles from "./candidatebattle.module.css"

type Candidate = {
  name: string
  party: string
  votes: number
  percent: number
  color: string
}

interface Props{
  seat: string
  candidates: Candidate[]
}

export default function CandidateBattle({ seat, candidates }: Props){

  const top = Math.max(...candidates.map(c => c.percent))

  return(
    <div className={styles.wrap}>

      {/* HEADER */}
      <div className={styles.header}>
        {seat}
      </div>

      {/* LIST */}
      <div className={styles.list}>
        {candidates.map((c,i)=>{

          const isLeading = c.percent === top

          return(
            <div key={i} className={`${styles.row} ${isLeading ? styles.lead : ""}`}>

              <div className={styles.party} style={{background:c.color}} />

              <div className={styles.partyName}>
                {c.party}
              </div>

              <div className={styles.name}>
                {c.name}
              </div>

              <div className={styles.votes}>
                {(c.votes ?? 0).toLocaleString()}
              </div>

              <div className={styles.percent}>
                {c.percent}%
              </div>

              <div className={styles.barWrap}>
                <div 
                  className={styles.bar}
                  style={{
                    width:`${c.percent}%`,
                    background:c.color
                  }}
                />
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}