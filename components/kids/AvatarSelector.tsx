"use client"

import { useState } from "react"
import { avatars } from "@/lib/avatars"
import UnlockPopup from "@/components/kids/avatar/UnlockPopup"
import EmailUnlock from "@/components/kids/avatar/EmailUnlock"

export default function AvatarSelector({
  open,
  onClose,
  onSelect,
  name
}: {
  open: boolean
  onClose: () => void
  onSelect: (data: { avatar: string }) => void
  name?: string
}) {
  const [index, setIndex] = useState(0)
  const [showUnlock, setShowUnlock] = useState(false)
  const [showEmail, setShowEmail] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)

  const unlockedCount = isUnlocked ? avatars.length : 5
  const currentAvatar = avatars[index]
  const isLocked = index >= unlockedCount

  const powers = [
    "Math Master",
    "Speed Learner",
    "Focus Boost",
    "Memory Power",
    "Quick Thinker",
    "Brain Explorer"
  ]

  const stars = index < 5 ? 1 : index < 15 ? 2 : 3

  if (!open) return null

  const handleSelect = () => {
    if (isLocked) {
      setShowUnlock(true)
      return
    }
    onSelect({ avatar: currentAvatar })
    onClose()
  }

  const next = () => {
    setIndex((prev) => (prev + 1) % avatars.length)
  }

  const prev = () => {
    setIndex((prev) =>
      prev === 0 ? avatars.length - 1 : prev - 1
    )
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          fontFamily: "'Fredoka', 'Poppins', sans-serif"
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "90%",
            maxWidth: "520px",
            padding: "20px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #fcd34d, #fca5a5)",
            boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
            textAlign: "center"
          }}
        >
          {/* HEADER */}
          <h2 style={{
            fontWeight: "700",
            fontSize: "24px",
            color: "#1f2937",
            textShadow: "0 1px 0 rgba(255,255,255,0.4)"
          }}>
            Choose Your Hero
          </h2>

          <p style={{
            fontSize: "13px",
            color: "#374151",
            marginBottom: "12px"
          }}>
            Fun learning experience for ages 1–15
          </p>

          {/* STARS */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "6px",
            marginBottom: "12px"
          }}>
            {Array.from({ length: stars }).map((_, i) => (
              <div key={i} style={{
                width: "18px",
                height: "18px",
                background: "#facc15",
                borderRadius: "4px"
              }} />
            ))}
          </div>

          {/* CARD */}
          <div
            style={{
              background: "linear-gradient(180deg, #ffffff, #f8fafc)",
              border: "3px solid #f59e0b",
              borderRadius: "18px",
              padding: "20px",
              position: "relative",
              boxShadow:
                "inset 0 0 20px rgba(0,0,0,0.08), 0 10px 0 #f59e0b"
            }}
          >
            <button
              onClick={prev}
              style={{
                position: "absolute",
                left: "-12px",
                top: "45%",
                background: "#fff",
                borderRadius: "50%",
                border: "2px solid #ddd",
                padding: "6px",
                cursor: "pointer"
              }}
            >
              ◀
            </button>

            <button
              onClick={next}
              style={{
                position: "absolute",
                right: "-12px",
                top: "45%",
                background: "#fff",
                borderRadius: "50%",
                border: "2px solid #ddd",
                padding: "6px",
                cursor: "pointer"
              }}
            >
              ▶
            </button>

            {/* NAME */}
            <div style={{
              fontWeight: "700",
              fontSize: "18px",
              color: "#1f2937",
              marginBottom: "10px"
            }}>
              {name || `Hero ${index + 1}`}
            </div>

            {/* AVATAR */}
            <div style={{
              display: "inline-block",
              background: "#ffffff",
              padding: "12px",
              borderRadius: "14px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
            }}>
              <img
                src={currentAvatar}
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto",
                  animation: "float 2.5s ease-in-out infinite"
                }}
              />
            </div>

            {/* POWER */}
            <p style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#374151",
              marginTop: "12px"
            }}>
              {powers[index % powers.length]}
            </p>

            {/* LOCK */}
            {isLocked && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.35)",
                  backdropFilter: "blur(2px)",
                  borderRadius: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "22px"
                }}
              >
                Locked
              </div>
            )}
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSelect}
            style={{
              marginTop: "16px",
              padding: "12px 28px",
              borderRadius: "14px",
              border: "none",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "white",
              fontWeight: "700",
              fontSize: "14px",
              boxShadow: "0 6px 0 #166534",
              cursor: "pointer"
            }}
          >
            Select
          </button>

          {/* THUMBNAILS */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              marginTop: "15px",
              scrollbarWidth: "none"
            }}
          >
            {avatars.map((a, i) => (
              <img
                key={a}
                src={a}
                onClick={() => setIndex(i)}
                style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "10px",
                  border:
                    i === index
                      ? "3px solid #22c55e"
                      : "2px solid #ddd",
                  opacity: i < unlockedCount ? 1 : 0.4,
                  cursor: "pointer"
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <UnlockPopup
        open={showUnlock}
        onClose={() => setShowUnlock(false)}
        onUnlock={() => {
          setShowUnlock(false)
          setShowEmail(true)
        }}
      />

      <EmailUnlock
        open={showEmail}
        onClose={() => setShowEmail(false)}
        onSuccess={() => setIsUnlocked(true)}
      />
    </>
  )
}