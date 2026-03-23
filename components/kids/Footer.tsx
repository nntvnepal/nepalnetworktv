"use client"

import {
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaTwitter
} from "react-icons/fa"

export default function Footer() {
  return (
    <div
      style={{
        marginTop: "60px",
        background:
          "linear-gradient(135deg, #0284c7, #16a34a)",
        color: "white",
        borderTopLeftRadius: "30px",
        borderTopRightRadius: "30px",
        overflow: "hidden"
      }}
    >
      {/* 🔥 TOP SECTION */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "35px 20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "30px"
        }}
      >
        {/* 🧒 BRAND */}
        <div>
          <div style={{ fontSize: "20px", fontWeight: "800" }}>
            NNTV Kids
          </div>

          <div style={{ fontSize: "14px", marginTop: "4px" }}>
            Learn • Play • Grow 
          </div>

          <div style={{ marginTop: "12px", fontSize: "14px", opacity: 0.9 }}>
            Fun learning platform for kids with games, practice & stories.
          </div>
        </div>

        {/* 📌 QUICK LINKS */}
        <div>
          <div style={{ fontWeight: "700", marginBottom: "10px", fontSize: "16px" }}>
            Explore
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "14px"
            }}
          >
            <span style={{ cursor: "pointer" }}>📚 Learn</span>
            <span style={{ cursor: "pointer" }}>🧠 Practice</span>
            <span style={{ cursor: "pointer" }}>🎮 Games</span>
            <span style={{ cursor: "pointer" }}>🏆 Rewards</span>
          </div>
        </div>

        {/* ⚖️ LEGAL */}
        <div>
          <div style={{ fontWeight: "700", marginBottom: "10px", fontSize: "16px" }}>
            Legal
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "14px"
            }}
          >
            <span style={{ cursor: "pointer" }}>Privacy Policy</span>
            <span style={{ cursor: "pointer" }}>Terms of Use</span>
            <span style={{ cursor: "pointer" }}>Disclaimer</span>
            <span style={{ cursor: "pointer" }}>Contact</span>
          </div>
        </div>

        {/* 📩 NEWSLETTER + SOCIAL */}
        <div>
          <div style={{ fontWeight: "700", marginBottom: "10px", fontSize: "16px" }}>
            Stay Updated
          </div>

          {/* EMAIL BOX */}
          <div
            style={{
              display: "flex",
              borderRadius: "12px",
              overflow: "hidden",
              background: "white"
            }}
          >
            <input
              placeholder="Enter email"
              style={{
                flex: 1,
                padding: "12px",
                border: "none",
                outline: "none",
                fontSize: "14px",
                color: "#222"
              }}
            />

            <button
              style={{
                padding: "12px 16px",
                background: "#c25100", // 🔥 bright orange CTA
                color: "white",
                border: "none",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "14px"
              }}
            >
              Join Now
            </button>
          </div>

          {/* 🔥 SOCIAL ICONS */}
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              gap: "14px",
              fontSize: "22px"
            }}
          >
            <FaYoutube style={{ cursor: "pointer" }} />
            <FaFacebook style={{ cursor: "pointer" }} />
            <FaInstagram style={{ cursor: "pointer" }} />
            <FaTwitter style={{ cursor: "pointer" }} />
          </div>
        </div>
      </div>

      {/* 🔻 BOTTOM DARK SECTION */}
      <div
        style={{
          background: "rgba(0,0,0,0.25)",
          padding: "18px",
          textAlign: "center",
          fontSize: "14px"
        }}
      >
        © 2026 NNTV Kids • A Wing of DAR Group of Nepal  
        <br />
        Website Developed & Maintained by Titan Art Studio, Chennai
      </div>
    </div>
  )
}