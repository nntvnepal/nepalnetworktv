"use client"

import { useState } from "react"
import ToolsCard from "../ToolsCard"

export default function NumberGuess() {

  const [target] = useState(() => Math.floor(Math.random() * 100) + 1)
  const [guess, setGuess] = useState("")
  const [message, setMessage] = useState("")
  const [attempts, setAttempts] = useState(0)

  //////////////////////////////////////////////////////
  // CHECK
  //////////////////////////////////////////////////////

  function handleGuess() {
    const num = Number(guess)
    if (!num) return

    setAttempts((a) => a + 1)

    if (num === target) {
      setMessage(`🎉 Correct! (${target})`)
    } else if (num < target) {
      setMessage("Too low ⬇️")
    } else {
      setMessage("Too high ⬆️")
    }

    setGuess("")
  }

  //////////////////////////////////////////////////////
  // RESET
  //////////////////////////////////////////////////////

  function resetGame() {
    location.reload() // simple reset
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <ToolsCard title="Number Guess">

      <div className="space-y-3">

        <p className="text-xs text-gray-400">
          Guess a number between 1–100
        </p>

        <input
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          className="w-full p-2 bg-black/70 border border-purple-500/30 rounded text-white"
          placeholder="Enter number..."
        />

        <button
          onClick={handleGuess}
          className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded text-sm"
        >
          Guess
        </button>

        <p className="text-sm text-purple-300">
          {message}
        </p>

        <p className="text-xs text-gray-400">
          Attempts: {attempts}
        </p>

        <button
          onClick={resetGame}
          className="w-full bg-gray-700 hover:bg-gray-800 p-2 rounded text-xs"
        >
          Reset
        </button>

      </div>

    </ToolsCard>
  )
}