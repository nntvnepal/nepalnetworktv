"use client"

import { useState, useEffect } from "react"
import styles from "./ludo.module.css"

type Player = "red" | "green" | "yellow" | "blue"

type Token = {
  id: number
  pos: number
  player: Player
  color: string
}

const PLAYER_ORDER: Player[] = ["red", "green", "yellow", "blue"]

export default function LudoBoard({ dice }: { dice: number }) {
  const size = 15

  const [turn, setTurn] = useState<Player>("red")
  const [canPlay, setCanPlay] = useState(false)

  const [tokens, setTokens] = useState<Token[]>([
  ...[1,2,3,4].map(i => ({ id: i, pos: -1, player: "red" as Player, color: "bg-red-700" })),
  ...[5,6,7,8].map(i => ({ id: i, pos: -1, player: "green" as Player, color: "bg-green-700" })),
  ...[9,10,11,12].map(i => ({ id: i, pos: -1, player: "yellow" as Player, color: "bg-yellow-500" })),
  ...[13,14,15,16].map(i => ({ id: i, pos: -1, player: "blue" as Player, color: "bg-blue-800" })),
])

  //////////////////////////////////////////////////////
  // PATH
  //////////////////////////////////////////////////////
  const path = [
    [6,1],[6,2],[6,3],[6,4],[6,5],[6,6],
    [5,6],[4,6],[3,6],[2,6],[1,6],
    [1,7],[1,8],
    [2,8],[3,8],[4,8],[5,8],[6,8],
    [6,9],[6,10],[6,11],[6,12],[6,13],
  ]

  //////////////////////////////////////////////////////
  // SAFE CELLS
  //////////////////////////////////////////////////////
  const safeCells = [
    [2,6],[6,12],[12,8],[8,2],
  ]

  const isSafeCell = (r:number,c:number) =>
    safeCells.some(([sr,sc]) => sr===r && sc===c)

  //////////////////////////////////////////////////////
  // ENABLE PLAY
  //////////////////////////////////////////////////////
  useEffect(() => {
    if (dice > 0) setCanPlay(true)
  }, [dice])

  //////////////////////////////////////////////////////
  // MOVE POSSIBLE
  //////////////////////////////////////////////////////
  const isMovePossible = (t:Token) => {
    if (t.player !== turn) return false
    if (t.pos === -1 && dice === 6) return true
    if (t.pos >= 0 && t.pos + dice < path.length) return true
    return false
  }

  //////////////////////////////////////////////////////
  // MOVE TOKEN
  //////////////////////////////////////////////////////
  const moveToken = (tokenId:number) => {
    if (!canPlay) return

    const token = tokens.find(t=>t.id===tokenId)
    if (!token || !isMovePossible(token)) return

    let newPos = token.pos === -1 ? 0 : token.pos + dice
    if (newPos >= path.length) return

    const [nr,nc] = path[newPos]

    let updated = tokens.map(t =>
      t.id === tokenId ? {...t,pos:newPos} : t
    )

    //////////////////////////////////////////////////////
    // 💀 KILL
    //////////////////////////////////////////////////////
    if (!isSafeCell(nr,nc)) {
      updated = updated.map(t=>{
        if (t.id===tokenId) return t
        if (t.pos<0) return t

        const [tr,tc] = path[t.pos]

        if (tr===nr && tc===nc && t.player!==token.player) {
          return {...t,pos:-1}
        }

        return t
      })
    }

    setTokens(updated)
    setCanPlay(false)

    //////////////////////////////////////////////////////
    // 🏆 WIN CHECK
    //////////////////////////////////////////////////////
    const playerTokens = updated.filter(t=>t.player===token.player)
    const allFinished = playerTokens.every(t=>t.pos===path.length-1)

    if (allFinished) {
      alert(`🏆 ${token.player.toUpperCase()} WINS!`)
      return
    }

    //////////////////////////////////////////////////////
    // TURN CHANGE
    //////////////////////////////////////////////////////
    if (dice !== 6) {
      const next = (PLAYER_ORDER.indexOf(turn)+1)%4
      setTurn(PLAYER_ORDER[next])
    }
  }

  //////////////////////////////////////////////////////
  // TOKENS ON CELL
  //////////////////////////////////////////////////////
  const getTokensAtCell = (r:number,c:number) =>
    tokens.filter(t=>{
      if (t.pos<0) return false
      const [tr,tc]=path[t.pos]
      return tr===r && tc===c
    })

  //////////////////////////////////////////////////////
  // HOME TOKENS
  //////////////////////////////////////////////////////
  const getHomeTokens = (player:Player)=>
    tokens.filter(t=>t.player===player && t.pos===-1)

  //////////////////////////////////////////////////////
  // BOARD HELPERS (UNCHANGED)
  //////////////////////////////////////////////////////
  const isHome = (r:number,c:number)=>
    (r<=5 && c<=5)||(r<=5 && c>=9)||(r>=9 && c<=5)||(r>=9 && c>=9)

  const isEntry = (r:number,c:number)=>
    (r===6&&c===1)||(r===1&&c===8)||(r===8&&c===13)||(r===13&&c===6)

  const getEntryColor=(r:number,c:number)=>{
    if(r===6&&c===1)return"bg-red-700"
    if(r===1&&c===8)return"bg-green-700"
    if(r===8&&c===13)return"bg-yellow-500"
    if(r===13&&c===6)return"bg-blue-800"
    return""
  }

  const getCell=(r:number,c:number)=>{
    if(isHome(r,c)){
      if(r<=5&&c<=5)return"bg-red-700"
      if(r<=5&&c>=9)return"bg-green-700"
      if(r>=9&&c<=5)return"bg-blue-800"
      if(r>=9&&c>=9)return"bg-yellow-500"
    }
    if(r>=6&&r<=8&&c>=6&&c<=8)return"bg-white"
    if(c===7&&r>=1&&r<=6)return"bg-green-700"
    if(r===7&&c>=8&&c<=13)return"bg-yellow-500"
    if(c===7&&r>=8&&r<=13)return"bg-blue-800"
    if(r===7&&c>=1&&c<=6)return"bg-red-700"
    return"bg-gray-200"
  }

  //////////////////////////////////////////////////////
  // HOME UI
  //////////////////////////////////////////////////////
  const Home=({player,color}:{player:Player;color:string})=>{
    const homeTokens=getHomeTokens(player)

    return(
      <div className="w-[120px] h-[120px] bg-white border-[3px] border-gray-600 rounded-xl grid grid-cols-2 gap-3 p-3 shadow-md">
        {homeTokens.map(t=>(
          <div
            key={t.id}
            onClick={()=>moveToken(t.id)}
            className={`rounded-full ${color} cursor-pointer
              ${
                player===turn && isMovePossible(t)
                  ? "ring-2 ring-white scale-110"
                  : "opacity-40"
              }`}
          />
        ))}
      </div>
    )
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////
  return (
    <div className="w-full flex flex-col items-center">

      <div className="mb-3 text-lg font-bold">
        Turn: <span className="uppercase">{turn}</span>
      </div>

      <div className="w-full max-w-[650px] aspect-square">
        <div className="relative w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden">

          <div
            className="grid w-full h-full"
            style={{
              gridTemplateColumns:"repeat(15,1fr)",
              gridTemplateRows:"repeat(15,1fr)",
            }}
          >
            {Array.from({length:size}).map((_,r)=>
              Array.from({length:size}).map((_,c)=>{
                const cellTokens=getTokensAtCell(r,c)

                return(
                  <div
                    key={`${r}-${c}`}
                    className={`flex items-center justify-center 
                    ${isEntry(r,c)?getEntryColor(r,c):getCell(r,c)} 
                    ${isHome(r,c)?"":"border border-gray-300"}`}
                  >

                    {/* SAFE DOT */}
                    {isSafeCell(r,c) && (
                      <span className="text-green-700 text-xs">●</span>
                    )}

                    <div className="flex flex-wrap gap-[2px]">
                      {cellTokens.map(t=>(
                        <div
                          key={t.id}
                          onClick={()=>moveToken(t.id)}
                          className={`w-4 h-4 rounded-full ${t.color} cursor-pointer
                            ${
                              t.player===turn && isMovePossible(t)
                                ? "ring-2 ring-black scale-110"
                                : "opacity-40"
                            }`}
                        />
                      ))}
                    </div>

                  </div>
                )
              })
            )}
          </div>

          {/* CENTER */}
          <div className="absolute top-1/2 left-1/2 w-[20.5%] h-[20.5%] -translate-x-1/2 -translate-y-1/2 grid grid-cols-2 grid-rows-2 z-10">
            <div className={`bg-green-700 ${styles.clipTopLeft}`} />
            <div className={`bg-yellow-500 ${styles.clipTopRight}`} />
            <div className={`bg-red-700 ${styles.clipBottomLeft}`} />
            <div className={`bg-blue-800 ${styles.clipBottomRight}`} />
          </div>

          {/* HOMES */}
          <div className="absolute top-[10%] left-[10%]">
            <Home player="red" color="bg-red-700"/>
          </div>
          <div className="absolute top-[10%] right-[10%]">
            <Home player="green" color="bg-green-700"/>
          </div>
          <div className="absolute bottom-[10%] left-[10%]">
            <Home player="blue" color="bg-blue-800"/>
          </div>
          <div className="absolute bottom-[10%] right-[10%]">
            <Home player="yellow" color="bg-yellow-500"/>
          </div>

        </div>
      </div>
    </div>
  )
}