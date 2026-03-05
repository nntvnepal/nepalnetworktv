import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {

  try {

    const baseUrl = "https://www.nationpathindia.com";

    const articles = await prisma.article.findMany({
      where: {
        status: "approved",
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
      include: {
        category: true,
      },
    });

    const rssItems = articles
      .map((article) => {

        const url = `${baseUrl}/${article.category?.slug}/${article.slug}`;
        const image = article.images?.[0] || "";

        return `
        <item>
          <title><![CDATA[${article.title}]]></title>
          <link>${url}</link>
          <guid isPermaLink="true">${url}</guid>
          <pubDate>${new Date(article.createdAt).toUTCString()}</pubDate>
          <description><![CDATA[${article.excerpt || article.title}]]></description>
          ${
            image
              ? `<enclosure url="${image}" type="image/jpeg" />`
              : ""
          }
        </item>
        `;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0"
      xmlns:atom="http://www.w3.org/2005/Atom"
      xmlns:media="http://search.yahoo.com/mrss/">

      <channel>

        <title>Nation Path</title>

        <link>${baseUrl}</link>

        <description>
          Latest breaking news, political insights, defence analysis and global affairs from Nation Path.
        </description>

        <language>en-IN</language>

        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>

        <atom:link
          href="${baseUrl}/rss.xml"
          rel="self"
          type="application/rss+xml"
        />

        ${rssItems}

      </channel>

    </rss>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });

  } catch (error) {

    console.error("RSS ERROR:", error);

    return new Response("Error generating RSS", {
      status: 500,
    });

  }

}