"use client"

import { useState } from "react"
import { updateGeography } from "./actions"

export default function EditForm({ region, provinces, districts }: any) {

  const [type,setType] = useState(region.type)

  return(

    <form action={updateGeography} className="space-y-6">

      <input type="hidden" name="id" value={region.id}/>

      {/* REGION NAME */}

      <div>

        <label className="text-sm text-purple-200">
          Region Name
        </label>

        <input
          name="name"
          defaultValue={region.name}
          required
          className="
          w-full
          bg-purple-900/40
          border border-purple-700
          rounded-lg
          px-4 py-2
          text-white
          "
        />

      </div>


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
          w-full
          bg-purple-900/40
          border border-purple-700
          rounded-lg
          px-4 py-2
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


      {/* PROVINCE SELECT */}

      {type !== "PROVINCE" && (

        <div>

          <label className="text-sm text-purple-200">
            Province
          </label>

          <select
            name="provinceId"
            defaultValue={region.parentId || ""}
            className="
            w-full
            bg-purple-900/40
            border border-purple-700
            rounded-lg
            px-4 py-2
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


      {/* DISTRICT SELECT */}

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
            defaultValue={region.parentId || ""}
            className="
            w-full
            bg-purple-900/40
            border border-purple-700
            rounded-lg
            px-4 py-2
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


      {/* SUBMIT */}

      <button
        type="submit"
        className="
        bg-blue-600
        hover:bg-blue-700
        text-white
        px-6 py-2
        rounded-lg
        "
      >
        Update Geography
      </button>

    </form>

  )

}