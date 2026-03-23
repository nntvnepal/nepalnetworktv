"use client"

import Navbar from "@/components/kids/Navbar"
import Footer from "@/components/kids/Footer"
import FloatingMascot from "@/components/kids/FloatingMascot"

export default function KidsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        margin: 0,

        fontFamily: "'Baloo 2', 'Poppins', sans-serif",
        lineHeight: 1.5,

        background: `
          radial-gradient(circle at top left, #fde68a 0%, transparent 55%),
          radial-gradient(circle at bottom right, #fca5a5 0%, transparent 55%),
          #fffaf5
        `,

        minHeight: "100vh",
      }}
    >
      <FloatingMascot />
      <Navbar />

      {/* ✅ FIXED CONTENT WRAPPER */}
      <div
        style={{
          width: "100%",
          padding: "24px 32px",
        }}
      >
        {children}
      </div>

      <Footer />
    </div>
  )
}