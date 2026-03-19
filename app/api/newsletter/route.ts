import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

//////////////////////////////////////////////////////
// GET NEWSLETTER SUBSCRIBERS (ADMIN DASHBOARD)
//////////////////////////////////////////////////////

export async function GET() {

try {


const subs = await prisma.newsletterSubscriber.findMany({
  orderBy: {
    createdAt: "desc"
  }
});

return NextResponse.json(subs);


} catch (error) {

console.error("NEWSLETTER FETCH ERROR:", error);

return NextResponse.json(
  { success:false, message:"Failed to load subscribers"},
  { status:500 }
);


}

}

//////////////////////////////////////////////////////
// POST NEWSLETTER SUBSCRIBE (FOOTER FORM)
//////////////////////////////////////////////////////

export async function POST(req: Request) {

try {

let body;

try {
  body = await req.json();
} catch {
  return NextResponse.json(
    { success: false, message: "Invalid request body" },
    { status: 400 }
  );
}

const email = body?.email?.toLowerCase().trim();

if (!email) {
  return NextResponse.json(
    { success: false, message: "Email required" },
    { status: 400 }
  );
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return NextResponse.json(
    { success: false, message: "Invalid email address" },
    { status: 400 }
  );
}

const existing =
  await prisma.newsletterSubscriber.findUnique({
    where: { email }
  });

if (existing) {

  return NextResponse.json({
    success: true,
    message: "Already subscribed"
  });

}

await prisma.newsletterSubscriber.create({
  data: { email }
});

return NextResponse.json({
  success: true,
  message: "Subscribed successfully"
});


} catch (error) {


console.error("NEWSLETTER API ERROR:", error);

return NextResponse.json(
  { success: false, message: "Server error" },
  { status: 500 }
);


}

}
