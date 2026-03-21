import LudoGame from "@/components/admin/tools/games/LudoGame"

export default function Page() {
  return (
   <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center">
  <div className="w-full max-w-[850px] aspect-square">
    <LudoGame />
  </div>
</div>
  )
}