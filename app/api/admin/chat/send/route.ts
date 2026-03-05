import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { senderId, receiverId, message } = body;

    if (!senderId || !receiverId || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newMessage = await prisma.chatMessage.create({
      data: {
        senderId: String(senderId),
        receiverId: String(receiverId),
        message: String(message),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: newMessage,
    });

  } catch (error) {
    console.error("Chat send error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send message",
      },
      { status: 500 }
    );
  }
}