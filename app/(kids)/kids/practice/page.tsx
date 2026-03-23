"use client"

import { useEffect, useState } from "react"
import KidsPageLayout from "@/components/kids/KidsPageLayout"
import PracticeEngine from "@/components/kids/practice/PracticeEngine"
import AvatarSelector from "@/components/kids/AvatarSelector"
import SubjectSelector from "@/components/kids/practice/SubjectSelector"
import ClassSelector from "@/components/kids/practice/ClassSelector"
import KidRegisterPopup from "@/components/kids/KidRegisterPopup"

import {
  Gamepad2,
  Coins,
  Target,
  Flame,
  User
} from "lucide-react"

export default function PracticePage() {
  const [avatar, setAvatar] = useState<string | null>(null)
  const [subject, setSubject] = useState<string | null>(null)
  const [level, setLevel] = useState<string | null>(null)

  const [name, setName] = useState<string | null>(null)
  const [showRegister, setShowRegister] = useState(true)

  const [points, setPoints] = useState<number>(0)
  const [unlockedAvatars, setUnlockedAvatars] = useState<string[]>([
    "/avatars/avatar1.png",
  ])

  // 🔹 Load data
  useEffect(() => {
    try {
      const data = localStorage.getItem("nntv_kids_game")

      if (data) {
        const parsed = JSON.parse(data)

        setAvatar(parsed.avatar || null)
        setPoints(parsed.points || 0)
        setUnlockedAvatars(parsed.unlockedAvatars || ["/avatars/avatar1.png"])
        setName(parsed.name || null)

        if (!parsed.name) setShowRegister(true)
      }
    } catch (err) {
      console.error("LocalStorage error:", err)
    }
  }, [])

  // 🔹 Save data
  useEffect(() => {
    localStorage.setItem(
      "nntv_kids_game",
      JSON.stringify({
        avatar,
        points,
        unlockedAvatars,
        name,
      })
    )
  }, [avatar, points, unlockedAvatars, name])

  return (
    <KidsPageLayout
      title="Practice"
      subtitle="Learn • Play • Grow 🚀"
    >

      {/* REGISTER */}
      <KidRegisterPopup
        open={showRegister}
        onClose={() => setShowRegister(false)}
        onContinue={(n) => {
          setName(n)
          setShowRegister(false)
        }}
      />

      <div className="flex gap-8">

        {/* 🟣 LEFT PANEL */}
        {avatar && (
          <div className="w-72 flex flex-col gap-5 sticky top-24 h-fit">

            {/* PLAYER CARD */}
            <div className="bg-white rounded-2xl p-5 shadow text-center">
              <img
                src={avatar}
                alt="avatar"
                className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-green-500"
              />

              <div className="flex items-center justify-center gap-2 mb-1">
                <User size={16} />
                <h3 className="font-bold text-lg">{name}</h3>
              </div>

              <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                <Coins size={14} /> {points} points
              </p>

              <button
                onClick={() => {
                  setAvatar(null)
                  setSubject(null)
                  setLevel(null)
                }}
                className="mt-3 text-xs bg-gray-200 px-3 py-1 rounded-lg"
              >
                Change Avatar
              </button>
            </div>

            {/* PROGRESS */}
            <div className="bg-white rounded-2xl p-4 shadow">
              <p className="text-sm mb-2 font-semibold flex items-center gap-2">
                <Target size={16} /> Progress
              </p>

              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-green-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min((points / 100) * 100, 100)}%`,
                  }}
                />
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Next reward at 100 pts
              </p>
            </div>

            {/* DAILY GOAL */}
            <div className="bg-yellow-100 rounded-2xl p-4 shadow">
              <p className="font-semibold mb-1 flex items-center gap-2">
                <Flame size={16} /> Daily Goal
              </p>

              <p className="text-sm">
                Solve 5 questions to earn bonus coins
              </p>
            </div>

          </div>
        )}

        {/* 🔵 CENTER PANEL */}
        <div className="flex-1">

          {/* HERO */}
          {!subject && (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-3xl p-6 shadow-xl mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Gamepad2 size={26} />
                <h2 className="text-3xl font-bold">
                  Practice Arena
                </h2>
              </div>

              <p className="text-sm opacity-90">
                Choose subject & start your journey
              </p>
            </div>
          )}

          {/* AVATAR SELECT (FIXED) */}
          {!avatar && name && (
            <AvatarSelector
              open={true}
              onClose={() => {}}
              name={name || undefined}
              onSelect={(data) => setAvatar(data.avatar)}
            />
          )}

          {/* SUBJECT */}
          {avatar && !subject && (
            <>
              <h3 className="font-bold mb-3">Choose Subject</h3>
              <SubjectSelector onSelect={setSubject} />
            </>
          )}

          {/* LEVEL */}
          {avatar && subject && !level && (
            <>
              <h3 className="font-bold mt-6 mb-3">Choose Level</h3>
              <ClassSelector onSelect={setLevel} />
            </>
          )}

          {/* ENGINE */}
          {avatar && subject && level && (
  <div className="mt-6">
    <PracticeEngine
      subject={subject}
      level={level}
    />
  </div>
)}
        
        </div>
      </div>
    </KidsPageLayout>
  )
}