"use client"

export default function KidsPageLayout({
  title,
  subtitle,
  children
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "20px"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          marginBottom: "20px",
          padding: "20px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, #f0f9ff, #ecfeff)"
        }}
      >
        <h1 style={{ fontSize: "26px", marginBottom: "6px" }}>
          {title}
        </h1>

        {subtitle && (
          <p style={{ fontSize: "14px", opacity: 0.8 }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* CONTENT */}
      <div>{children}</div>
    </div>
  )
}