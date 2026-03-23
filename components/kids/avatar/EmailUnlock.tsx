"use client"

import { useState } from "react"

export default function EmailUnlock({
  open,
  onClose,
  onSuccess
}: {
  open: boolean
  onClose: () => void
  onSuccess: (email: string) => void
}) {
  const [email, setEmail] = useState("")

  if (!open) return null

  const handleSubmit = () => {
    if (!email.includes("@")) {
      alert("Enter valid email 😄")
      return
    }

    onSuccess(email)
    onClose()
  }

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
        zIndex: 11000
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: "420px",
          padding: "22px",
          borderRadius: "18px",
          background: "white",
          textAlign: "center"
        }}
      >
        <h2>🎁 Unlock All Characters</h2>

        <p style={{ fontSize: "14px", marginBottom: "14px" }}>
          Get 100+ avatars & save your progress!
        </p>

        <input
          placeholder="Enter your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            border: "2px solid #ddd",
            marginBottom: "14px"
          }}
        />

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            background: "#22c55e",
            color: "white",
            fontWeight: "700"
          }}
        >
          🚀 Unlock Now
        </button>
      </div>
    </div>
  )
}