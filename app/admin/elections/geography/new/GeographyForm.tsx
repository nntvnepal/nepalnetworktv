"use client"

import { useState } from "react"
import { createGeography } from "./actions"

export default function GeographyForm({
  provinces,
  districts,
  municipalities
}:any){

  const [type,setType] = useState("PROVINCE")

  return(

    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-2xl font-semibold text-white mb-6">
        Add Geography
      </h1>

      <form
        action={createGeography}
        className="
        backdrop-blur-xl
        bg-white/10
        border border-white/10
        rounded-xl
        p-6
        space-y-5
        "
      >

        {/* REGION NAME */}

        {type !== "WARD" && (

          <div>

            <label className="text-sm text-purple-200">
              Region Name
            </label>

            <input
              name="name"
              required
              className="
              w-full mt-1
              bg-purple-900/40
              border border-white/10
              rounded-lg
              px-3 py-2
              text-white
              "
            />

          </div>

        )}

        {/* TYPE */}

        <div>

          <label className="text-sm text-purple-200">
            Type
          </label>

          <select
            name="type"
            value={type}
            onChange={(e)=>setType(e.target.value)}
            className="
            w-full mt-1
            bg-purple-900/40
            border border-white/10
            rounded-lg
            px-3 py-2
            text-white
            "
          >

            <option value="PROVINCE">Province</option>
            <option value="DISTRICT">District</option>
            <option value="METRO">Metro City</option>
            <option value="SUB_METRO">Sub Metro</option>
            <option value="MUNICIPALITY">Municipality</option>
            <option value="RURAL_MUNICIPALITY">Rural Municipality</option>

          </select>

        </div>

        {/* PARENT PROVINCE */}

        {type !== "PROVINCE" && (

          <div>

            <label className="text-sm text-purple-200">
              Province
            </label>

            <select
              name="provinceId"
              className="
              w-full mt-1
              bg-purple-900/40
              border border-white/10
              rounded-lg
              px-3 py-2
              text-white
              "
            >

              <option value="">Select Province</option>

              {provinces.map((p:any)=>(
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}

            </select>

          </div>

        )}

        {/* DISTRICT */}

        {[
          "METRO",
          "SUB_METRO",
          "MUNICIPALITY",
          "RURAL_MUNICIPALITY"
        ].includes(type) && (

          <div>

            <label className="text-sm text-purple-200">
              District
            </label>

            <select
              name="districtId"
              className="
              w-full mt-1
              bg-purple-900/40
              border border-white/10
              rounded-lg
              px-3 py-2
              text-white
              "
            >

              <option value="">Select District</option>

              {districts.map((d:any)=>(
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}

            </select>

          </div>

        )}

        {/* BUTTON */}

        <button
          type="submit"
          className="
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-4 py-2
          rounded-lg
          "
        >
          Save Geography
        </button>

      </form>

    </div>

  )

}