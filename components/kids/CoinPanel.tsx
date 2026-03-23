"use client"

import { useEffect, useState } from "react"

export default function CoinPanel({
  coins,
  gameState
}: {
  coins: number[]
  gameState: "idle" | "waiting" | "win" | "lose"
}) {

  const total = coins.reduce((a, b) => a + b, 0)
  const [bubble, setBubble] = useState("Let's play!")

  // 🎭 RANDOM BUBBLE TEXT
  useEffect(() => {
    if (gameState === "waiting") {
      const arr = ["Best of luck!", "Finish it fast!", "Surprise waiting!"]
      setBubble(arr[Math.floor(Math.random() * arr.length)])
    }

    if (gameState === "lose") {
      const arr = ["UFF!", "Bad luck!", "Try again!"]
      setBubble(arr[Math.floor(Math.random() * arr.length)])
    }

    if (gameState === "win") {
      const arr = ["Hurray!", "Awesome!", "You did it!"]
      setBubble(arr[Math.floor(Math.random() * arr.length)])
    }

  }, [gameState])

  const getImage = () => {
    if (gameState === "win") return "/kids/happy.png"
    if (gameState === "lose") return "/kids/sad.png"
    if (gameState === "waiting") return "/kids/playing.png"
    return "/kids/idle.png"
  }

  return (
    <div style={{
      width: "170px",
      padding: "10px",
      borderRadius: "14px",
      background: "#fff",
      boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
      textAlign: "center",
      position: "relative"
    }}>

      {/* 💬 SPEECH BUBBLE */}
      <div style={{
        position: "absolute",
        top: "-10px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#6366f1",
        color: "#fff",
        padding: "5px 10px",
        borderRadius: "10px",
        fontSize: "11px",
        fontWeight: "600",
        animation: "bubblePop 0.4s ease"
      }}>
        {bubble}
      </div>

      {/* 👦 CHARACTER */}
      <img
        src={getImage()}
        alt="reaction"
        style={{
          width: "100%",
          height: "110px",
          objectFit: "contain",
          animation:
            gameState === "win"
              ? "jump 0.5s ease"
              : gameState === "lose"
              ? "shake 0.4s"
              : "idle 2s infinite"
        }}
      />

      {/* ⭐ POINTS */}
      <div style={{
        marginTop: "8px",
        fontSize: "14px",
        fontWeight: "800",
        color: "#f59e0b"
      }}>
        ⭐ {total}
      </div>

      {/* 🎬 ANIMATIONS */}
      <style>{`
        @keyframes bubblePop {
          0% { transform: translate(-50%, -10px) scale(0.8); opacity: 0 }
          100% { transform: translate(-50%, 0) scale(1); opacity: 1 }
        }

        @keyframes jump {
          0% { transform: translateY(0) }
          50% { transform: translateY(-10px) }
          100% { transform: translateY(0) }
        }

        @keyframes shake {
          0% { transform: translateX(0) }
          25% { transform: translateX(-4px) }
          50% { transform: translateX(4px) }
          75% { transform: translateX(-4px) }
          100% { transform: translateX(0) }
        }

        @keyframes idle {
          0% { transform: scale(1) }
          50% { transform: scale(1.03) }
          100% { transform: scale(1) }
        }
      `}</style>

    </div>
  )
}