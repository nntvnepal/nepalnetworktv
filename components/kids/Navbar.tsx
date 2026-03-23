"use client"

import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import { useEffect, useState } from "react"
import { getRandomAvatar } from "@/lib/avatars"
import AvatarSelector from "@/components/kids/AvatarSelector"

export default function Navbar() {
  const router = useRouter()
  const path = usePathname()

  const [mounted, setMounted] = useState(false)

  const [avatar, setAvatar] = useState<string | null>(null)

  const [user, setUser] = useState<{
    name: string
    avatar: string
    email?: string
  } | null>(null)

  const [panelOpen, setPanelOpen] = useState(false)
  const [tempUser, setTempUser] = useState<{
    name: string
    avatar: string
  } | null>(null)

  // 🔥 LOAD USER (FINAL FIX)
  useEffect(() => {
    setMounted(true)

    const storedUser = localStorage.getItem("kids_user")

    if (storedUser) {
      const parsed = JSON.parse(storedUser)

      setUser(parsed)
      setAvatar(parsed.avatar) // 💥 important
    } else {
      setAvatar(getRandomAvatar())
    }
  }, [])

  // 🔥 LOCK SCROLL
  useEffect(() => {
    document.body.style.overflow = panelOpen ? "hidden" : "auto"
  }, [panelOpen])

  if (!mounted) return null

  const menu = [
    { name: "Home", path: "/kids", icon: "🏠" },
    { name: "Learn", path: "/kids/learn", icon: "📚" },
    { name: "Practice", path: "/kids/practice", icon: "🧠" },
    { name: "Games", path: "/kids/games", icon: "🎮" },
  ]

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 1000 }}>
      {/* 🎨 ANIMATION */}
      <style>{`
        @keyframes floaty {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
          100% { transform: translateY(0px); }
        }
        .menuItem {
          animation: floaty 3s ease-in-out infinite;
        }
      `}</style>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 30px",
          minHeight: "78px",
          background: "linear-gradient(135deg, #0376ac, #1bb854, #028a7a)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
        }}
      >
        {/* 🎮 LEFT MENU */}
        <div style={{ display: "flex", gap: "14px" }}>
          {menu.map((item) => {
            const active = path === item.path

            return (
              <div
                key={item.name}
                className="menuItem"
                onClick={() => router.push(item.path)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "18px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                  background: active
                    ? "white"
                    : "rgba(255,255,255,0.2)",
                  color: active ? "#222" : "white",
                  transition: "0.2s"
                }}
              >
                {item.icon} {item.name}
              </div>
            )
          })}
        </div>

        {/* 🧒 CENTER LOGO */}
        <div
          onClick={() => router.push("/kids")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer"
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "white",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
            }}
          >
            <Image src="/nntvkids.png" alt="logo" width={50} height={50} />
          </div>

          <div style={{ color: "white" }}>
            <div style={{ fontWeight: "800", fontSize: "18px" }}>
              NNTV Kids
            </div>
            <div style={{ fontSize: "13px", opacity: 0.9 }}>
              Learn • Play • Grow
            </div>
          </div>
        </div>

        {/* 👤 RIGHT SIDE */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          
          {/* AVATAR */}
          <div
            onClick={() => setPanelOpen(true)}
            style={{
              width: "58px",
              height: "58px",
              borderRadius: "50%",
              overflow: "hidden",
              cursor: "pointer",

              background: "linear-gradient(145deg, #60a5fa, #1d4ed8)",

              boxShadow: `
                inset 0 6px 10px rgba(255,255,255,0.35),
                inset 0 -8px 14px rgba(0,0,0,0.35),
                0 6px 16px rgba(0,0,0,0.3),
                0 0 10px rgba(96,165,250,0.6)
              `,

              transition: "all 0.25s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)"
            }}
          >
            <img
              src={
                user?.avatar ||
                tempUser?.avatar ||
                avatar ||
                "/avatars/avatar1.png"
              }
              alt="avatar"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
          </div>

          {/* NAME */}
          <span style={{ color: "white", fontWeight: "600" }}>
            {user?.name || tempUser?.name || "👋 Guest"}
          </span>
        </div>
      </div>

      {/* 🎭 AVATAR MODAL */}
      <AvatarSelector
  open={panelOpen}
  onClose={() => setPanelOpen(false)}
  onSelect={(data) => {
    setTempUser({
      name: user?.name || "Guest",
      avatar: data.avatar,
    })
  }}
/>
    </div>
  )
}