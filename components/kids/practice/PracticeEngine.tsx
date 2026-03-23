"use client"

import { useEffect, useState } from "react"
import type { CSSProperties } from "react"
import { generateLevelQuestions } from "@/lib/generateQuestions"
import Teacher from "@/components/kids/Teacher"
import {
  saveProgress,
  getProgress,
  clearProgress
} from "@/lib/progress"

export default function PracticeEngine({
  subject,
  level
}: {
  subject: string
  level: string
}) {
  const [questions, setQuestions] = useState<any[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [streak, setStreak] = useState(0)
  const [finished, setFinished] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [hasSaved, setHasSaved] = useState(false)

  // 🔄 LOAD QUESTIONS
  useEffect(() => {
    const q = generateLevelQuestions(subject, level, 5)
    setQuestions(q)
  }, [subject, level])

  // 🔄 LOAD PROGRESS
  useEffect(() => {
    const saved = getProgress()

    if (saved && saved.subject === subject) {
      setIndex(saved.index || 0)
      setScore(saved.score || 0)
      setStreak(saved.streak || 0)
      setCurrentLevel(saved.level || 1)
      setHasSaved(true)
    }
  }, [subject])

  const current = questions[index]
  const isCorrect = selected === current?.answer
  const explanation = current?.explanation

  const progress = questions.length
    ? ((index + 1) / questions.length) * 100
    : 0

  const handleSelect = (opt: string) => {
    if (selected) return

    setSelected(opt)
    setShowResult(true)

    if (opt === current.answer) {
      const newStreak = streak + 1
      setStreak(newStreak)

      const bonus = newStreak >= 3 ? 5 : 0

      setScore((prev) => {
        const newScore = prev + 10 + bonus
        localStorage.setItem("total_points", String(newScore))
        return newScore
      })
    } else {
      setStreak(0)
    }
  }

  const next = () => {
    const newIndex = index + 1

    saveProgress({
      subject,
      level: currentLevel,
      index: newIndex,
      score,
      streak
    })

    setSelected(null)
    setShowResult(false)

    if (index < questions.length - 1) {
      setIndex(newIndex)
    } else {
      setScore((prev) => prev + 20)
      setFinished(true)
    }
  }

  const nextLevel = () => {
    const nextLvl = currentLevel + 1

    saveProgress({
      subject,
      level: nextLvl,
      index: 0,
      score: 0,
      streak: 0
    })

    setCurrentLevel(nextLvl)
    setIndex(0)
    setScore(0)
    setStreak(0)
    setFinished(false)

    const q = generateLevelQuestions(subject, level, 5)
    setQuestions(q)
  }

  if (!questions.length) return null

  // 🎉 COMPLETE SCREEN
  if (finished) {
    return (
      <div style={container}>
        <h2 style={title}>🎉 Level Complete!</h2>

        <div style={{ fontSize: "40px" }}>🎉 🎊 ✨</div>

        <p style={text}>⭐ Score: {score}</p>

        <div style={{ marginTop: "10px", fontSize: "20px" }}>
          🏆 Star Badge Earned!
        </div>

        <div style={{ color: "#4ade80", marginTop: "6px" }}>
          🎁 Bonus +20 points
        </div>

        <button onClick={nextLevel} style={button}>
          🚀 Next Level
        </button>

        <button
          onClick={() => {
            clearProgress()
            location.reload()
          }}
          style={resetBtn}
        >
          🔁 Reset Progress
        </button>
      </div>
    )
  }

  return (
    <div style={container}>
      {hasSaved && (
        <div style={{ marginBottom: "10px", color: "#facc15" }}>
          🔄 Resuming your progress...
        </div>
      )}

      {/* TOP */}
      <div style={{ marginBottom: "14px" }}>
        <div style={topRow}>
          <span>Level {currentLevel}</span>
          <span>Q {index + 1} / {questions.length}</span>
          <span>🔥 {streak}</span>
        </div>

        <div style={progressBar}>
          <div style={{ width: `${progress}%`, height: "100%", background: "#4ade80" }} />
        </div>
      </div>

      {/* QUESTION */}
      <h3 style={question}>✍️ {current.q}</h3>

      {/* OPTIONS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {current.options.map((opt: string) => {
          const isSelectedOpt = selected === opt
          const isCorrectOpt = opt === current.answer

          let bg = "transparent"
          let color = "#fefce8"

          if (showResult) {
            if (isCorrectOpt) {
              bg = "rgba(74,222,128,0.2)"
              color = "#4ade80"
            } else if (isSelectedOpt) {
              bg = "rgba(248,113,113,0.2)"
              color = "#f87171"
            }
          }

          return (
            <div
              key={opt}
              onClick={() => handleSelect(opt)}
              style={{
                padding: "12px",
                cursor: selected ? "default" : "pointer",
                fontSize: "22px",
                borderRadius: "8px",
                background: bg,
                color
              }}
            >
              • {opt}
            </div>
          )
        })}
      </div>

      {/* RESULT */}
      {showResult && (
        <div style={{ marginTop: "20px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div
            style={{
              flex: 1,
              minWidth: "240px",
              padding: "14px",
              borderRadius: "12px",
              background: isCorrect
                ? "rgba(74,222,128,0.1)"
                : "rgba(248,113,113,0.1)"
            }}
          >
            <div style={{ fontSize: "22px" }}>
              {isCorrect ? "🎉 Correct!" : "😢 Not quite!"}
            </div>

            <div style={{ marginTop: "6px" }}>
              💡 {explanation}
            </div>
          </div>

          <Teacher isCorrect={isCorrect} explanation={explanation} />
        </div>
      )}

      {showResult && (
        <button onClick={next} style={button}>
          Next →
        </button>
      )}

      <div style={scoreText}>⭐ Points: {score}</div>

      <button
        onClick={() => {
          clearProgress()
          location.reload()
        }}
        style={resetBtn}
      >
        🔁 Reset Progress
      </button>
    </div>
  )
}

/* ✅ FIXED TYPES */

const container: CSSProperties = {
  maxWidth: "720px",
  margin: "40px auto",
  padding: "32px",
  borderRadius: "22px",
  background: "linear-gradient(145deg, #1e3a2f, #173328)",
  color: "#fefce8",
  border: "10px solid #8b5e3c"
}

const title: CSSProperties = { fontSize: "28px", textAlign: "center" }
const text: CSSProperties = { textAlign: "center", fontSize: "20px" }
const question: CSSProperties = { fontSize: "28px", marginBottom: "20px" }

const button: CSSProperties = {
  marginTop: "18px",
  padding: "12px 20px",
  background: "#facc15",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer"
}

const resetBtn: CSSProperties = {
  marginTop: "10px",
  padding: "8px 12px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
}

const scoreText: CSSProperties = { marginTop: "16px", fontSize: "20px" }

const topRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between"
}

const progressBar: CSSProperties = {
  height: "10px",
  background: "rgba(255,255,255,0.2)",
  marginTop: "6px",
  borderRadius: "8px",
  overflow: "hidden"
}