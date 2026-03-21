import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/getCurrentUser"
import nodemailer from "nodemailer"

export const dynamic = "force-dynamic"

//////////////////////////////////////////////////////
// MAILER (LAZY + SAFE)
//////////////////////////////////////////////////////

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }
  return transporter
}

//////////////////////////////////////////////////////
// PREMIUM TEMPLATE 🎨
//////////////////////////////////////////////////////

function baseTemplate(title:string,content:string){
  return `
  <div style="font-family:Segoe UI,Arial;background:#0e1726;padding:40px 20px;color:#fff;">
    
    <div style="max-width:600px;margin:auto;background:#111827;padding:30px;border-radius:12px;border:1px solid #1f2937;">
      
      <h2 style="color:#f97316;margin-bottom:8px;">
        NNTV Careers
      </h2>

      <p style="font-size:12px;color:#6b7280;margin-bottom:15px;">
        Hiring & Recruitment System
      </p>

      <h3 style="margin-bottom:15px;">
        ${title}
      </h3>

      <div style="color:#d1d5db;font-size:14px;line-height:1.6;">
        ${content}
      </div>

      <hr style="margin:25px 0;border-color:#1f2937"/>

      <p style="font-size:12px;color:#6b7280;">
        This is an automated message. Please do not reply.
      </p>

    </div>

  </div>
  `
}

//////////////////////////////////////////////////////
// AUTH
//////////////////////////////////////////////////////

async function checkAdmin() {
  const user = await getCurrentUser()

  if (!user) return { ok: false, status: 401 }
  if (!["admin","super_admin","editor"].includes(user.role)) {
    return { ok: false, status: 403 }
  }

  return { ok: true }
}

//////////////////////////////////////////////////////
// CREATE APPLICATION + MAIL
//////////////////////////////////////////////////////

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const name = String(formData.get("name") || "")
    const email = String(formData.get("email") || "")
    const phone = String(formData.get("phone") || "")
    const role = String(formData.get("role") || "")

    const resume = formData.get("resume") as File | null

    if (!name || !email) {
      return NextResponse.json({ success:false },{ status:400 })
    }

    const application = await prisma.application.create({
      data: {
        name,
        email,
        phone,
        role,
        status: "pending",
        resumeUrl: resume ? resume.name : null,
      },
    })

    sendMail(application,"received").catch(()=>{})

    return NextResponse.json({ success:true, application })

  } catch (error) {
    console.error("CREATE ERROR:",error)
    return NextResponse.json({ success:false },{ status:500 })
  }
}

//////////////////////////////////////////////////////
// GET
//////////////////////////////////////////////////////

export async function GET() {
  try {
    const auth = await checkAdmin()
    if (!auth.ok) {
      return NextResponse.json({ success:false },{ status:auth.status })
    }

    const applications = await prisma.application.findMany({
      orderBy:{ createdAt:"desc" }
    })

    return NextResponse.json({ success:true, applications })

  } catch (error){
    console.error("GET ERROR:",error)
    return NextResponse.json({ success:false },{ status:500 })
  }
}

//////////////////////////////////////////////////////
// UPDATE STATUS + MAIL
//////////////////////////////////////////////////////

export async function PUT(req: Request) {
  try {
    const auth = await checkAdmin()
    if (!auth.ok) {
      return NextResponse.json({ success:false },{ status:auth.status })
    }

    const body = await req.json()

    const id = String(body.id || "")
    const status = String(body.status || "").toLowerCase()

    if (!id || !["approved","rejected","pending"].includes(status)) {
      return NextResponse.json({ success:false },{ status:400 })
    }

    const application = await prisma.application.update({
      where:{ id },
      data:{ status }
    })

    sendMail(application,status).catch(()=>{})

    return NextResponse.json({ success:true })

  } catch (error){
    console.error("UPDATE ERROR:",error)
    return NextResponse.json({ success:false },{ status:500 })
  }
}

//////////////////////////////////////////////////////
// MAIL FUNCTION (PREMIUM ✨)
//////////////////////////////////////////////////////

async function sendMail(application:any,status:string){

  const transporter = getTransporter()
  if(!transporter) return

  let subject = ""
  let html = ""

  //////////////////////////////////////////////////////
  // RECEIVED 🚀
  //////////////////////////////////////////////////////

  if(status === "received"){
    subject = "Application Received - NNTV"

    html = baseTemplate(
      "Application Received 🚀",
      `
      <p>Hello <b>${application.name}</b>,</p>

      <p>We’ve successfully received your application for:</p>

      <div style="
        margin:20px 0;
        padding:15px;
        background:#020617;
        border-radius:8px;
        border:1px solid #1f2937;
        text-align:center;
        font-weight:bold;
      ">
        ${application.role.toUpperCase()}
      </div>

      <p>Our team will carefully review your profile.</p>
      <p>You’ll hear from us soon.</p>
      `
    )
  }

  //////////////////////////////////////////////////////
  // APPROVED 🎉
  //////////////////////////////////////////////////////

  if(status === "approved"){
    subject = "You're Shortlisted - NNTV"

    html = baseTemplate(
      "You're Shortlisted 🎉",
      `
      <p>Congratulations <b>${application.name}</b>,</p>

      <p>You’ve been shortlisted for:</p>

      <div style="
        margin:20px 0;
        padding:15px;
        background:linear-gradient(90deg,#16a34a,#22c55e);
        border-radius:8px;
        text-align:center;
        font-weight:bold;
      ">
        ${application.role.toUpperCase()}
      </div>

      <p>Our team will contact you shortly with next steps.</p>
      `
    )
  }

  //////////////////////////////////////////////////////
  // REJECTED ❌
  //////////////////////////////////////////////////////

  if(status === "rejected"){
    subject = "Application Update - NNTV"

    html = baseTemplate(
      "Application Update",
      `
      <p>Hello <b>${application.name}</b>,</p>

      <p>Thank you for applying for:</p>

      <div style="
        margin:20px 0;
        padding:15px;
        background:#020617;
        border-radius:8px;
        border:1px solid #1f2937;
        text-align:center;
        font-weight:bold;
      ">
        ${application.role.toUpperCase()}
      </div>

      <p>We appreciate your time and interest.</p>
      <p>We will not be moving forward at this stage.</p>
      `
    )
  }

  //////////////////////////////////////////////////////
  // SEND
  //////////////////////////////////////////////////////

  await transporter.sendMail({
    to: application.email,
    from: `"NNTV Careers" <${process.env.EMAIL_USER}>`,
    subject,
    html
  })
}