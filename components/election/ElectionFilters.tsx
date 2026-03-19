"use client"

import { useEffect, useState } from "react"

type Option = {
  id: string
  name?: string
  number?: number
}

type Props = {
  electionType: string
}

export default function ElectionFilters({ electionType }: Props) {

  //////////////////////////////////////////////////////
  // STATE
  //////////////////////////////////////////////////////

  const [provinces, setProvinces] = useState<Option[]>([])
  const [districts, setDistricts] = useState<Option[]>([])
  const [municipalities, setMunicipalities] = useState<Option[]>([])
  const [wards, setWards] = useState<Option[]>([])
  const [constituencies, setConstituencies] = useState<Option[]>([])
  const [seats, setSeats] = useState<Option[]>([])

  const [province, setProvince] = useState("")
  const [district, setDistrict] = useState("")
  const [municipality, setMunicipality] = useState("")
  const [ward, setWard] = useState("")
  const [constituency, setConstituency] = useState("")
  const [seat, setSeat] = useState("")

  //////////////////////////////////////////////////////
  // RESET CASCADE (IMPORTANT)
  //////////////////////////////////////////////////////

  useEffect(() => {
    setDistrict("")
    setMunicipality("")
    setWard("")
    setConstituency("")
    setSeat("")
    setDistricts([])
    setMunicipalities([])
    setWards([])
    setConstituencies([])
    setSeats([])
  }, [province])

  useEffect(() => {
    setMunicipality("")
    setWard("")
    setSeat("")
    setMunicipalities([])
    setWards([])
    setSeats([])
  }, [district])

  useEffect(() => {
    setWard("")
    setSeat("")
    setWards([])
    setSeats([])
  }, [municipality])

  useEffect(() => {
    setSeat("")
    setSeats([])
  }, [ward, constituency])

  //////////////////////////////////////////////////////
  // FETCH HELPER (SAFE)
  //////////////////////////////////////////////////////

  const fetchData = async (url: string, setter: any, key: string) => {
    try {
      const res = await fetch(url)
      const data = await res.json()
      setter(data[key] || [])
    } catch {
      setter([])
    }
  }

  //////////////////////////////////////////////////////
  // LOAD PROVINCES
  //////////////////////////////////////////////////////

  useEffect(() => {
    fetchData("/api/elections/filters", setProvinces, "provinces")
  }, [])

  //////////////////////////////////////////////////////
  // LOAD DISTRICTS
  //////////////////////////////////////////////////////

  useEffect(() => {
    if (!province) return
    fetchData(`/api/elections/filters?provinceId=${province}`, setDistricts, "districts")
  }, [province])

  //////////////////////////////////////////////////////
  // LOCAL FLOW
  //////////////////////////////////////////////////////

  useEffect(() => {
    if (electionType !== "LOCAL" || !district) return
    fetchData(`/api/elections/filters?districtId=${district}`, setMunicipalities, "locals")
  }, [district, electionType])

  useEffect(() => {
    if (electionType !== "LOCAL" || !municipality) return
    fetchData(`/api/elections/filters?localLevelId=${municipality}`, setWards, "wards")
  }, [municipality, electionType])

  //////////////////////////////////////////////////////
  // FEDERAL / PROVINCIAL FLOW
  //////////////////////////////////////////////////////

  useEffect(() => {
    if (electionType === "LOCAL" || !province) return
    fetchData(`/api/elections/constituencies?provinceId=${province}`, setConstituencies, "constituencies")
  }, [province, electionType])

  //////////////////////////////////////////////////////
  // LOAD SEATS
  //////////////////////////////////////////////////////

  useEffect(() => {

    if (electionType === "LOCAL") {
      if (!ward) return
      fetchData(`/api/elections/filters?wardId=${ward}`, setSeats, "seats")
    } else {
      if (!constituency) return
      fetchData(`/api/elections/seats?constituencyId=${constituency}`, setSeats, "seats")
    }

  }, [ward, constituency, electionType])

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (

    <div className="search-bar">

      {/* Province */}
      <select value={province} onChange={e => setProvince(e.target.value)}>
        <option value="">Province</option>
        {provinces.map(p => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* District */}
      {electionType === "LOCAL" && (
        <select value={district} onChange={e => setDistrict(e.target.value)}>
          <option value="">District</option>
          {districts.map(d => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      )}

      {/* Municipality */}
      {electionType === "LOCAL" && (
        <select value={municipality} onChange={e => setMunicipality(e.target.value)}>
          <option value="">Municipality</option>
          {municipalities.map(m => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      )}

      {/* Ward */}
      {electionType === "LOCAL" && (
        <select value={ward} onChange={e => setWard(e.target.value)}>
          <option value="">Ward</option>
          {wards.map(w => (
            <option key={w.id} value={w.id}>
              Ward {w.number}
            </option>
          ))}
        </select>
      )}

      {/* Constituency */}
      {electionType !== "LOCAL" && (
        <select value={constituency} onChange={e => setConstituency(e.target.value)}>
          <option value="">Constituency</option>
          {constituencies.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      )}

      {/* Seat */}
      <select value={seat} onChange={e => setSeat(e.target.value)}>
        <option value="">Seat</option>
        {seats.map(s => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <button>Search</button>

    </div>

  )
}