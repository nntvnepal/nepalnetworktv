import dynamic from "next/dynamic"

const NepalMap = dynamic(
  () => import("@/components/election/NepalElectionMap"),
  { ssr: false }
)

export default function MapPage() {

  return (

    <div className="flex flex-col h-full">

      <div className="p-4 border-b bg-white">
        <h1 className="text-xl font-bold">
          Nepal Election Map
        </h1>
      </div>

      <div className="flex-1 overflow-hidden">
        <NepalMap />
      </div>

    </div>

  )
}