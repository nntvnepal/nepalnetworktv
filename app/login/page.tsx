"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ReCAPTCHA from "react-google-recaptcha"

export default function LoginPage(){

  const router = useRouter()

  //////////////////////////////////////////////////////
  // LOGIN STATE
  //////////////////////////////////////////////////////

  const [showLogin,setShowLogin] = useState(false)
  const [step,setStep] = useState<"login" | "otp">("login")

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [emailForOtp,setEmailForOtp] = useState("")
  const [otp,setOtp] = useState("")
  const [captchaToken,setCaptchaToken] = useState<string | null>(null)

  const [error,setError] = useState("")
  const [loading,setLoading] = useState(false)

  //////////////////////////////////////////////////////
  // REALISTIC LIVE SYSTEM 🔥
  //////////////////////////////////////////////////////

  const [viewers,setViewers] = useState(12500)
  const [articles,setArticles] = useState(8420)

  useEffect(()=>{

    const interval = setInterval(()=>{

      setViewers(v=>{
        const change = Math.floor(Math.random()*40)
        return Math.random() > 0.5 ? v + change : Math.max(1000, v - change)
      })

      setArticles(a=>{
        const change = Math.floor(Math.random()*2)
        return Math.random() > 0.1 ? a + change : Math.max(0, a - 1)
      })

    },1500)

    return ()=>clearInterval(interval)

  },[])

  //////////////////////////////////////////////////////
  // JOIN TEAM STATE
  //////////////////////////////////////////////////////

  const [join,setJoin] = useState<any>({
    name:"",
    email:"",
    phone:"",
    role:"reporter",
    message:"",
    resume:null
  })

  //////////////////////////////////////////////////////
  // SUBMIT JOIN
  //////////////////////////////////////////////////////

  async function handleJoin(){

    if(!join.name || !join.email || !join.phone){
      alert("Fill all fields")
      return
    }

    try{

      const formData = new FormData()

      formData.append("name",join.name)
      formData.append("email",join.email)
      formData.append("phone",join.phone)
      formData.append("role",join.role)
      formData.append("message",join.message)

      if(join.resume){
        formData.append("resume",join.resume)
      }

      const res = await fetch("/api/applications",{
        method:"POST",
        body: formData
      })

      const data = await res.json()
      console.log("JOIN RESPONSE:",data)

      if(!res.ok){
        alert(data.error || "Submission failed")
        return
      }

      alert("Application submitted 🚀")

      setJoin({
        name:"",
        email:"",
        phone:"",
        role:"reporter",
        message:"",
        resume:null
      })

    }catch(err){
      console.error(err)
      alert("Error submitting")
    }
  }

  //////////////////////////////////////////////////////
  // LOGIN
  //////////////////////////////////////////////////////

  async function handleLogin(e:any){
  e.preventDefault()

  if(!captchaToken){
    setError("Verify captcha")
    return
  }

  setLoading(true)
  setError("")

  try{
    console.log("🚀 Sending request...")

    const res = await fetch("/api/auth/login",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ email,password,captchaToken })
    })

    console.log("✅ Response received:", res.status)

    let data = null

    try{
      data = await res.json()
      console.log("📦 DATA:", data)
    }catch(err){
      console.error("❌ JSON PARSE ERROR:", err)
      setError("Server response error")
      setLoading(false)
      return
    }

    if(!res.ok){
      setError(data?.error || "Login failed")
      setLoading(false)
      return
    }

    if(data?.step==="otp_required"){
      console.log("👉 OTP STEP TRIGGERED")
      setEmailForOtp(data.email)
      setStep("otp")
      setLoading(false)
      return
    }

    setError("Unexpected response")
    setLoading(false)

  }catch(err){
    console.error("❌ FETCH ERROR:", err)
    setError("Network error")
    setLoading(false)
  }
}
  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return(

<div className="min-h-screen flex flex-col lg:flex-row bg-black text-white relative overflow-hidden">

{/* GRID */}
<div className="absolute inset-0 opacity-20 bg-[linear-gradient(#0f172a_1px,transparent_1px),linear-gradient(to_right,#0f172a_1px,transparent_1px)] bg-[size:40px_40px]"/>

{/* GLOW */}
<div className="absolute w-[600px] h-[600px] bg-purple-600 blur-[200px] opacity-30"/>
<div className="absolute w-[500px] h-[500px] bg-orange-500 blur-[200px] opacity-20 bottom-0 right-0"/>

{/* LEFT */}
<div className="w-full lg:w-1/2 p-5 lg:p-10 flex flex-col justify-between min-h-screen z-10">

  <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4 backdrop-blur">

    <h3 className="font-semibold text-xl">🚀 Join NNTV Team</h3>

    <input placeholder="Full Name" value={join.name}
      onChange={(e)=>setJoin({...join,name:e.target.value})}
      className="w-full p-3 bg-black/40 rounded"/>

    <input placeholder="Email" value={join.email}
      onChange={(e)=>setJoin({...join,email:e.target.value})}
      className="w-full p-3 bg-black/40 rounded"/>

    <input placeholder="Phone Number" value={join.phone}
      onChange={(e)=>setJoin({...join,phone:e.target.value})}
      className="w-full p-3 bg-black/40 rounded"/>

    <select value={join.role}
      onChange={(e)=>setJoin({...join,role:e.target.value})}
      className="w-full p-3 bg-black/40 rounded">

      <option value="reporter">Reporter</option>
      <option value="editor">Editor</option>
      <option value="designer">Designer</option>
      <option value="tv_operator">TV Operator</option>
    </select>

    <textarea placeholder="Tell us about yourself..."
      value={join.message}
      onChange={(e)=>setJoin({...join,message:e.target.value})}
      className="w-full p-3 bg-black/40 rounded"/>

    <input type="file" accept=".pdf,.doc,.docx"
      onChange={(e)=>setJoin({...join,resume:e.target.files?.[0]})}
      className="w-full p-2 bg-black/40 rounded"/>

    <button onClick={handleJoin}
      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded">
      Apply Now
    </button>

  </div>

  {/* 🔥 FOOTER ANIMATION BACK */}
  <div className="overflow-hidden whitespace-nowrap text-xs lg:text-sm opacity-70 mt-6">
    <div className="animate-[ticker_18s_linear_infinite]">
      🚨 Breaking: News, Election Update • 📡 Signal Stable • 📊 Traffic Spike • 💰 Ads Revenue ↑ • 🛰 Live Feed Active •
    </div>
  </div>

</div>

{/* RIGHT */}
<div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-5 lg:px-10 z-10">

  <div className="text-center space-y-6 max-w-md">

    <h1 className="text-3xl lg:text-5xl font-bold">
      NNTV CONTROL <br/>
      <span className="text-orange-500">COMMAND CENTER</span>
    </h1>

    <div className="bg-white/5 px-6 py-4 rounded-xl space-y-3">

      <div className="flex justify-between">
        <span>Live Traffic</span>
        <span className="text-green-400">{viewers}</span>
      </div>

      <div className="flex justify-between">
        <span>News Published</span>
        <span className="text-yellow-400">{articles}</span>
      </div>

    </div>

    {!showLogin && (
      <button onClick={()=>setShowLogin(true)}
        className="text-4xl animate-pulse">
        🔒
      </button>
    )}

  </div>

  <div className={`transition-all duration-700 overflow-hidden ${
    showLogin ? "max-h-[600px] opacity-100 mt-6" : "max-h-0 opacity-0"
  }`}>

    <div className="w-full max-w-sm bg-white/5 p-6 rounded-xl space-y-4">

      {error && <p className="text-red-400">{error}</p>}

      {step==="login" && (
        <form onSubmit={handleLogin} className="space-y-4">

          <input value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 bg-black/40 rounded"/>

          <input type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 bg-black/40 rounded"/>

          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={(t)=>setCaptchaToken(t)}
          />

          <button disabled={loading}
            className="w-full bg-orange-500 py-3 rounded">
            {loading ? "Processing..." : "Continue"}
          </button>

        </form>
      )}

      {step==="otp" && (
        <form onSubmit={handleVerify} className="space-y-4">

          <input value={otp}
            onChange={(e)=>setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full p-3 text-center bg-black/40 rounded"/>

          <button className="w-full bg-green-600 py-3 rounded">
            Verify
          </button>

        </form>
      )}

    </div>

  </div>

</div>

{/* 🔥 ANIMATION KEYFRAMES */}
<style jsx global>{`
@keyframes ticker {
  0% { transform: translateX(100%) }
  100% { transform: translateX(-100%) }
}
`}</style>

</div>
  )
}