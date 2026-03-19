"use client"

import dynamic from "next/dynamic"
import { useEffect, useState, useRef } from "react"
import "leaflet/dist/leaflet.css"

//////////////////////////////////////////////////////
// DYNAMIC IMPORT (SSR SAFE)
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

  const geoRef = useRef<any>(null)

  //////////////////////////////////////////////////////
  // LOAD DATA
  //////////////////////////////////////////////////////

  useEffect(() => {

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
  // TOOLTIP + EVENTS
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
  // STATES
  //////////////////////////////////////////////////////

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
  // UI
  //////////////////////////////////////////////////////

  return (

    <div className="w-full px-6 py-8">

      <div className="relative w-full h-[650px] rounded-xl overflow-hidden bg-[#1b0030]">

        {/* LEGEND */}

        {mapResults?.partySeats && (

          <div className="absolute top-4 right-4 z-50 bg-white p-3 rounded shadow">

            <h3 className="font-bold mb-2 text-black">
              Party Seats
            </h3>

            {Object.entries(mapResults.partySeats).map(([party, count]) => {

              const districtList = Object.values(
                mapResults?.districtResults || {}
              ) as DistrictResult[]

              const match = districtList.find(d => d?.party === party)
              const color = match?.color || "#888"

              return (
                <div key={party} className="flex justify-between gap-4 mb-1">

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ background: color }} />
                    <span className="text-black text-sm">{party}</span>
                  </div>

                  <span className="font-bold text-black text-sm">
                    {Number(count)}
                  </span>

                </div>
              )
            })}
          </div>

        )}

        {/* MAP */}

        <MapContainer
          center={[28.4, 84.1] as any}   // 🔥 FIX
          zoom={7}
          scrollWheelZoom={false}
          dragging={false}
          zoomControl={false}
          attributionControl={false}
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