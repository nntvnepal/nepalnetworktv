"use client"

import { useState } from "react"

export default function MathPuzzle({ onWin }: { onWin: () => void }) {

  const totalLevels = 4

  // 🧠 dynamic generator (difficulty based)
  const generatePuzzle = (level: number) => {
    let max = 10 + level * 10 // difficulty increase

    const a = Math.floor(Math.random() * max) + 1
    const b = Math.floor(Math.random() * max) + 1
    const sum = a + b

    return {
      grid: [
        [String(a), "+", ""],
        ["=", "", "="],
        ["", "", String(sum)]
      ],
      answer: {
        topRight: String(b),
        bottomLeft: String(sum)
      }
    }
  }

  const [level, setLevel] = useState(0)
  const [puzzle, setPuzzle] = useState(generatePuzzle(0))
  const [grid, setGrid] = useState(puzzle.grid)
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle")
  const [showAnswer, setShowAnswer] = useState(false)

  const handleChange = (r: number, c: number, val: string) => {
    if (val.length > 3) return
    const newGrid = grid.map(row => [...row])
    newGrid[r][c] = val
    setGrid(newGrid)
  }

  const triggerConfetti = () => {
    const conf = document.createElement("div")
    conf.innerText = "🎉🎉🎉"
    conf.style.position = "fixed"
    conf.style.top = "40%"
    conf.style.left = "50%"
    conf.style.transform = "translate(-50%, -50%)"
    conf.style.fontSize = "40px"
    conf.style.zIndex = "9999"
    document.body.appendChild(conf)
    setTimeout(() => conf.remove(), 900)
  }

  const handleCheck = () => {
    const correct =
      grid[0][2] === puzzle.answer.topRight &&
      grid[2][0] === puzzle.answer.bottomLeft

    if (correct) {
      setStatus("correct")

      if (level === totalLevels - 1) {
        triggerConfetti()
        setTimeout(() => onWin(), 700)
      } else {
        setTimeout(() => {
          const next = level + 1
          const newPuzzle = generatePuzzle(next)
          setLevel(next)
          setPuzzle(newPuzzle)
          setGrid(newPuzzle.grid)
          setShowAnswer(false)
          setStatus("idle")
        }, 700)
      }

    } else {
      setStatus("wrong")
      setShowAnswer(true)
      setTimeout(() => setStatus("idle"), 500)
    }
  }

  const progress = (level / totalLevels) * 100

  const boxStyle = {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "16px",
    background: "#fff",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)"
  }

  return (
    <>
      {/* 🔥 Animations */}
      <style>
        {`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }

        @keyframes glow {
          0% { box-shadow: 0 0 0px rgba(34,197,94,0); }
          50% { box-shadow: 0 0 12px rgba(34,197,94,0.6); }
          100% { box-shadow: 0 0 0px rgba(34,197,94,0); }
        }
      `}
      </style>

      <div style={{
        width: "100%",
        maxWidth: "460px",
        height: "205px",
        padding: "10px",
        borderRadius: "18px",
        background: "linear-gradient(135deg, #eef2ff, #ffffff)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: status === "wrong" ? "2px solid #ef4444" : "2px solid #6366f1",
        animation: status === "wrong" ? "shake 0.3s" : undefined
      }}>

        {/* TOP */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "12px", fontWeight: "600" }}>
            🎯 {totalLevels - level} to Spin
          </span>
        </div>

        {/* PROGRESS */}
        <div style={{
          height: "6px",
          background: "#e5e7eb",
          borderRadius: "10px",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: "#6366f1",
            transition: "0.3s"
          }} />
        </div>

        {/* GRID */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 42px)",
          gap: "6px",
          justifyContent: "center"
        }}>
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isInput = cell === ""

              return isInput ? (
                <input
                  key={`${r}-${c}`}
                  value={grid[r][c]}
                  onChange={(e) => handleChange(r, c, e.target.value)}
                  style={{
                    ...boxStyle,
                    border:
                      status === "wrong"
                        ? "1px solid #ef4444"
                        : "1px solid #cbd5f5",
                    outline: "none",
                    textAlign: "center",
                    animation: status === "correct" ? "glow 0.4s" : undefined
                  }}
                />
              ) : (
                <div key={`${r}-${c}`} style={{
                  ...boxStyle,
                  background: "#f1f5f9"
                }}>
                  {cell}
                </div>
              )
            })
          )}
        </div>

        {/* ANSWER REVEAL */}
        {showAnswer && (
          <div style={{
            fontSize: "11px",
            color: "#ef4444",
            textAlign: "right"
          }}>
            Answer: {puzzle.answer.topRight}, {puzzle.answer.bottomLeft}
          </div>
        )}

        {/* ACTION */}
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "10px"
        }}>
          <span style={{
            fontSize: "12px",
            color:
              status === "correct"
                ? "#16a34a"
                : status === "wrong"
                ? "#dc2626"
                : "#999"
          }}>
            {status === "correct" && "✔ Nice!"}
            {status === "wrong" && "✖ Try"}
          </span>

          <button
            onClick={handleCheck}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              background: "#6366f1",
              color: "white",
              border: "none",
              fontWeight: "700",
              fontSize: "13px",
              cursor: "pointer",
              transition: "0.1s"
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Check →
          </button>
        </div>

      </div>
    </>
  )
}