"use client"

import { useState } from "react"
import ToolsCard from "../ToolsCard"
import LudoBoard from "./LudoBoard"
import Dice3D from "./Dice3D"

export default function LudoGame() {

  const [dice, setDice] = useState(0)

  return (
    <ToolsCard title="🎲 Break Time Ludo with team ">

      <div className="flex flex-col items-center gap-6">

        {/* BOARD */}
        <LudoBoard dice={dice} />

        {/* DICE */}
        <Dice3D onRoll={(value) => setDice(value)} />

      </div>

    </ToolsCard>
  )
}