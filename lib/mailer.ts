import nodemailer from "nodemailer"

//////////////////////////////////////////////////////
// TRANSPORTER (CREATE ONCE)
//////////////////////////////////////////////////////

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password
  },
})

//////////////////////////////////////////////////////
// VERIFY CONNECTION (optional but pro)
//////////////////////////////////////////////////////

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP ERROR:", error)
  } else {
    console.log("✅ SMTP Ready")
  }
})

//////////////////////////////////////////////////////
// SEND OTP EMAIL
//////////////////////////////////////////////////////

export async function sendOTPEmail(email: string, otp: string) {
  try {

    const info = await transporter.sendMail({
      from: `"NNTV Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your NNTV Verification Code",
      html: `
        <div style="font-family:Segoe UI,Arial,sans-serif;background:#0b001a;padding:40px 20px;color:#fff;">
          
          <div style="max-width:500px;margin:auto;background:#1a002f;border-radius:12px;padding:30px;border:1px solid #2b0045;">
            
            <h2 style="margin-bottom:10px;color:#ffffff;">
              🔐 Verify Your Identity
            </h2>

            <p style="color:#c9c9c9;font-size:14px;">
              We received a login request for your NNTV account.
              Use the verification code below to proceed.
            </p>

            <div style="
              margin:30px 0;
              padding:20px;
              text-align:center;
              background:linear-gradient(90deg,#ff7a18,#ff3c00);
              border-radius:10px;
              font-size:32px;
              letter-spacing:6px;
              font-weight:bold;
              color:#ffffff;
            ">
              ${otp}
            </div>

            <p style="color:#c9c9c9;font-size:13px;">
              This code will expire in <b>5 minutes</b>.<br/>
              Do not share this code with anyone.
            </p>

            <hr style="border:none;border-top:1px solid #2b0045;margin:25px 0;" />

            <p style="font-size:12px;color:#888;">
              If you did not request this, you can safely ignore this email.
            </p>

            <p style="font-size:12px;color:#888;margin-top:10px;">
              — NNTV Security Team
            </p>

          </div>

        </div>
      `,
    })

    console.log("✅ OTP Email Sent:", email)
    console.log("📨 Message ID:", info.messageId)

  } catch (error) {
    console.error("❌ EMAIL ERROR:", error)
    throw new Error("Email sending failed") // important for debugging
  }
}