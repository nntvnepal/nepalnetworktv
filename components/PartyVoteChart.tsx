"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts"

type Data = {
  party: string
  votes: number
  color?: string
}

export default function PartyVoteChart({ data }: { data: Data[] }) {

  return (
    <div className="w-full h-[320px]">

      <ResponsiveContainer width="100%" height="100%">

        <BarChart data={data}>

          <XAxis dataKey="party" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />

          <Bar dataKey="votes">

            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.color || "#22c55e"}
              />
            ))}

          </Bar>

        </BarChart>

      </ResponsiveContainer>

    </div>
  )
}