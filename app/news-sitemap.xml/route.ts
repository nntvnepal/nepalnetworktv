import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {

  try {

    const articles = await prisma.article.findMany({
      where: {
        status: "approved",
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
      include: {
        category: true,
      },
    });

    const baseUrl = "https://www.nationpathindia.com";

    const urls = articles
      .map((article) => {

        const url = `${baseUrl}/${article.category?.slug}/${article.slug}`;

        return `
        <url>
          <loc>${url}</loc>
          <news:news>
            <news:publication>
              <news:name>Nation Path</news:name>
              <news:language>en</news:language>
            </news:publication>
            <news:publication_date>${new Date(article.createdAt).toISOString()}</news:publication_date>
            <news:title><![CDATA[${article.title}]]></news:title>
          </news:news>
        </url>
        `;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
      ${urls}
    </urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
      },
    });

  } catch (error) {

    console.error("SITEMAP ERROR:", error);

    return new Response("Error generating sitemap", {
      status: 500,
    });

  }

}