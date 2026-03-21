"use client"

import { useState } from "react"
import ToolsCard from "../ToolsCard"
import { Chess, Square, Move } from "chess.js"

export default function ChessGame() {

  const [game, setGame] = useState(new Chess())
  const [selected, setSelected] = useState<Square | null>(null)
  const [moves, setMoves] = useState<Square[]>([])
  const [lastMove, setLastMove] = useState<Move | null>(null)

  //////////////////////////////////////////////////////
  // CLICK HANDLER
  //////////////////////////////////////////////////////

  function handleClick(square: Square) {

    // select piece
    if (!selected) {
      const possible = game
        .moves({ square, verbose: true })
        .map(m => m.to as Square)

      if (possible.length > 0) {
        setSelected(square)
        setMoves(possible)
      }
      return
    }

    // move piece
    try {
      const move = game.move({
        from: selected,
        to: square,
        promotion: "q",
      })

      if (move) {
        setGame(new Chess(game.fen()))
        setLastMove(move)
      }
    } catch {}

    setSelected(null)
    setMoves([])
  }

  //////////////////////////////////////////////////////
  // STATUS
  //////////////////////////////////////////////////////

  function getStatus() {
    if (game.isCheckmate()) return "🔥 Checkmate"
    if (game.isCheck()) return "⚠️ Check"
    return `Turn: ${game.turn() === "w" ? "White ♔" : "Black ♚"}`
  }

  //////////////////////////////////////////////////////
  // BOARD
  //////////////////////////////////////////////////////

  const board = game.board()

  const pieceMap: Record<string, string> = {
    p: "♟",
    r: "♜",
    n: "♞",
    b: "♝",
    q: "♛",
    k: "♚",
  }

  return (
    <ToolsCard title="♟ Chess">

      <div className="flex flex-col items-center gap-5">

        {/* STATUS */}
        <div className="text-sm text-purple-300 font-semibold">
          {getStatus()}
        </div>

        {/* BOARD */}
        <div className="grid grid-cols-8 rounded-xl overflow-hidden shadow-2xl border border-white/10">

          {board.flat().map((sq, i) => {

            const file = "abcdefgh"[i % 8]
            const rank = 8 - Math.floor(i / 8)
            const name = `${file}${rank}` as Square

            const dark = (i + Math.floor(i / 8)) % 2

            const isSelected = selected === name
            const isMove = moves.includes(name)
            const isLastMove =
              lastMove &&
              (lastMove.from === name || lastMove.to === name)

            return (
              <button
                key={i}
                onClick={() => handleClick(name)}
                className={`
                  relative h-16 w-16 flex items-center justify-center text-2xl
                  transition-all duration-200

                  ${dark
                    ? "bg-[#3a4a5a]"
                    : "bg-[#d8e2dc]"
                  }

                  ${isSelected ? "ring-2 ring-yellow-400 scale-105" : ""}

                  ${isLastMove ? "bg-yellow-200/40" : ""}

                  hover:brightness-110
                `}
              >

                {/* PIECE */}
                {sq && (
                  <span className="drop-shadow-lg">
                    {sq.color === "w"
                      ? pieceMap[sq.type].toUpperCase()
                      : pieceMap[sq.type]}
                  </span>
                )}

                {/* MOVE DOT */}
                {isMove && !sq && (
                  <div className="absolute w-3 h-3 bg-green-400 rounded-full opacity-80" />
                )}

                {/* CAPTURE DOT */}
                {isMove && sq && (
                  <div className="absolute inset-0 border-2 border-red-400 rounded-full" />
                )}

              </button>
            )
          })}

        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 w-full max-w-md">

          <button
            onClick={() => {
              setGame(new Chess())
              setSelected(null)
              setMoves([])
              setLastMove(null)
            }}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 p-2 rounded-lg font-semibold"
          >
            Reset Game
          </button>

        </div>

      </div>

    </ToolsCard>
  )
}