import { useContext } from "react"
import { LegalLangContext } from "@/app/(legal)/layout"

export function useLegalLang() {
  const context = useContext(LegalLangContext)

  if (!context) {
    throw new Error("useLegalLang must be used within LegalLayout")
  }

  return context
}