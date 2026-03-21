"use client"

import { useState, useEffect } from "react"
import ToolsCard from "../ToolsCard"

export default function ReactionTest() {

  const [status, setStatus] = useState<"idle" | "waiting" | "ready">("idle")
  const [startTime, setStartTime] = useState<number | null>(null)
  const [reaction, setReaction] = useState<number | null>(null)

  //////////////////////////////////////////////////////
  // START
  //////////////////////////////////////////////////////

  function startGame() {
    setStatus("waiting")
    setReaction(null)

    const delay = Math.random() * 2000 + 1000

    setTimeout(() => {
      setStatus("ready")
      setStartTime(Date.now())
    }, delay)
  }

  //////////////////////////////////////////////////////
  // CLICK
  //////////////////////////////////////////////////////

  function handleClick() {
    if (status === "waiting") {
      setStatus("idle")
      setReaction(null)
      alert("Too early! 😅")
      return
    }

    if (status === "ready" && startTime) {
      const time = Date.now() - startTime
      setReaction(time)
      setStatus("idle")
    }
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <ToolsCard title="Reaction Test">

      <div className="space-y-4">

        <button
          onClick={status === "idle" ? startGame : handleClick}
          className={`w-full p-4 rounded-lg text-white ${
            status === "ready"
              ? "bg-green-600"
              : status === "waiting"
              ? "bg-yellow-600"
              : "bg-purple-600"
          }`}
        >
          {status === "idle" && "Start"}
          {status === "waiting" && "Wait..."}
          {status === "ready" && "CLICK NOW!"}
        </button>

        {reaction !== null && (
          <p className="text-center text-green-400">
            ⚡ {reaction} ms
          </p>
        )}

      </div>

    </ToolsCard>
  )
}