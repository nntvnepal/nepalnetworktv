import { prisma } from "@/lib/prisma";
import { PostStatus } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import ZodiacIcon from "@/components/ZodiacIcon";
import AdRenderer from "@/components/AdRenderer";
import ChatWidget from "@/components/ChatWidget";
import TrendingNews from "@/components/home/TrendingNews";
import FlashNewsBar from "@/components/FlashNewsBar";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Nation Path – Breaking News, Editorial & Analysis",
  description:
    "Latest breaking news, politics, defence, world, technology and editorial insights from Nation Path.",
  openGraph: {
    title: "Nation Path",
    description:
      "Latest breaking news and editorial analysis from Nation Path.",
    type: "website",
  },
};

export default async function Home() {

  let articles: any[] = [];
  let mostRead: any[] = [];
  let editorials: any[] = [];
  let horoscopes: any[] = [];

  try {

    articles = await prisma.article.findMany({
      where: {
        status: PostStatus.approved,
        isDeleted: false,
        isEditorial: false,
        isAstrology: false,
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

  } catch (err) {
    console.error("Articles fetch error:", err);
  }

  try {

    mostRead = await prisma.article.findMany({
      where: {
        status: PostStatus.approved,
        isDeleted: false,
      },
      include: { category: true },
      orderBy: { views: "desc" },
      take: 5,
    });

  } catch (err) {
    console.error("MostRead error:", err);
  }

  try {

    editorials = await prisma.article.findMany({
      where: {
        status: PostStatus.approved,
        isDeleted: false,
        isEditorial: true,
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    });

  } catch (err) {
    console.error("Editorial error:", err);
  }

  try {

    horoscopes = await prisma.article.findMany({
      where: {
        status: PostStatus.approved,
        isDeleted: false,
        isAstrology: true,
      },
      take: 12,
    });

  } catch (err) {
    console.error("Horoscope error:", err);
  }

  function cleanText(html: string) {
    if (!html) return "";
    return html
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function articleUrl(article: any) {
    if (!article?.category?.slug) return "#";
    return `/${article.category.slug}/${article.slug}`;
  }

  const hero = articles?.[0] || null;
  const featureGrid = articles?.slice(1, 5) || [];
  const latest = articles?.slice(5, 11) || [];

  const politics =
    articles?.filter((a) => a?.category?.slug === "politics")?.slice(0, 4) || [];

  const defence =
    articles?.filter((a) => a?.category?.slug === "defence")?.slice(0, 4) || [];

  const technology =
    articles?.filter((a) => a?.category?.slug === "technology")?.slice(0, 4) || [];

  return (

    <main className="max-w-7xl mx-auto px-4 lg:px-6 pt-8">

      <ChatWidget />

      {/* TOP AD */}

      <div className="flex justify-center mb-8">
        <AdRenderer placement="homepage_top" />
      </div>

      {/* FLASH NEWS */}

      <FlashNewsBar />

      {/* HERO SECTION */}

      {hero && (

        <section className="grid lg:grid-cols-3 gap-10 pb-12 border-b">

          {/* MAIN STORY */}

          <div className="lg:col-span-2">

            {hero.images?.[0] && (

              <Link href={articleUrl(hero)}>

                <div className="relative aspect-[16/9] rounded-xl overflow-hidden">

                  <Image
                    src={hero.images[0]}
                    alt={hero.title}
                    fill
                    priority
                    className="object-cover"
                  />

                </div>

              </Link>

            )}

            <Link href={articleUrl(hero)}>

              <h1 className="font-serif text-4xl md:text-5xl mt-6 leading-tight hover:text-[#0b2a6f] transition">
                {hero.title}
              </h1>

            </Link>

            <p className="mt-4 text-gray-600 max-w-3xl text-lg leading-relaxed">
              {cleanText(hero.content).slice(0, 220)}...
            </p>

          </div>

          {/* SIDE STORIES */}

          <div className="space-y-6">

            {featureGrid.slice(0, 2).map((article) => (

              <Link key={article.id} href={articleUrl(article)} className="flex gap-4">

                {article.images?.[0] && (

                  <Image
                    src={article.images[0]}
                    alt={article.title}
                    width={120}
                    height={80}
                    className="rounded"
                  />

                )}

                <h3 className="font-semibold hover:text-[#0b2a6f]">
                  {article.title}
                </h3>

              </Link>

            ))}

          </div>

        </section>

      )}

      {/* AFTER HERO AD */}

      <div className="flex justify-center my-10">
        <AdRenderer placement="homepage_after_hero" />
      </div>

      {/* TRENDING */}

      <TrendingNews />

      {/* FEATURE GRID */}

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-b">

        {featureGrid.map((article) => (

          <Link key={article.id} href={articleUrl(article)}>

            <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">

              {article.images?.[0] && (

                <Image
                  src={article.images[0]}
                  alt={article.title}
                  fill
                  className="object-cover hover:scale-105 transition"
                />

              )}

            </div>

            <h3 className="font-serif text-lg hover:text-[#0b2a6f]">
              {article.title}
            </h3>

          </Link>

        ))}

      </section>

      {/* MID AD */}

      <div className="flex justify-center my-10">
        <AdRenderer placement="homepage_mid" />
      </div>

      {/* LATEST + MOST READ */}

      <section className="grid lg:grid-cols-3 gap-12 py-12">

        {/* LATEST */}

        <div className="lg:col-span-2 space-y-8">

          <SectionHeader title="Latest News" />

          {latest.map((article) => (

            <div key={article.id} className="border-b pb-6">

              <Link href={articleUrl(article)}>

                <h3 className="font-serif text-2xl hover:text-[#0b2a6f]">
                  {article.title}
                </h3>

              </Link>

              <p className="text-gray-600 mt-2">
                {cleanText(article.content).slice(0, 150)}...
              </p>

            </div>

          ))}

        </div>

        {/* MOST READ */}

        <div>

          <SectionHeader title="Most Read" />

          {mostRead.map((article, index) => (

            <Link
              key={article.id}
              href={articleUrl(article)}
              className="flex gap-4 border-b pb-5 mb-5 hover:text-[#0b2a6f]"
            >

              <span className="text-3xl font-bold text-gray-200">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h4 className="font-serif">
                {article.title}
              </h4>

            </Link>

          ))}

        </div>

      </section>

      {/* CATEGORY BLOCKS */}

      <CategoryBlock title="Politics" articles={politics} />
      <CategoryBlock title="Defence" articles={defence} />
      <CategoryBlock title="Technology" articles={technology} />

      {/* EDITORIAL */}

      <section className="py-12 border-t">

        <SectionHeader title="Editorial" />

        <div className="grid md:grid-cols-3 gap-8">

          {editorials.map((article) => (

            <Link key={article.id} href={`/editorial/${article.slug}`}>

              <h3 className="font-serif text-lg hover:text-[#0b2a6f]">
                {article.title}
              </h3>

            </Link>

          ))}

        </div>

      </section>

      {/* HOROSCOPE */}

      <section className="py-12 border-t">

        <SectionHeader title="Daily Horoscope" />

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">

          {horoscopes.map((item) => (

            <Link
              key={item.id}
              href={`/astrology/${item.slug}`}
              className="bg-gray-50 rounded-xl p-5 text-center hover:shadow"
            >

              <div className="flex justify-center mb-2">
                <ZodiacIcon sign={item.zodiacSign} />
              </div>

              <p className="text-sm font-medium capitalize">
                {item.zodiacSign}
              </p>

            </Link>

          ))}

        </div>

      </section>

      {/* BOTTOM AD */}

      <div className="flex justify-center my-10">
        <AdRenderer placement="homepage_bottom" />
      </div>

    </main>

  );
}

/* SECTION HEADER */

function SectionHeader({ title }: { title: string }) {

  return (

    <div className="flex items-center mb-8">

      <h2 className="text-sm tracking-[0.35em] font-bold uppercase">
        {title}
      </h2>

      <div className="flex-1 h-px bg-gray-300 ml-6"></div>

    </div>

  );

}

/* CATEGORY BLOCK */

function CategoryBlock({ title, articles }: any) {

  if (!articles?.length) return null;

  return (

    <section className="py-12 border-t">

      <SectionHeader title={title} />

      <div className="grid md:grid-cols-4 gap-8">

        {articles.map((article: any) => (

          <Link
            key={article.id}
            href={`/${article.category?.slug}/${article.slug}`}
          >

            <h3 className="font-serif text-lg hover:text-[#0b2a6f]">
              {article.title}
            </h3>

          </Link>

        ))}

      </div>

    </section>

  );

}