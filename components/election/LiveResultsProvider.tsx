"use client"

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from "react"

type LiveContextType = {
  results: any[]
  updated: string
}

const LiveContext = createContext<LiveContextType>({
  results: [],
  updated: ""
})

export function LiveResultsProvider({ children }: { children: React.ReactNode }) {

  const [results, setResults] = useState<any[]>([])
  const [updated, setUpdated] = useState<string>("")

  const isMounted = useRef(true)
  const loadingRef = useRef(false)

  //////////////////////////////////////////////////////
  // LOAD RESULTS (SAFE)
  //////////////////////////////////////////////////////

  const load = async () => {

    // prevent overlapping calls
    if (loadingRef.current) return
    loadingRef.current = true

    try {

      const res = await fetch("/api/elections/live", {
        cache: "no-store"
      })

      if (!res.ok) return

      const data = await res.json()

      // prevent state update after unmount
      if (!isMounted.current) return

      setResults(data?.results || [])
      setUpdated(data?.updatedAt || "")

    } catch (err) {
      console.warn("Live fetch failed")
    } finally {
      loadingRef.current = false
    }

  }

  //////////////////////////////////////////////////////
  // AUTO REFRESH (SMART)
  //////////////////////////////////////////////////////

  useEffect(() => {

    isMounted.current = true

    load()

    const timer = setInterval(load, 5000)

    return () => {
      isMounted.current = false
      clearInterval(timer)
    }

  }, [])

  //////////////////////////////////////////////////////
  // CONTEXT VALUE
  //////////////////////////////////////////////////////

  return (

    <LiveContext.Provider value={{ results, updated }}>
      {children}
    </LiveContext.Provider>

  )
}

//////////////////////////////////////////////////////
// HOOK (SAFE)
//////////////////////////////////////////////////////

export function useLiveResults() {

  const context = useContext(LiveContext)

  if (!context) {
    throw new Error("useLiveResults must be used within LiveResultsProvider")
  }

  return context
}