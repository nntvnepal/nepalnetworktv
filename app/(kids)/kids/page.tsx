"use client"

import Hero from "@/components/kids/Hero"
import MenuGrid from "@/components/kids/MenuGrid"
import Features from "@/components/kids/Features"
import NepaliCalendarWidget from "@/components/common/NepaliCalendarWidget"

export default function KidsHome() {
  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "24px 20px"
      }}
    >
      {/* 🔥 MAIN SECTION */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          alignItems: "stretch"
        }}
      >
        {/* 🟢 LEFT MENU */}
        <div
          style={{
            width: "220px",
            flexShrink: 0
          }}
        >
          <MenuGrid />
        </div>

        {/* 🔵 RIGHT CONTENT (HERO + CALENDAR) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            gap: "20px"
          }}
        >
          {/* HERO */}
          <div
            style={{
              flex: 1,
              borderRadius: "20px",
              overflow: "hidden"
            }}
          >
            <Hero />
          </div>

          {/* CALENDAR */}
          <div
            style={{
              width: "280px",
              flexShrink: 0
            }}
          >
            <NepaliCalendarWidget />
          </div>
        </div>
      </div>

      {/* 🔻 FEATURES SECTION */}
      <div
        style={{
          marginTop: "50px",
          padding: "20px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(6px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
        }}
      >
        <Features />
      </div>
    </div>
  )
}