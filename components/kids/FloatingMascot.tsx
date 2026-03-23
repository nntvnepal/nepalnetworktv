"use client"

import { useEffect, useState } from "react"

export default function FloatingMascot() {
  const [message, setMessage] = useState("Hey! 👋 Ready to learn?")

  useEffect(() => {
    const messages = [
      "Hey! 👋 Ready to learn?",
      "Try a fun game 🎮",
      "You can earn rewards 🏆",
      "Let’s start learning 📚"
    ]

    const interval = setInterval(() => {
      const random = Math.floor(Math.random() * messages.length)
      setMessage(messages[random])
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* 💬 MESSAGE */}
      <div
        style={{
          position: "fixed",
          bottom: "110px",
          left: "20px", // 👈 RIGHT → LEFT FIX
          background: "white",
          padding: "10px 14px",
          borderRadius: "14px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          fontSize: "13px",
          maxWidth: "180px",
          zIndex: 50
        }}
      >
        {message}
      </div>

      {/* 🧍 MASCOT */}
      <img
        src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
        alt="nntv kid"
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px", // 👈 RIGHT → LEFT FIX
          width: "70px",
          cursor: "pointer",
          zIndex: 50,
          animation: "float 3s ease-in-out infinite"
        }}
      />

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
    </>
  )
}