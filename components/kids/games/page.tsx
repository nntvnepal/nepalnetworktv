"use client"

import { useState } from "react"
import KidsPageLayout from "@/components/kids/KidsPageLayout"
import PuzzleGame from "@/components/kids/PuzzleGame"
import Spinner from "@/components/kids/SpinGame"

export default function GamesPage() {
  const [points, setPoints] = useState(0)

  // 🔹 Common win handler
  const handleWin = () => {
    setPoints((prev) => prev + 10)
  }

  return (
    <KidsPageLayout
      title="🎮 Fun Games"
      subtitle="Solve puzzles and spin to win points!"
    >
      {/* 🔹 Points Display */}
      <div className="mb-4 font-bold text-lg">
        Points: {points}
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* ✅ FIXED */}
        <PuzzleGame onWin={handleWin} />

        {/* 🔹 If Spinner also needs onWin (safe pass) */}
       <Spinner
  canSpin={true}
  onWin={(v) => setPoints(prev => prev + v)}
/>
      </div>
    </KidsPageLayout>
  )
}