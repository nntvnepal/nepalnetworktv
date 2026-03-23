"use client"

import { useRouter, usePathname } from "next/navigation"
import {
  BookOpen,
  Pencil,
  Gamepad2,
  Book,
  Music,
  Landmark,
  Trophy
} from "lucide-react"

export default function MenuGrid() {
  const router = useRouter()
  const pathname = usePathname()

  const items = [
    { name: "Learn", color: "#3b82f6", path: "/kids/learn", icon: BookOpen },
    { name: "Practice", color: "#10b981", path: "/kids/practice", icon: Pencil },
    { name: "Games", color: "#f43f5e", path: "/kids/games", icon: Gamepad2 },
    { name: "Stories", color: "#f59e0b", path: "/kids/stories", icon: Book },
    { name: "Rhymes", color: "#8b5cf6", path: "/kids/rhymes", icon: Music },
    { name: "History", color: "#06b6d4", path: "/kids/history", icon: Landmark },
    { name: "Rewards", color: "#ef4444", path: "/kids/rewards", icon: Trophy }
  ]

  return (
    <>
      {/* 🔥 KEYFRAME (kids breathing animation) */}
      <style>
        {`
          @keyframes pulseSoft {
            0% { transform: scale(1); }
            50% { transform: scale(1.08); }
            100% { transform: scale(1); }
          }
        `}
      </style>

      <div
        style={{
          padding: "14px",
          borderRadius: "22px",
          backdropFilter: "blur(18px)",
          background: "rgba(255,255,255,0.35)",
          boxShadow: "0 12px 28px rgba(0,0,0,0.08)"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {items.map((item, i) => {
            const isActive = pathname === item.path
            const Icon = item.icon

            return (
              <div
                key={i}
                onClick={() => router.push(item.path)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",

                  background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,

                  borderRadius: "18px",
                  padding: "16px 18px",
                  color: "white",
                  cursor: "pointer",

                  fontWeight: "800",
                  fontSize: "16px",
                  letterSpacing: "0.4px",

                  transform: isActive ? "scale(1.05)" : "scale(1)",

                  boxShadow: isActive
                    ? `0 0 0 2px rgba(255,255,255,0.6),
                       0 12px 28px ${item.color}66`
                    : "0 6px 14px rgba(0,0,0,0.08)",

                  transition: "all 0.25s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${item.color}, ${item.color})`
                  e.currentTarget.style.transform = "translateX(6px) scale(1.05)"
                  e.currentTarget.style.boxShadow =
                    "0 14px 30px rgba(0,0,0,0.15)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${item.color}, ${item.color}dd)`
                  e.currentTarget.style.transform = isActive
                    ? "scale(1.05)"
                    : "scale(1)"
                  e.currentTarget.style.boxShadow = isActive
                    ? `0 0 0 2px rgba(255,255,255,0.6),
                       0 12px 28px ${item.color}66`
                    : "0 6px 14px rgba(0,0,0,0.08)"
                }}
              >
                {/* 🎯 BIG ICON + MOTION */}
                <div
                  style={{
                    animation: "pulseSoft 2.5s ease-in-out infinite"
                  }}
                >
                  <Icon size={28} strokeWidth={2.8} />
                </div>

                {/* TEXT */}
                <span>{item.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}