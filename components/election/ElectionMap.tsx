"use client"

import { useEffect, useRef, useState } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

export default function ElectionMap() {

  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const popupRef = useRef<maplibregl.Popup | null>(null)

  const [layer, setLayer] =
    useState<"province" | "district" | "municipality">("province")

  const [mapResults, setMapResults] = useState<any>(null)

  const [provinceGeo, setProvinceGeo] = useState<any>(null)
  const [districtGeo, setDistrictGeo] = useState<any>(null)
  const [municipalityGeo, setMunicipalityGeo] = useState<any>(null)

  //////////////////////////////////////////////////////
  // LOAD GEOJSON (SAFE)
  //////////////////////////////////////////////////////

  useEffect(() => {

    const load = async () => {
      try {
        const [p, d, m] = await Promise.all([
          fetch("/maps/province.geojson").then(r => r.json()),
          fetch("/maps/nepal-districts.geojson").then(r => r.json()),
          fetch("/maps/municipality.geojson").then(r => r.json())
        ])

        setProvinceGeo(p)
        setDistrictGeo(d)
        setMunicipalityGeo(m)

      } catch {
        console.warn("GeoJSON load failed")
      }
    }

    load()

  }, [])

  //////////////////////////////////////////////////////
  // LOAD RESULTS
  //////////////////////////////////////////////////////

  useEffect(() => {

    fetch("/api/map-results")
      .then(res => res.ok ? res.json() : null)
      .then(data => data && setMapResults(data))
      .catch(() => console.warn("Map API error"))

  }, [])

  //////////////////////////////////////////////////////
  // INIT MAP (ONLY ONCE)
  //////////////////////////////////////////////////////

  useEffect(() => {

    if (!mapContainer.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [84, 28],
      zoom: 6
    })

    mapRef.current = map

    map.addControl(new maplibregl.NavigationControl(), "top-right")

    popupRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false
    })

    map.on("load", () => {
      map.fitBounds([[80, 26], [89, 31]], { padding: 20 })
      setTimeout(() => map.resize(), 200)
    })

    return () => {
      map.remove()
      mapRef.current = null
    }

  }, [])

  //////////////////////////////////////////////////////
  // DRAW LAYER
  //////////////////////////////////////////////////////

  useEffect(() => {

    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return

    if (!provinceGeo || !districtGeo || !municipalityGeo) return

    const sourceId = "election-source"
    const layerId = "election-layer"

    // CLEAN OLD
    if (map.getLayer(layerId)) map.removeLayer(layerId)
    if (map.getSource(sourceId)) map.removeSource(sourceId)

    //////////////////////////////////////////////////////
    // SELECT DATA
    //////////////////////////////////////////////////////

    let geo: any
    let resultData: any = {}

    if (layer === "province") {
      geo = provinceGeo
      resultData = mapResults?.provinceResults || {}
    }

    if (layer === "district") {
      geo = districtGeo
      resultData = mapResults?.districtResults || {}
    }

    if (layer === "municipality") {
      geo = municipalityGeo
      resultData = mapResults?.municipalityResults || {}
    }

    //////////////////////////////////////////////////////
    // COLOR MAP (SAFE KEY MATCH)
    //////////////////////////////////////////////////////

    const normalize = (name: string = "") =>
      name.toLowerCase().replace(/province|pradesh|\s/g, "")

    const colored = {
      ...geo,
      features: geo.features.map((f: any) => {

        const name =
          f.properties.PR_NAME ||
          f.properties.DISTRICT ||
          f.properties.GaPa_NaPa ||
          f.properties.name ||
          f.properties.NAME ||
          ""

        const key = normalize(name)
        const result = resultData[key]

        return {
          ...f,
          properties: {
            ...f.properties,
            color: result?.color || "#e5e7eb",
            party: result?.party || ""
          }
        }

      })
    }

    //////////////////////////////////////////////////////
    // ADD SOURCE + LAYER
    //////////////////////////////////////////////////////

    map.addSource(sourceId, {
      type: "geojson",
      data: colored
    })

    map.addLayer({
      id: layerId,
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": ["get", "color"],
        "fill-opacity": 0.9,
        "fill-outline-color": "#fff"
      }
    })

    //////////////////////////////////////////////////////
    // TOOLTIP (CLEAN EVENTS)
    //////////////////////////////////////////////////////

    const handleMove = (e: any) => {

      const f = e.features?.[0]
      if (!f) return

      const name =
        f.properties.PR_NAME ||
        f.properties.DISTRICT ||
        f.properties.GaPa_NaPa ||
        "Area"

      const party = f.properties.party || "No Data"

      popupRef.current
        ?.setLngLat(e.lngLat)
        .setHTML(`<strong>${name}</strong><br/>${party}`)
        .addTo(map)

    }

    const handleLeave = () => popupRef.current?.remove()

    map.on("mousemove", layerId, handleMove)
    map.on("mouseleave", layerId, handleLeave)

    return () => {
      map.off("mousemove", layerId, handleMove)
      map.off("mouseleave", layerId, handleLeave)
    }

  }, [layer, mapResults, provinceGeo, districtGeo, municipalityGeo])

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (

    <div style={{ width: "100%", height: "600px", position: "relative" }}>

      <div style={{
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 10,
        background: "#ffffffcc",
        padding: "6px 10px",
        borderRadius: "6px"
      }}>

        <button onClick={() => setLayer("province")}>Province</button>{" "}
        <button onClick={() => setLayer("district")}>District</button>{" "}
        <button onClick={() => setLayer("municipality")}>Local</button>

      </div>

      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

    </div>

  )
}