import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const zodiacSigns = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];

export async function GET(request: Request) {

  try {

    /* 🔐 SECRET PROTECTION */

    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    if (!secret || secret !== process.env.CRON_SECRET) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    /* 📅 TODAY DATE */

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateString = today.toISOString().split("T")[0];

    for (const sign of zodiacSigns) {

      const slug = `${sign.toLowerCase()}-${dateString}`;

      /* 🛑 CHECK DUPLICATE */

      const existing = await prisma.article.findUnique({
        where: { slug }
      });

      if (existing) {
        console.log(`Horoscope already exists for ${sign}`);
        continue;
      }

      /* 🔥 CALL OPENAI */

      const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a professional astrologer writing daily horoscope predictions in a medium, punchy and confident tone."
            },
            {
              role: "user",
              content: `
Write today's detailed horoscope for ${sign}.

Include sections:
- Career
- Love
- Health
- Finance
- Lucky Color
- Lucky Number

Format STRICTLY in clean HTML like:

<h3>Career</h3>
<p>...</p>

<h3>Love</h3>
<p>...</p>

<h3>Health</h3>
<p>...</p>

<h3>Finance</h3>
<p>...</p>

<h3>Lucky Insights</h3>
<ul>
<li><strong>Lucky Color:</strong> ...</li>
<li><strong>Lucky Number:</strong> ...</li>
</ul>

Keep content between 350–450 words.
Do not include markdown.
Only valid HTML.
`
            }
          ],
          temperature: 0.8,
        }),
      });

      const aiData = await aiRes.json();

      if (!aiData?.choices?.[0]?.message?.content) {
        console.error("OpenAI Error:", aiData);
        continue;
      }

      const content = aiData.choices[0].message.content;

      /* 💾 SAVE TO DATABASE */

      await prisma.article.create({
        data: {
          title: `${sign} Horoscope Today`,
          slug,
          content,
          isAstrology: true,
          status: "approved",
          zodiacSign: sign,
          horoscopeDate: today,
          publishedAt: today,
        }
      });

      console.log(`Generated horoscope for ${sign}`);
    }

    return NextResponse.json({
      success: true,
      message: "Horoscope generation completed"
    });

  } catch (error) {

    console.error("CRON ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Generation failed"
      },
      { status: 500 }
    );

  }

}