"use client"

import { useState, ReactNode } from "react"
import { LegalLangContext } from "./legalLangContext"

export default function LegalLayout({
  children,
}: {
  children: ReactNode
}) {
  const [lang, setLang] = useState<"en" | "np">("en")

  return (
    <LegalLangContext.Provider value={{ lang, setLang }}>
      <main className="max-w-3xl mx-auto px-6 py-20">

        {/* LANGUAGE SWITCH */}
        <div className="flex justify-end mb-10 text-sm gap-2">

          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1.5 rounded transition
            ${
              lang === "en"
                ? "bg-purple-700 text-white shadow"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            English
          </button>

          <span className="text-gray-400">|</span>

          <button
            onClick={() => setLang("np")}
            className={`px-3 py-1.5 rounded transition
            ${
              lang === "np"
                ? "bg-purple-700 text-white shadow"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            नेपाली
          </button>

        </div>

        {/* CONTENT */}
        <article className="prose prose-lg max-w-none">
          {children}
        </article>

      </main>
    </LegalLangContext.Provider>
  )
}