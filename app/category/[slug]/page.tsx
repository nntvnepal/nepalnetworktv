import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AdRenderer from "@/components/AdRenderer";
export const dynamic = "force-dynamic";
export const revalidate = 0;
interface Props {
  params: { slug: string };
}

/* ================= SEO METADATA ================= */

export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    return { title: "Nation Path" };
  }

  const url = `https://www.nationpathindia.com/category/${category.slug}`;

  return {
    title: `${category.name} News, Breaking & Analysis | Nation Path`,
    description:
      `Latest ${category.name} news, updates, expert analysis and breaking stories from Nation Path.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${category.name} News | Nation Path`,
      description:
        `Latest ${category.name} news, updates and in-depth coverage.`,
      url,
      siteName: "Nation Path",
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} News | Nation Path`,
      description:
        `Latest ${category.name} news, updates and expert analysis.`,
    },
  };
}

/* ================= PAGE ================= */

export default async function CategoryPage({ params }: Props) {

  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) return notFound();

  const articles = await prisma.article.findMany({
    where: {
      categoryId: category.id,
      status: "approved",
      isDeleted: false,
      isAstrology: false,
    },
    orderBy: { createdAt: "desc" },
  });

  const categoryUrl = `https://www.nationpathindia.com/category/${category.slug}`;

  /* ================= STRUCTURED DATA ================= */

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} News`,
    url: categoryUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.nationpathindia.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.name,
        item: categoryUrl,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* CATEGORY HEADER */}
      <h1 className="text-5xl font-serif mb-4">
        {category.name}
      </h1>

      <p className="text-gray-600 mb-10 max-w-2xl">
        Latest {category.name} news, expert insights, breaking developments
        and in-depth analysis from Nation Path.
      </p>

      {/* TOP AD */}
      <div className="flex justify-center mb-10">
        <AdRenderer placement="category_top" />
      </div>

      <hr className="mb-10" />

      {/* CONTENT + SIDEBAR */}
      <div className="grid lg:grid-cols-4 gap-12">

        {/* ARTICLES */}
        <div className="lg:col-span-3">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

            {articles.map((article, index) => (
              <div key={article.id}>

                <Link
                  href={`/${category.slug}/${article.slug}`}
                  className="group"
                >

                  {article.images?.[0] && (
                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={article.images[0]}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                      />
                    </div>
                  )}

                  <h2 className="text-xl font-medium group-hover:text-[#0b2a6f]">
                    {article.title}
                  </h2>

                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(article.createdAt).toLocaleDateString("en-IN")}
                  </p>

                </Link>

                {/* AFTER 3 POSTS AD */}
                {index === 2 && (
                  <div className="my-12 flex justify-center">
                    <AdRenderer placement="category_after_3_posts" />
                  </div>
                )}

              </div>
            ))}

          </div>

        </div>

        {/* SIDEBAR */}
        <aside className="space-y-10">

          <div className="flex justify-center">
            <AdRenderer placement="category_sidebar" />
          </div>

        </aside>

      </div>

      {/* BOTTOM AD */}
      <div className="flex justify-center mt-16">
        <AdRenderer placement="category_bottom" />
      </div>

    </div>
  );
}