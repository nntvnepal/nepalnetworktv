"use client"
import MiniGame from "@/components/kids/MiniGame"
import { useEffect, useState } from "react"
import ThoughtBubbles from "@/components/kids/ThoughtBubbles"

export default function Hero() {
  const text = "Learn Like a Game"
  const [displayText, setDisplayText] = useState("")
  const [index, setIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let timeout: any

    if (!isDeleting && index < text.length) {
      timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[index])
        setIndex(index + 1)
      }, 70)
    } else if (!isDeleting && index === text.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800)
    } else if (isDeleting && index > 0) {
      timeout = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1))
        setIndex(index - 1)
      }, 40)
    } else if (isDeleting && index === 0) {
      setIsDeleting(false)
    }

    return () => clearTimeout(timeout)
  }, [index, isDeleting])

  return (
    <>
      <style>
        {`
          @keyframes floaty {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>

      <div
        style={{
          padding: "35px 20px",
          borderRadius: "24px",
          maxWidth: "900px",
          width: "100%",
          margin: "0 auto",
          position: "relative", // 👈 IMPORTANT
          overflow: "hidden",
          background: "#eff3ea",
          boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
          transition: "transform 0.2s ease"
        }}
      >
        {/* TEXTURE */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
              radial-gradient(circle at 20% 30%, rgba(224, 228, 186, 0.5), transparent 40%),
              radial-gradient(circle at 80% 70%, rgba(255,255,255,0.3), transparent 40%)
            `,
            pointerEvents: "none"
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {/* LEFT */}
          <div
            style={{
              flex: 1,
              zIndex: 2,
              paddingLeft: "25px",
              maxWidth: "520px"
            }}
          >
            {/* TYPEWRITER */}
            <div style={{ position: "relative" }}>
              <h1 style={{ fontSize: "40px", fontWeight: "800", margin: 0, color: "transparent" }}>
                {text}
              </h1>

              <h1
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  fontSize: "40px",
                  fontWeight: "800",
                  margin: 0,
                  color: "#1e293b"
                }}
              >
                {displayText}
              </h1>
            </div>

            {/* ICON */}
            <div
              style={{
                marginTop: "14px",
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, #ffffff, #fff7ed)",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                animation: "floaty 3s ease-in-out infinite"
              }}
            >
              🎮
            </div>

            <p style={{ marginTop: "12px", color: "#475569", fontSize: "15px" }}>
              Play • Learn • Earn Rewards{" "}
              <span style={{ display: "inline-block", animation: "floaty 4s ease-in-out infinite" }}>
                🚀
              </span>
            </p>

            <button
              style={{
                marginTop: "18px",
                padding: "12px 24px",
                borderRadius: "12px",
                border: "none",
                background: "#f97316",
                color: "white",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Start Playing
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <img
          src="/mascot.png"
          alt="kids"
          style={{
            position: "absolute",
            right: "60px",
            bottom: "-5px",
            width: "230px",
            animation: "floaty 4s ease-in-out infinite"
          }}
        />

        {/* 💬 BUBBLES (CORRECT PLACE) */}
        <ThoughtBubbles />
      </div>
      <MiniGame />
    </>
  )
}