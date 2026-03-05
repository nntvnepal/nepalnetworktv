import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ZodiacIcon from "@/components/ZodiacIcon";
import type { Metadata } from "next";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = {
  title: "Daily Horoscope Today – All Zodiac Signs | Nation Path",
  description:
    "Read today's horoscope predictions for all zodiac signs. Get daily insights into career, love, health, lucky number and compatibility updated every morning in India.",
  alternates: {
    canonical: "https://nationpath.in/astrology",
  },
  openGraph: {
    title: "Daily Horoscope Today – Nation Path",
    description:
      "Today's horoscope predictions for all zodiac signs including career, love, health and finance insights.",
    url: "https://nationpath.in/astrology",
    siteName: "Nation Path",
    type: "website",
  },
};

export default async function AstrologyPage() {

  // 🇮🇳 IST SAFE DATE
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const horoscopes = await prisma.article.findMany({
    where: {
      isAstrology: true,
      status: "approved",
      horoscopeDate: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  const zodiacOrder = [
    "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
    "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
  ];

  horoscopes.sort(
    (a, b) =>
      zodiacOrder.indexOf(a.zodiacSign ?? "") -
      zodiacOrder.indexOf(b.zodiacSign ?? "")
  );

  // 🔥 STRUCTURED DATA
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Daily Horoscope Today",
    "description":
      "Read today's horoscope predictions for all zodiac signs including career, love, health and finance guidance.",
    "url": "https://nationpath.in/astrology",
    "datePublished": today.toISOString(),
    "dateModified": today.toISOString(),
    "publisher": {
      "@type": "Organization",
      "name": "Nation Path",
      "logo": {
        "@type": "ImageObject",
        "url": "https://nationpath.in/logo.png"
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pt-12 pb-24">

      {/* JSON-LD SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* HEADER */}
      <div className="text-center mb-14">

        <h1 className="text-4xl md:text-5xl font-serif text-[#0b2a6f]">
          Daily Horoscope Today
        </h1>

        <p className="mt-4 text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Explore today’s horoscope predictions for all 12 zodiac signs.
          Discover insights into career, love, relationships, health,
          finances and daily lucky guidance updated every morning in India.
        </p>

        <p className="mt-3 text-sm text-gray-500">
          {today.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}
        </p>

        <div className="mt-6 w-16 h-[2px] bg-[#0b2a6f] mx-auto opacity-30"></div>

      </div>

      {/* ZODIAC GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">

        {horoscopes.map((item) => (
          <Link
            key={item.id}
            href={`/astrology/${item.slug}`}
            className="group text-center p-6 rounded-xl border border-gray-100 hover:shadow-md hover:-translate-y-1 transition duration-300"
          >
            <div className="flex justify-center mb-4">
              <ZodiacIcon sign={item.zodiacSign} />
            </div>

            <h3 className="text-lg font-medium text-gray-800 group-hover:text-[#0b2a6f] capitalize">
              {item.zodiacSign}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Read Today →
            </p>

          </Link>
        ))}

      </div>

      {/* SEO CONTENT BLOCK */}
      <div className="mt-24 max-w-3xl mx-auto text-gray-700 leading-relaxed">

        <h2 className="text-2xl font-serif text-[#0b2a6f] mb-4">
          About Daily Horoscope
        </h2>

        <p>
          Daily horoscope predictions offer guidance for each zodiac sign
          based on planetary movements and astrological interpretations.
          Whether you are checking your career outlook, love compatibility,
          financial prospects or health energy, today’s horoscope helps
          you plan your day with greater clarity.
        </p>

        <p className="mt-4">
          Nation Path publishes fresh horoscope updates every morning for
          readers across India. Stay connected to receive accurate daily
          zodiac forecasts and spiritual insights tailored to your sign.
        </p>

      </div>

    </div>
  );
}