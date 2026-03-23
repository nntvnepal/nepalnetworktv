"use client"

export default function ClassSelector({
  onSelect
}: {
  onSelect: (level: string) => void
}) {
  const levels = [
    { name: "Class 1-3", value: "1-3", emoji: "🧒" },
    { name: "Class 4-6", value: "4-6", emoji: "👦" },
    { name: "Class 7-10", value: "7-10", emoji: "🧠" }
  ]

  return (
    <div
      style={{
        maxWidth: "720px",
        margin: "40px auto",
        textAlign: "center"
      }}
    >
      <h2>🎓 Choose Your Level</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "18px",
          marginTop: "20px"
        }}
      >
        {levels.map((lvl) => (
          <div
            key={lvl.value}
            onClick={() => onSelect(lvl.value)}
            style={{
              padding: "20px",
              borderRadius: "16px",
              cursor: "pointer",
              background: "white",
              boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
              transition: "0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)"
            }}
          >
            <div style={{ fontSize: "28px" }}>{lvl.emoji}</div>
            <div style={{ marginTop: "10px", fontWeight: "600" }}>
              {lvl.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}