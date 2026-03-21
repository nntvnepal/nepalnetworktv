"use client"

import { useState } from "react"
import ToolsCard from "./ToolsCard"
import {
  convertPreetiToUnicode,
  convertUnicodeToPreeti,
} from "./preetiMap"
import { convertRomanToNepali } from "./romanMap"

export default function UnicodePreetiConverter() {

  const [preeti, setPreeti] = useState("")
  const [unicode, setUnicode] = useState("")

  //////////////////////////////////////////////////////
  // DETECT INPUT TYPE
  //////////////////////////////////////////////////////

  function isRoman(text: string) {
    return /^[a-zA-Z\s]+$/.test(text)
  }

  //////////////////////////////////////////////////////
  // HANDLERS (SMART ENGINE)
  //////////////////////////////////////////////////////

  function handlePreetiChange(value: string) {
    setPreeti(value)

    // 🔥 AUTO DETECT
    if (isRoman(value)) {
      setUnicode(convertRomanToNepali(value))
    } else {
      setUnicode(convertPreetiToUnicode(value))
    }
  }

  function handleUnicodeChange(value: string) {
    setUnicode(value)
    setPreeti(convertUnicodeToPreeti(value))
  }

  function handleClear() {
    setPreeti("")
    setUnicode("")
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <ToolsCard title="Preeti / Roman ↔ Unicode Converter">

      <div className="space-y-4">

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-4">

          {/* INPUT */}
          <div>
            <p className="text-sm text-purple-300 mb-2">
              Preeti / Roman Input
            </p>

            <textarea
              value={preeti}
              onChange={(e) => handlePreetiChange(e.target.value)}
              placeholder="Type Preeti or Roman (e.g. nepali)..."
              className="w-full h-40 p-3 rounded-lg bg-black/60 border border-purple-500/20 text-white outline-none"
            />
          </div>

          {/* OUTPUT */}
          <div>
            <p className="text-sm text-green-400 mb-2">
              Unicode Output
            </p>

            <textarea
              value={unicode}
              onChange={(e) => handleUnicodeChange(e.target.value)}
              placeholder="Unicode will appear here..."
              className="w-full h-40 p-3 rounded-lg bg-black/80 border border-purple-500/20 text-green-400 outline-none"
            />
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm"
          >
            Clear
          </button>
        </div>

      </div>

    </ToolsCard>
  )
}