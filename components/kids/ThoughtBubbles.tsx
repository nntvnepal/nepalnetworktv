"use client"

import { useEffect, useState } from "react"

export default function ThoughtBubbles() {

  const questions = [
    "Why does ice float on water?",
    "Explain weightlessness in space",
    "Why sky is blue & sunset red?",
    "If Earth stops rotating?",
    "Define gravity",
    "Mass vs Weight difference?",
    "Newton’s First Law?",
    "Pressure increases with depth why?",
    "Explain photosynthesis",
    "Speed formula derive karo",

    "Causes of 1857 revolt?",
    "Effects of 1857 rebellion?",
    "Unification of Nepal impact?",
    "Define democracy",
    "Federal system kya hota hai?",
    "भारतको संविधान कहिले बन्यो?",
    "Who was first PM of India?",
    "नेपाल एकीकरण कसले गर्‍यो?",

    "Why metals conduct electricity?",
    "Chemical bonding kya hai?",
    "Define atom",
    "H2O structure explain karo",
    "Acid vs Base difference?",
    "Periodic table kya hai?",
    "Why salt dissolves in water?",
    "Electron kya hota hai?",

    "Solve: x² − 7x + 10",
    "Quadratic equation kya hai?",
    "LCM vs HCF difference?",
    "Probability kya hai?",
    "Ratio & proportion explain karo",
    "Square root kya hota hai?"
  ]

  const [boyIndex, setBoyIndex] = useState(0)
  const [girlIndex, setGirlIndex] = useState(10)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return

    const interval = setInterval(() => {
      setBoyIndex((p) => (p + 1) % questions.length)
      setGirlIndex((p) => (p + 3) % questions.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [mounted])

  if (!mounted) return null

  const boyQ = questions[boyIndex]
  const girlQ = questions[girlIndex]

  return (
    <>
      <style>
        {`
          @keyframes float1 {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
            100% { transform: translateY(0px); }
          }

          @keyframes float2 {
            0% { transform: translateY(0px); }
            50% { transform: translateY(6px); }
            100% { transform: translateY(0px); }
          }

          @keyframes pop {
            0% { opacity: 0; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}
      </style>

      {/* 👦 BOY */}
      <div
        style={{
          position: "absolute",
          right: "170px",
          top: "55px", // 👈 heading ke niche fix
          width: "190px",
          background: "#ffffff",
          padding: "12px 16px",
          borderRadius: "18px",
          fontSize: "13px",
          lineHeight: "1.4",
          boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
          animation: "pop 0.3s ease, float1 5s ease-in-out infinite",
          zIndex: 10
        }}
      >
        {boyQ}

        {/* dots tail */}
        <div style={{
          position: "absolute",
          bottom: "-10px",
          left: "40%",
          width: "14px",
          height: "14px",
          background: "#fff",
          borderRadius: "50%"
        }} />
        <div style={{
          position: "absolute",
          bottom: "-22px",
          left: "48%",
          width: "8px",
          height: "8px",
          background: "#fff",
          borderRadius: "50%"
        }} />
      </div>

      {/* 👧 GIRL */}
      <div
        style={{
          position: "absolute",
          right: "10px",
          top: "70px",
          width: "190px",
          background: "#ffffff",
          padding: "12px 16px",
          borderRadius: "18px",
          fontSize: "13px",
          lineHeight: "1.4",
          boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
          animation: "pop 0.3s ease, float2 6s ease-in-out infinite",
          zIndex: 10
        }}
      >
        {girlQ}

        {/* dots tail */}
        <div style={{
          position: "absolute",
          bottom: "-10px",
          left: "55%",
          width: "14px",
          height: "14px",
          background: "#fff",
          borderRadius: "50%"
        }} />
        <div style={{
          position: "absolute",
          bottom: "-22px",
          left: "63%",
          width: "8px",
          height: "8px",
          background: "#fff",
          borderRadius: "50%"
        }} />
      </div>
    </>
  )
}