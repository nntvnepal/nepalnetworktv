"use client"

import { useMemo, useState } from "react"
import NepaliDate from "nepali-date-converter"

// ---------------- TYPES ----------------

type Language = "np" | "en"

type Festival = {
  nameNP: string
  nameEN: string
  type: "holiday" | "festival" | "event"
}

type DayData = {
  bsDate: string
  day: number
  isToday: boolean
  isCurrentMonth: boolean
  isSunday: boolean
  festivals?: Festival[]
}

// ---------------- FESTIVAL DATA ----------------

const festivalMap: Record<string, Festival[]> = {
  "2082-01-01": [
    { nameNP: "नयाँ वर्ष", nameEN: "Nepali New Year", type: "holiday" },
  ],
  "2082-01-11": [
    { nameNP: "राम नवमी", nameEN: "Ram Navami", type: "festival" },
  ],
  "2082-01-18": [
    { nameNP: "लोकतन्त्र दिवस", nameEN: "Democracy Day", type: "event" },
  ],
}

// ---------------- HELPERS ----------------

function formatBS(date: NepaliDate) {
  const y = date.getYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function getTodayBS() {
  return formatBS(new NepaliDate())
}

// SAFE month days calculation
function getMonthDays(year: number, month: number): number {
  let temp = new NepaliDate(year, month, 1)
  let count = 0

  while (temp.getMonth() === month && count < 35) {
    count++
    temp.setDate(temp.getDate() + 1)
  }

  return count
}

// ---------------- MAIN GENERATOR ----------------

function generateMonth(year: number, month: number): DayData[] {
  const firstDay = new NepaliDate(year, month, 1)
  const startDay = firstDay.getDay()

  const days: DayData[] = []
  const todayBS = getTodayBS()

  const totalDays = getMonthDays(year, month)

  // Padding
  for (let i = 0; i < startDay; i++) {
    days.push({
      bsDate: "",
      day: 0,
      isToday: false,
      isCurrentMonth: false,
      isSunday: false,
    })
  }

  // Actual days
  for (let d = 1; d <= totalDays; d++) {
    const date = new NepaliDate(year, month, d)
    const bs = formatBS(date)

    days.push({
      bsDate: bs,
      day: d,
      isToday: bs === todayBS,
      isCurrentMonth: true,
      isSunday: date.getDay() === 0,
      festivals: festivalMap[bs] || [],
    })
  }

  return days
}

// ---------------- COMPONENT ----------------

export default function Calendar() {
  const today = new NepaliDate()

  const [year, setYear] = useState(today.getYear())
  const [month, setMonth] = useState(today.getMonth())
  const [lang, setLang] = useState<Language>("np")

  const days = useMemo(() => {
    return generateMonth(year, month)
  }, [year, month])

  function nextMonth() {
    if (month === 11) {
      setMonth(0)
      setYear(prev => prev + 1)
    } else {
      setMonth(prev => prev + 1)
    }
  }

  function prevMonth() {
    if (month === 0) {
      setMonth(11)
      setYear(prev => prev - 1)
    } else {
      setMonth(prev => prev - 1)
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-2 py-1 border rounded">←</button>

        <div className="font-bold text-lg">
          {year} / {month + 1}
        </div>

        <button onClick={nextMonth} className="px-2 py-1 border rounded">→</button>
      </div>

      {/* LANGUAGE TOGGLE */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setLang(lang === "np" ? "en" : "np")}
          className="text-xs border px-2 py-1 rounded"
        >
          {lang === "np" ? "EN" : "NP"}
        </button>
      </div>

      {/* WEEK LABELS */}
      <div className="grid grid-cols-7 text-xs mb-1 text-center font-semibold">
        <div className="text-red-500">Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => {
          if (!day.isCurrentMonth) {
            return <div key={i} className="h-20" />
          }

          const hasHoliday = day.festivals?.some(f => f.type === "holiday")

          let bg = "bg-white"

          if (day.isToday) bg = "bg-blue-500 text-white"
          else if (hasHoliday) bg = "bg-red-200"
          else if (day.isSunday) bg = "bg-red-100"

          return (
            <div
              key={i}
              className={`h-20 p-1 rounded-lg border ${bg}`}
            >
              <div className="text-sm font-bold">{day.day}</div>

              <div className="text-[10px] mt-1 space-y-0.5">
                {day.festivals?.map((f, idx) => (
                  <div key={idx} className="truncate">
                    {lang === "np" ? f.nameNP : f.nameEN}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}