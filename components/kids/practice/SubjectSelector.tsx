"use client"

export default function SubjectSelector({
  onSelect
}: {
  onSelect: (subject: string) => void
}) {
  const subjects = [
    { name: "Math", emoji: "➕" },
    { name: "GK", emoji: "🌍" },
    { name: "Science", emoji: "🔬" },
    { name: "English", emoji: "📖" },
    { name: "Logic", emoji: "🧠" }
  ]

  return (
    <div
      style={{
        maxWidth: "720px",
        margin: "40px auto",
        textAlign: "center"
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>
        🎯 Choose Your Subject
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "16px"
        }}
      >
        {subjects.map((sub) => (
          <div
            key={sub.name}
            onClick={() => onSelect(sub.name.toLowerCase())}
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
            <div style={{ fontSize: "28px" }}>{sub.emoji}</div>
            <div style={{ marginTop: "8px", fontWeight: "600" }}>
              {sub.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}