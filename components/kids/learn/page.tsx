"use client"

import KidsPageLayout from "@/components/kids/KidsPageLayout"

export default function LearnPage() {
  return (
    <KidsPageLayout
      title="📚 Learn"
      subtitle="Simple lessons made fun!"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px"
        }}
      >
        {["Math", "Science", "English"].map((item) => (
          <div
            key={item}
            style={{
              padding: "20px",
              borderRadius: "16px",
              background: "#e0f2fe",
              textAlign: "center",
              fontWeight: "600"
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </KidsPageLayout>
  )
}