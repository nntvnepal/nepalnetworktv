// @ts-nocheck
"use client"

import dynamic from "next/dynamic"
import { useEffect, useState, useRef } from "react"
import "leaflet/dist/leaflet.css"

//////////////////////////////////////////////////////
// DYNAMIC IMPORT
//////////////////////////////////////////////////////

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
)

const GeoJSON = dynamic(
  () => import("react-leaflet").then((m) => m.GeoJSON),
  { ssr: false }
)

//////////////////////////////////////////////////////
// TYPES
//////////////////////////////////////////////////////

type DistrictResult = {
  party?: string
  candidate?: string
  votes?: number
  color?: string
}

type MapResults = {
  districtResults?: Record<string, DistrictResult>
  partySeats?: Record<string, number>
}

//////////////////////////////////////////////////////
// HELPERS
//////////////////////////////////////////////////////

function normalize(name: string = "") {
  return name
    .toLowerCase()
    .replace(/district/g, "")
    .replace(/\s/g, "")
    .trim()
}

function findDistrictResult(
  district: string,
  results?: Record<string, DistrictResult>
): DistrictResult | null {
  if (!district || !results) return null

  const key = normalize(district)

  const matchKey = Object.keys(results).find(k => {
    const r = normalize(k)
    return r.includes(key) || key.includes(r)
  })

  return matchKey ? results[matchKey] : null
}

//////////////////////////////////////////////////////
// COMPONENT
//////////////////////////////////////////////////////

export default function NepalElectionMap() {

  const [geoData, setGeoData] = useState<any>(null)
  const [mapResults, setMapResults] = useState<MapResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false) // 🔥 CRITICAL FIX

  const geoRef = useRef<any>(null)

  //////////////////////////////////////////////////////
  // LOAD DATA
  //////////////////////////////////////////////////////

  useEffect(() => {
    setMounted(true) // 🔥 ensures client render only

    async function load() {
      try {
        const [geoRes, resultRes] = await Promise.all([
          fetch("/maps/nepal-districts.geojson"),
          fetch("/api/elections/map-results")
        ])

        const geo = await geoRes.json()
        const result = resultRes.ok ? await resultRes.json() : null

        setGeoData(geo)
        setMapResults(result)

      } catch (err) {
        console.error("Map load error:", err)
      } finally {
        setLoading(false)
      }
    }

    load()

  }, [])

  //////////////////////////////////////////////////////
  // STATES
  //////////////////////////////////////////////////////

  if (!mounted) return null // 🔥 prevents SSR crash

  if (loading) {
    return (
      <div className="h-[650px] flex items-center justify-center text-white">
        Loading Map...
      </div>
    )
  }

  if (!geoData) {
    return (
      <div className="h-[650px] flex items-center justify-center text-red-400">
        Failed to load map
      </div>
    )
  }

  //////////////////////////////////////////////////////
  // STYLE
  //////////////////////////////////////////////////////

  function districtStyle(feature: any) {
    const district = feature?.properties?.DISTRICT || ""

    const result = findDistrictResult(
      district,
      mapResults?.districtResults
    )

    return {
      color: "#fff",
      weight: 1,
      fillColor: result?.color || "#374151",
      fillOpacity: 0.9
    }
  }

  //////////////////////////////////////////////////////
  // EVENTS
  //////////////////////////////////////////////////////

  function onEachDistrict(feature: any, layer: any) {

    const district = feature?.properties?.DISTRICT || "Unknown"

    const result = findDistrictResult(
      district,
      mapResults?.districtResults
    )

    layer.bindTooltip(
      `<div>
        <b>${district}</b><br/>
        ${result?.party || "Counting"}<br/>
        ${result?.candidate || "-"}<br/>
        Votes: ${(result?.votes || 0).toLocaleString()}
      </div>`,
      { sticky: true }
    )

    layer.on({
      mouseover: (e: any) => {
        e.target.setStyle({ weight: 2, fillOpacity: 1 })
      },
      mouseout: (e: any) => {
        geoRef.current?.resetStyle(e.target)
      }
    })
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <div className="w-full px-6 py-8">

      <div className="relative w-full h-[650px] rounded-xl overflow-hidden bg-[#1b0030]">

        {/* MAP */}

        <MapContainer
          center={[28.4, 84.1]}
          zoom={7}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >

          <GeoJSON
            ref={geoRef}
            data={geoData}
            style={districtStyle}
            onEachFeature={onEachDistrict}
          />

        </MapContainer>

      </div>

    </div>
  )
}