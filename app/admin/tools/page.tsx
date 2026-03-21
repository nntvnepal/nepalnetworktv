"use client"

import { useState } from "react"
import UnicodePreetiConverter from "@/components/admin/tools/UnicodePreetiConverter"
import TicTacToe from "@/components/admin/tools/games/TicTacToe"
import NumberGuess from "@/components/admin/tools/games/NumberGuess"
import ReactionTest from "@/components/admin/tools/games/ReactionTest"
import ChessGame from "@/components/admin/tools/games/ChessGame"

type Tool =
  | "menu"
  | "converter"
  | "chess"
  | "tic"
  | "guess"
  | "reaction"

export default function AdminToolsPage() {

  const [tool, setTool] = useState<Tool>("menu")

  //////////////////////////////////////////////////////
  // TOOL VIEW
  //////////////////////////////////////////////////////

  function renderTool() {
    switch (tool) {
      case "converter":
        return <UnicodePreetiConverter />

      case "chess":
        return <ChessGame />

      case "tic":
        return <TicTacToe />

      case "guess":
        return <NumberGuess />

      case "reaction":
        return <ReactionTest />

      default:
        return null
    }
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Admin Tools
          </h1>
          <p className="text-sm text-purple-300 mt-1">
            Internal utilities & tools
          </p>
        </div>

        {tool !== "menu" && (
          <button
            onClick={() => setTool("menu")}
            className="px-4 py-2 bg-black/40 hover:bg-black/60 rounded-lg text-sm"
          >
            ← Back
          </button>
        )}
      </div>

      {/* MENU */}
      {tool === "menu" && (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* CONVERTER */}
          <div
            onClick={() => setTool("converter")}
            className="cursor-pointer bg-[#0b0b14] border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition"
          >
            <h2 className="text-lg text-purple-300 font-semibold">
              Preeti Converter
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Unicode ↔ Preeti conversion tool
            </p>
          </div>

          {/* CHESS */}
          <div
            onClick={() => setTool("chess")}
            className="cursor-pointer bg-[#0b0b14] border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-400 transition"
          >
            <h2 className="text-lg text-yellow-300 font-semibold">
              ♟ Chess
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Strategic board game
            </p>
          </div>

          {/* OTHER GAMES */}
          <div className="bg-[#0b0b14] border border-purple-500/20 rounded-xl p-6 space-y-3">

            <h2 className="text-lg text-purple-300 font-semibold">
              Other Games
            </h2>

            <button
              onClick={() => setTool("tic")}
              className="w-full text-left text-sm hover:text-purple-400"
            >
              Tic Tac Toe
            </button>

            <button
              onClick={() => setTool("guess")}
              className="w-full text-left text-sm hover:text-purple-400"
            >
              Number Guess
            </button>

            <button
              onClick={() => setTool("reaction")}
              className="w-full text-left text-sm hover:text-purple-400"
            >
              Reaction Test
            </button>

          </div>

        </div>

      )}

      {/* TOOL VIEW */}
      {tool !== "menu" && (
        <div className="w-full max-w-4xl">
          {renderTool()}
        </div>
      )}

    </div>
  )
}