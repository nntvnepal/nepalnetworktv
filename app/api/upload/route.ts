import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {

  try {

    /* ================= READ FORM DATA ================= */

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    /* ================= FILE VALIDATION ================= */

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg"
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Invalid file type" },
        { status: 400 }
      );
    }

    /* ================= SIZE LIMIT (5MB) ================= */

    const MAX_SIZE = 5 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "File too large (max 5MB)" },
        { status: 400 }
      );
    }

    /* ================= CONVERT TO BUFFER ================= */

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    /* ================= CREATE UPLOAD DIR ================= */

    const uploadDir = path.join(process.cwd(), "public/uploads");

    await fs.mkdir(uploadDir, { recursive: true });

    /* ================= SAFE FILE NAME ================= */

    const ext = file.name.split(".").pop();
    const filename =
      `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${ext}`;

    const filePath = path.join(uploadDir, filename);

    /* ================= SAVE FILE ================= */

    await fs.writeFile(filePath, buffer);

    /* ================= RESPONSE ================= */

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`
    });

  } catch (error) {

    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Upload failed"
      },
      { status: 500 }
    );

  }

}