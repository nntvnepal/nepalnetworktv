import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {

    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "info@nntvnepal.com",
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({

      from: `"NNTV Contact Form" <info@nntvnepal.com>`,

      to: "info@nntvnepal.com",

      replyTo: email,

      subject: `NNTV Contact: ${subject || "New Message"}`,

      html: `
        <h2>NNTV Website Contact Message</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || "Not provided"}</p>

        <hr/>

        <p><strong>Message:</strong></p>
        <p>${message}</p>

        <hr/>

        <p style="font-size:12px;color:#777">
        This message was sent from the NNTV website contact form.
        </p>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {

    console.error("Contact API Error:", error);

    return NextResponse.json(
      { success: false, message: "Email sending failed" },
      { status: 500 }
    );
  }
}