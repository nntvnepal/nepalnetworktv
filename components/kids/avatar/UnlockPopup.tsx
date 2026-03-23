"use client"

export default function UnlockPopup({
  open,
  onClose,
  onUnlock
}: {
  open: boolean
  onClose: () => void
  onUnlock: () => void
}) {
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
        zIndex: 10000
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: "400px",
          padding: "22px",
          borderRadius: "18px",
          background: "white",
          textAlign: "center",
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)"
        }}
      >
        <h2>🔒 Locked Character</h2>

        <p style={{ fontSize: "14px", margin: "10px 0" }}>
          🎁 Unlock 100+ avatars  
          <br />
          💾 Save your progress
        </p>

        {/* BUTTONS */}
        <div style={{ marginTop: "14px" }}>
          <button
            onClick={onUnlock}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: "#22c55e",
              color: "white",
              fontWeight: "700",
              marginBottom: "10px"
            }}
          >
            🚀 Unlock Now
          </button>

          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: "#e5e7eb"
            }}
          >
            Continue Playing
          </button>
        </div>
      </div>
    </div>
  )
}