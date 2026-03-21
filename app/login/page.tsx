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
        return Math.random() > 0.1 ? a + change : a - 1
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
  // ✅ FIXED SUBMIT (ONLY CHANGE)
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

      const res = await fetch("/api/applications", { // ✅ FIX
        method:"POST",
        body: formData
      })

      const data = await res.json()
      console.log("JOIN RESPONSE:",data)

      if(!res.ok){
        alert("Submission failed")
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

    const res = await fetch("/api/auth/login",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ email,password,captchaToken })
    })

    const data = await res.json()

    if(!res.ok){
      setError(data.error)
      return
    }

    if(data.step==="otp_required"){
      setEmailForOtp(data.email)
      setStep("otp")
    }
  }

  async function handleVerify(e:any){
    e.preventDefault()

    const res = await fetch("/api/auth/verify-otp",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ email:emailForOtp,code:otp })
    })

    if(res.ok){
      router.push("/admin")
    }
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return(

<div className="min-h-screen flex bg-black text-white relative overflow-hidden">

{/* GRID */}
<div className="absolute inset-0 opacity-20 bg-[linear-gradient(#0f172a_1px,transparent_1px),linear-gradient(to_right,#0f172a_1px,transparent_1px)] bg-[size:40px_40px]"/>

{/* GLOW */}
<div className="absolute w-[600px] h-[600px] bg-purple-600 blur-[200px] opacity-30"/>
<div className="absolute w-[500px] h-[500px] bg-orange-500 blur-[200px] opacity-20 bottom-0 right-0"/>

{/* LEFT SIDE */}
<div className="w-1/2 p-10 flex flex-col justify-between min-h-screen z-10">

  <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4 backdrop-blur">

    <h3 className="font-semibold text-xl">🚀 Join NNTV Team</h3>

    <input
      placeholder="Full Name"
      value={join.name}
      onChange={(e)=>setJoin({...join,name:e.target.value})}
      className="w-full p-3 bg-black/40 rounded focus:ring-2 focus:ring-purple-500 outline-none"
    />

    <input
      placeholder="Email"
      value={join.email}
      onChange={(e)=>setJoin({...join,email:e.target.value})}
      className="w-full p-3 bg-black/40 rounded"
    />

    <input
      placeholder="Phone Number"
      value={join.phone}
      onChange={(e)=>setJoin({...join,phone:e.target.value})}
      className="w-full p-3 bg-black/40 rounded"
    />

    <select
      value={join.role}
      onChange={(e)=>setJoin({...join,role:e.target.value})}
      className="w-full p-3 bg-black/40 rounded"
    >
      <option value="reporter">Reporter</option>
      <option value="editor">Editor</option>
      <option value="designer">Designer</option>
      <option value="tv_operator">TV Operator</option>
    </select>

    <textarea
      placeholder="Tell us about yourself..."
      value={join.message}
      onChange={(e)=>setJoin({...join,message:e.target.value})}
      className="w-full p-3 bg-black/40 rounded"
    />

    <input
      type="file"
      accept=".pdf,.doc,.docx"
      onChange={(e)=>{
        const file = e.target.files?.[0]
        setJoin({...join,resume:file})
      }}
      className="w-full p-2 bg-black/40 rounded"
    />

    <button
      onClick={handleJoin}
      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded font-semibold hover:scale-[1.02] transition"
    >
      Apply Now
    </button>

  </div>

  <div className="overflow-hidden whitespace-nowrap text-sm opacity-70 mt-6">
    <div className="animate-[ticker_18s_linear_infinite]">
      🚨 Breaking: News, Election Update • 📡 Signal Stable • 📊 Traffic Spike • 💰 Ads Revenue ↑ • 🛰 Live Feed Active •
    </div>
  </div>

</div>

{/* RIGHT SIDE */}
<div className="w-1/2 flex flex-col justify-center items-center min-h-screen px-10 z-10">

  <div className="text-center space-y-6 max-w-md">

    <h1 className="text-5xl font-bold leading-tight tracking-wide">
      NNTV CONTROL
      <br/>
      <span className="text-orange-500">COMMAND CENTER</span>
    </h1>

    <div className="bg-white/5 px-6 py-4 rounded-xl border border-white/10 space-y-3 backdrop-blur">

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
      <button
        onClick={()=>setShowLogin(true)}
        className="text-5xl animate-pulse hover:scale-110 transition"
      >
        🔒
      </button>
    )}

  </div>

  <div className={`transition-all duration-700 overflow-hidden flex justify-center ${
    showLogin ? "max-h-[500px] opacity-100 mt-6" : "max-h-0 opacity-0"
  }`}>

    <div className="w-[360px] bg-white/5 p-6 rounded-xl border border-white/10 space-y-4 backdrop-blur">

      {error && <p className="text-red-400">{error}</p>}

      {step==="login" && (
        <form onSubmit={handleLogin} className="space-y-4">

          <input
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-3 bg-black/40 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full p-3 bg-black/40 rounded"
          />

          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={(t)=>setCaptchaToken(t)}
          />

          <button className="w-full bg-orange-500 py-3 rounded hover:bg-orange-600">
            Continue
          </button>

        </form>
      )}

      {step==="otp" && (
        <form onSubmit={handleVerify} className="space-y-4">

          <input
            value={otp}
            onChange={(e)=>setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full p-3 text-center bg-black/40 rounded"
          />

          <button className="w-full bg-green-600 py-3 rounded">
            Verify
          </button>

        </form>
      )}

    </div>

  </div>

</div>

<style jsx global>{`
@keyframes ticker {
  0% { transform: translateX(100%) }
  100% { transform: translateX(-100%) }
}
`}</style>

</div>
  )
}