"use client"

const subjects = [
  { name: "Math", emoji: "➕" },
  { name: "English", emoji: "📖" },
  { name: "Science", emoji: "🔬" },
  { name: "GK", emoji: "🌍" },
]

export default function Subjects() {
  return (
    <div style={{ padding: "50px 20px", textAlign: "center" }}>
      <h2>Choose Subject</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "20px",
        marginTop: "30px"
      }}>
        {subjects.map((sub, i) => (
          <div key={i} style={{
            background: "white",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            cursor: "pointer"
          }}>
            <div style={{ fontSize: "40px" }}>{sub.emoji}</div>
            <h3>{sub.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}