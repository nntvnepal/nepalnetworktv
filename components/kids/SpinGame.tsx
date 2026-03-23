"use client"

import { useState } from "react"

export default function SpinGame({
  canSpin,
  onWin
}: {
  canSpin: boolean
  onWin?: (v: number) => void
}) {

  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState("")

  // 🎯 POINT SYSTEM (NO ₹)
  const rewards = ["10", "20", "50", "TRY", "30", "5"]

  // 🎯 CONTROLLED REWARD LOGIC
  const getControlledIndex = () => {
    const rand = Math.random()

    if (rand < 0.4) return 3 // TRY
    if (rand < 0.7) return 5 // 5 pts
    if (rand < 0.9) return 0 // 10 pts
    if (rand < 0.97) return 1 // 20 pts
    if (rand < 0.995) return 4 // 30 pts
    return 2 // 50 pts (rare)
  }

  const spin = () => {
    if (!canSpin || spinning) return

    setSpinning(true)
    setResult("")

    let randomIndex = getControlledIndex()

    // 😈 NEAR MISS EFFECT
    if (Math.random() < 0.3 && randomIndex !== 3) {
      randomIndex = (randomIndex + 1) % rewards.length
    }

    const reward = rewards[randomIndex]

    const anglePerSlice = 360 / rewards.length
    const offset = Math.random() * (anglePerSlice - 10)

    const finalAngle =
      360 * 5 +
      (360 - randomIndex * anglePerSlice - anglePerSlice / 2) +
      offset

    setRotation((prev) => prev + finalAngle)

    // suspense 😈
    setTimeout(() => {
      setResult("...")
    }, 3500)

    setTimeout(() => {
      setSpinning(false)

      if (reward === "TRY") {
        setResult("😅 Try Again")
      } else {
        setResult(`🎉 +${reward} Points`)
        onWin && onWin(Number(reward))
      }
    }, 4200)
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "260px",
      position: "relative"
    }}>

      {/* 🔒 GLASS LOCK */}
      {!canSpin && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "190px",
          height: "190px",
          borderRadius: "50%",
          backdropFilter: "blur(6px)",
          background: "rgba(255,255,255,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "700",
          fontSize: "13px",
          zIndex: 2,
          animation: "pulseText 1.5s infinite"
        }}>
          🔒 Solve puzzle to spin
        </div>
      )}

      {/* POINTER */}
      <div style={{
        width: 0,
        height: 0,
        borderLeft: "10px solid transparent",
        borderRight: "10px solid transparent",
        borderBottom: "20px solid #9e0101",
        marginBottom: "-6px",
        zIndex: 1
      }} />

      {/* WHEEL */}
      <div style={{
        width: "190px",
        height: "190px",
        borderRadius: "50%",
        position: "relative",
        transform: `rotate(${rotation}deg)`,
        transition: spinning
          ? "transform 4s cubic-bezier(0.25, 1, 0.5, 1)"
          : "none",

        background: `
          conic-gradient(
            #f97316 0deg 60deg,
            #fb923c 60deg 120deg,
            #fdba74 120deg 180deg,
            #fed7aa 180deg 240deg,
            #f97316 240deg 300deg,
            #fb923c 300deg 360deg
          )
        `,

        boxShadow: `
          0 10px 25px rgba(0,0,0,0.25),
          inset 0 4px 10px rgba(255,255,255,0.4),
          inset 0 -6px 12px rgba(0,0,0,0.2)
        `,
        border: "4px solid #7c2d12"
      }}>

        {/* 🎯 PERFECT LABELS */}
        {rewards.map((r, i) => {
          const angle = (360 / rewards.length) * i
          const radius = 65

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `
                  rotate(${angle}deg)
                  translateY(-${radius}px)
                  rotate(-${angle}deg)
                `,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "42px",
                fontSize: "14px",
                fontWeight: "900",
                color: "#1f2937",
                textShadow: "0 1px 2px rgba(0,0,0,0.25)"
              }}
            >
              {r === "TRY" ? "❌" : `${r}`}
            </div>
          )
        })}

        {/* CENTER BUTTON */}
        <div
          onClick={spin}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "75px",
            height: "75px",
            borderRadius: "50%",
            background: canSpin
              ? "linear-gradient(145deg, #111827, #000000)"
              : "#9ca3af",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "800",
            fontSize: "14px",
            cursor: canSpin ? "pointer" : "not-allowed",
            boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
            animation: canSpin && !spinning ? "pulse 1.8s infinite" : "none"
          }}
        >
          {spinning ? "..." : "SPIN"}
        </div>

      </div>

      {/* RESULT */}
      <div style={{
        height: "22px",
        marginTop: "8px",
        fontSize: "14px",
        fontWeight: "700"
      }}>
        {result}
      </div>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.08); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }

        @keyframes pulseText {
          0% { opacity: 0.6 }
          50% { opacity: 1 }
          100% { opacity: 0.6 }
        }
      `}</style>

    </div>
  )
}