"use client"

import KidsPageLayout from "@/components/kids/KidsPageLayout"

export default function PracticePage() {
  return (
    <KidsPageLayout
      title="🧠 Practice Zone"
      subtitle="Test your knowledge with fun questions!"
    >
      <div
        style={{
          padding: "20px",
          borderRadius: "20px",
          background: "#fef9c3"
        }}
      >
        <p style={{ fontSize: "14px" }}>
          🚧 Practice system coming next...
        </p>
      </div>
    </KidsPageLayout>
  )
}