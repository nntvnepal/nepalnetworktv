export default function ToolsCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#0b0b14] border border-purple-500/20 rounded-xl p-5 shadow-md hover:border-purple-500/40 transition-all duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-purple-300">
          {title}
        </h2>
      </div>

      {/* Content */}
      <div className="text-white text-sm">
        {children}
      </div>
    </div>
  )
}