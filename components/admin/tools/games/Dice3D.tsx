"use client"

import { useState } from "react"

export default function Dice3D({ onRoll }: { onRoll: (val:number)=>void }) {
  const [rolling, setRolling] = useState(false)
  const [rotation, setRotation] = useState("")

  const rollDice = () => {
    if (rolling) return

    setRolling(true)

    const finalValue = Math.floor(Math.random() * 6) + 1

    const spinX = 720 + Math.random() * 360
    const spinY = 720 + Math.random() * 360

    setRotation(`rotateX(${spinX}deg) rotateY(${spinY}deg)`)

    setTimeout(() => {
      onRoll(finalValue)
      setRotation(getFaceRotation(finalValue))
      setRolling(false)
    }, 400)
  }

  return (
    <div className="flex flex-col items-center gap-3 mt-4">

      <div className="perspective-[800px]">
        <div
          className="w-[70px] h-[70px] relative transform-style-3d transition-transform duration-300"
          style={{ transform: rotation }}
        >
          {[1,2,3,4,5,6].map((num) => (
            <div
              key={num}
              className="absolute w-full h-full bg-white border rounded-lg flex items-center justify-center"
              style={getFaceStyle(num)}
            >
              <Dots value={num}/>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={rollDice}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg"
      >
        Roll Dice
      </button>

    </div>
  )
}

function getFaceRotation(v:number){
  if(v===1) return "rotateX(0deg)"
  if(v===2) return "rotateX(-90deg)"
  if(v===3) return "rotateY(90deg)"
  if(v===4) return "rotateY(-90deg)"
  if(v===5) return "rotateX(90deg)"
  return "rotateX(180deg)"
}

function getFaceStyle(f:number){
  const d=35
  if(f===1) return {transform:`translateZ(${d}px)`}
  if(f===2) return {transform:`rotateX(90deg) translateZ(${d}px)`}
  if(f===3) return {transform:`rotateY(90deg) translateZ(${d}px)`}
  if(f===4) return {transform:`rotateY(-90deg) translateZ(${d}px)`}
  if(f===5) return {transform:`rotateX(-90deg) translateZ(${d}px)`}
  return {transform:`rotateX(180deg) translateZ(${d}px)`}
}

function Dot(){ return <div className="w-2 h-2 bg-black rounded-full"/> }

function Dots({value}:{value:number}){
  const map:any={
    1:[4],2:[0,8],3:[0,4,8],
    4:[0,2,6,8],5:[0,2,4,6,8],
    6:[0,2,3,5,6,8]
  }

  return (
    <div className="grid grid-cols-3 gap-1 w-[40px] h-[40px]">
      {Array.from({length:9}).map((_,i)=>(
        <div key={i} className="flex items-center justify-center">
          {map[value].includes(i)&&<Dot/>}
        </div>
      ))}
    </div>
  )
}