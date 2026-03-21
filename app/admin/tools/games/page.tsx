import TicTacToe from "@/components/admin/tools/games/TicTacToe"
import NumberGuess from "@/components/admin/tools/games/NumberGuess"
import ReactionTest from "@/components/admin/tools/games/ReactionTest"
import Game2048 from "@/components/admin/tools/games/Game2048"

export default function Page() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <TicTacToe />
      <NumberGuess />
      <ReactionTest />
      <Game2048 />
    </div>
  )
}