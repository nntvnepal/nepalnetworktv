"use client"

import { useState } from "react"
import ToolsCard from "../ToolsCard"

export default function TicTacToe() {

  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null))
  const [xTurn, setXTurn] = useState(true)

  //////////////////////////////////////////////////////
  // WINNER CHECK
  //////////////////////////////////////////////////////

  function checkWinner(b: (string | null)[]) {
    const lines = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6],
    ]

    for (let [a,b1,c] of lines) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
        return b[a]
      }
    }

    return null
  }

  const winner = checkWinner(board)

  //////////////////////////////////////////////////////
  // HANDLE CLICK
  //////////////////////////////////////////////////////

  function handleClick(i: number) {
    if (board[i] || winner) return

    const newBoard = [...board]
    newBoard[i] = xTurn ? "X" : "O"

    setBoard(newBoard)
    setXTurn(!xTurn)
  }

  //////////////////////////////////////////////////////
  // RESET
  //////////////////////////////////////////////////////

  function resetGame() {
    setBoard(Array(9).fill(null))
    setXTurn(true)
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <ToolsCard title="Tic Tac Toe">

      <div className="space-y-4">

        {/* STATUS */}
        <div className="text-center text-sm text-purple-300">
          {winner
            ? `Winner: ${winner}`
            : `Turn: ${xTurn ? "X" : "O"}`}
        </div>

        {/* BOARD */}
        <div className="grid grid-cols-3 gap-2">

          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className="h-16 bg-black/70 border border-purple-500/30 text-xl font-bold rounded-lg hover:bg-purple-700/30 transition"
            >
              {cell}
            </button>
          ))}

        </div>

        {/* RESET */}
        <button
          onClick={resetGame}
          className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded-lg text-sm"
        >
          Reset Game
        </button>

      </div>

    </ToolsCard>
  )
}