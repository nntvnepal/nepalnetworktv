"use client"

import { useState } from "react"

export default function KidRegisterPopup({
  open,
  onClose,
  onContinue
}: {
  open: boolean
  onClose: () => void
  onContinue: (name: string) => void
}) {
  const [name, setName] = useState("")

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: "400px",
          background: "white",
          borderRadius: "16px",
          padding: "20px",
          textAlign: "center"
        }}
      >
        <h2>👋 Welcome!</h2>

        <p style={{ fontSize: "14px", marginBottom: "10px" }}>
          Choose your hero name 🚀
        </p>

        <input
          placeholder="e.g. Math Ninja"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            border: "2px solid #ddd",
            marginBottom: "14px"
          }}
        />

        <button
          onClick={() => {
            if (!name) return
            onContinue(name)
            onClose()
          }}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            background: "#22c55e",
            color: "white",
            fontWeight: "700"
          }}
        >
          🚀 Start Learning
        </button>
      </div>
    </div>
  )
}