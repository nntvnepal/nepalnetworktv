"use client"

import { createContext, useContext } from "react"

type LegalLangContextType = {
  lang: "en" | "np"
  setLang: (lang: "en" | "np") => void
}

export const LegalLangContext =
  createContext<LegalLangContextType | null>(null)

export function useLegalLang() {
  const context = useContext(LegalLangContext)

  if (!context) {
    throw new Error("useLegalLang must be used within LegalLayout")
  }

  return context
}