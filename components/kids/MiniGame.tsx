"use client"

import { useState, useCallback } from "react"
import PuzzleGame from "@/components/kids/PuzzleGame"
import SpinGame from "@/components/kids/SpinGame"
import CoinPanel from "@/components/kids/CoinPanel"

type GameState = "waiting" | "idle" | "win" | "lose"

export default function GameSection() {

  const [canSpin, setCanSpin] = useState(false)
  const [coinsList, setCoinsList] = useState<number[]>([])
  const [gameKey, setGameKey] = useState(0)
  const [gameState, setGameState] = useState<GameState>("idle")

  // 🧠 Puzzle win
  const handlePuzzleWin = useCallback(() => {
    setCanSpin(true)
    setGameState("win")
  }, [])

  // 💰 Spinner result
  const handleSpinWin = useCallback((value: number) => {
    if (value > 0) {
      setCoinsList((prev) => [...prev, value])
      setGameState("win")
    } else {
      setGameState("lose")
    }

    // 🔒 lock spin again
    setCanSpin(false)

    // 🔁 reset puzzle
    setGameKey((k) => k + 1)
  }, [])

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        alignItems: "flex-start",
        marginTop: "10px",
        flexWrap: "wrap",
      }}
    >

      {/* 🧠 PUZZLE */}
      <PuzzleGame
        key={gameKey}
        onWin={handlePuzzleWin}
      />

      {/* 🎡 SPINNER */}
      <SpinGame
        canSpin={canSpin}
        onWin={handleSpinWin}
      />

      {/* 💰 COIN PANEL */}
      <CoinPanel
        coins={coinsList}
        gameState={gameState}
      />

    </div>
  )
}