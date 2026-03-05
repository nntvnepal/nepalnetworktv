import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import ZodiacIcon from "@/components/ZodiacIcon";
export const dynamic = "force-dynamic";
export const revalidate = 0;
interface Props {
  params: { slug: string };
}

/* ================= SEO METADATA ================= */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
  });

  if (!article || !article.isAstrology) {
    return {
      title: "Horoscope | Nation Path",
    };
  }

  const formattedDate = new Date(article.horoscopeDate).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const title = `${article.zodiacSign} Horoscope Today – ${formattedDate} | Nation Path`;

  return {
    title,
    description: `Read today's ${article.zodiacSign} horoscope for ${formattedDate}. Career, love, health, lucky number and daily guidance updated by Nation Path.`,
    alternates: {
      canonical: `https://nationpath.in/astrology/${article.slug}`,
    },
    openGraph: {
      title,
      description: `Today's ${article.zodiacSign} horoscope predictions including love, career, finance and health insights.`,
      url: `https://nationpath.in/astrology/${article.slug}`,
      siteName: "Nation Path",
      type: "article",
    },
  };
}

/* ================= PAGE ================= */

export default async function Page({ params }: Props) {

  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
  });

  if (!article || !article.isAstrology) {
    notFound();
  }

  const formattedDate = new Date(article.horoscopeDate).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const isoDate = article.horoscopeDate
    ? new Date(article.horoscopeDate).toISOString().split("T")[0]
    : "";

  const zodiacSigns = [
    "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
    "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
  ];

  const yesterday = new Date(article.horoscopeDate);
  yesterday.setDate(yesterday.getDate() - 1);

  const tomorrow = new Date(article.horoscopeDate);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const prevSlug = `${article.zodiacSign.toLowerCase()}-${yesterday.toISOString().split("T")[0]}`;
  const nextSlug = `${article.zodiacSign.toLowerCase()}-${tomorrow.toISOString().split("T")[0]}`;

  /* ================= STRUCTURED DATA ================= */

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${article.zodiacSign} Horoscope – ${formattedDate}`,
    description: article.title,
    datePublished: article.horoscopeDate,
    dateModified: article.horoscopeDate,
    author: {
      "@type": "Organization",
      name: "Nation Path Editorial Desk"
    },
    publisher: {
      "@type": "Organization",
      name: "Nation Path",
      logo: {
        "@type": "ImageObject",
        url: "https://nationpath.in/logo.png"
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://nationpath.in/astrology/${article.slug}`
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://nationpath.in"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Daily Horoscope",
        item: "https://nationpath.in/astrology"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${article.zodiacSign} Horoscope`,
        item: `https://nationpath.in/astrology/${article.slug}`
      }
    ]
  };

  return (
    <div className="max-w-3xl mx-auto px-6 pt-6 pb-24">

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* HEADER */}
      <div className="text-center mt-6 mb-10">

        <div className="flex justify-center mb-4">
          <ZodiacIcon sign={article.zodiacSign} />
        </div>

        <h1 className="text-4xl md:text-5xl font-serif capitalize text-[#0b2a6f]">
          {article.zodiacSign} Horoscope
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {formattedDate}
        </p>

        <p className="mt-2 text-xs text-gray-400 tracking-wide">
          Daily Horoscope by Nation Path Editorial Desk
        </p>

        <div className="mt-4 w-12 h-[2px] bg-[#0b2a6f] mx-auto opacity-30"></div>

      </div>

      {/* CONTENT */}
      <div
        className="
          prose prose-lg
          prose-h3:text-[#0b2a6f]
          prose-h3:font-serif
          prose-h3:mt-10
          prose-h3:mb-3
          prose-p:leading-8
          prose-p:text-gray-800
          prose-strong:text-[#0b2a6f]
          max-w-none
        "
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* STYLING FOR INSIGHTS BOX */}
      <style>
        {`
          .prose h3 + ul {
            background: #f8f9fc;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #e6e9f2;
            list-style: none;
          }
          .prose h3 + ul li {
            margin-bottom: 6px;
          }
        `}
      </style>

      {/* PREVIOUS / NEXT */}
      <div className="mt-14 flex justify-between text-sm text-[#0b2a6f] font-medium">

        <Link href={`/astrology/${prevSlug}`}>
          ← Previous Day
        </Link>

        <Link href={`/astrology/${nextSlug}`}>
          Next Day →
        </Link>

      </div>

      {/* EXPLORE OTHER SIGNS */}
      <div className="mt-20 border-t pt-12">

        <h3 className="text-center text-2xl font-serif mb-8 text-[#0b2a6f]">
          Explore Other Signs
        </h3>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
          {zodiacSigns.map((sign) => (
            <Link
              key={sign}
              href={`/astrology/${sign.toLowerCase()}-${isoDate}`}
              className="group text-center p-4 rounded-xl border border-gray-100 hover:shadow-md hover:-translate-y-1 transition"
            >
              <div className="flex justify-center mb-3">
                <ZodiacIcon sign={sign} />
              </div>
              <p className="text-sm capitalize text-gray-700 group-hover:text-[#0b2a6f]">
                {sign}
              </p>
            </Link>
          ))}
        </div>

      </div>

    </div>
  );
}