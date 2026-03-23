"use client"

import { useEffect, useState } from "react"

const teachers = [
  "/teachers/t1.png",
  "/teachers/t2.png",
  "/teachers/t3.png",
  "/teachers/t4.png",
  "/teachers/t5.png",
  "/teachers/t6.png"
]

export default function Teacher({
  isCorrect,
  explanation
}: {
  isCorrect: boolean
  explanation: string
}) {
  const [teacher, setTeacher] = useState("")

  // 🎲 RANDOM TEACHER PER QUESTION
  useEffect(() => {
    const random =
      teachers[Math.floor(Math.random() * teachers.length)]
    setTeacher(random)
  }, [explanation])

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        animation: isCorrect ? "bounce 0.5s" : "shake 0.4s"
      }}
    >
      {/* 👩‍🏫 AVATAR */}
      <img
        src={teacher || "/teachers/t1.png"}
        alt="teacher"
        style={{
          width: "72px",              // 🔥 bigger size
          height: "72px",
          objectFit: "cover"
        }}
      />

      {/* 💬 BUBBLE */}
      <div
        style={{
          background: "#ffffff",
          color: "#111",
          padding: "10px 14px",
          borderRadius: "16px",
          fontSize: "14px",
          maxWidth: "220px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
          position: "relative"
        }}
      >
        {/* 👉 ARROW */}
        <div
          style={{
            position: "absolute",
            left: "-8px",
            top: "14px",
            width: 0,
            height: 0,
            borderTop: "8px solid transparent",
            borderBottom: "8px solid transparent",
            borderRight: "8px solid white"
          }}
        />

        {/* 🧠 MESSAGE */}
        <div style={{ fontWeight: 600, marginBottom: "4px" }}>
          {isCorrect
            ? "Great job! 👏"
            : "Oops! Try again 😊"}
        </div>

        {/* 💡 EXPLANATION */}
        <div style={{ fontSize: "13px", opacity: 0.85 }}>
          💡 {explanation}
        </div>
      </div>

      {/* 🎬 ANIMATION */}
      <style>
        {`
          @keyframes bounce {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }

          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-6px); }
            50% { transform: translateX(6px); }
            75% { transform: translateX(-6px); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  )
}