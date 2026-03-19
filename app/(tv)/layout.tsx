export default function TVLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "black",
        overflow: "hidden",
        margin: 0,
        padding: 0
      }}
    >
      {children}
    </div>
  )
}