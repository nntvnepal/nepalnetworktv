import { prisma } from "@/lib/prisma";
import { PostStatus } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export const revalidate = 0;
type Props = {
  params: {
    slug: string;
  };
};

export default async function EditorialArticle({ params }: Props) {
  const article = await prisma.article.findFirst({
    where: {
      slug: params.slug,
      status: PostStatus.approved,
      isDeleted: false, // 🔥 safety
      isEditorial: true, // 🔥 only editorial
    },
  });

  if (!article) return notFound();

  const stripHtml = (html: string) =>
    html?.replace(/<[^>]+>/g, "") || "";

  const paragraphs = stripHtml(article.content)
    .split("\n")
    .filter((p) => p.trim() !== "");

  return (
    <main className="max-w-4xl mx-auto px-4 lg:px-6 py-24 text-gray-900 dark:text-gray-100">

      {/* Editorial Label */}
      <p className="text-xs uppercase tracking-[0.35em] text-red-600 mb-6">
        EDITORIAL
      </p>

      {/* Title */}
      <h1 className="font-serif text-4xl md:text-5xl font-semibold leading-tight mb-10">
        {article.title}
      </h1>

      {/* Lead Image */}
      {article.images?.[0] && (
        <div className="relative w-full aspect-[16/9] mb-14">
          <Image
            src={article.images[0]}
            alt={article.title}
            fill
            priority
            className="object-cover rounded-lg"
          />
        </div>
      )}

      {/* Content */}
      <article className="font-serif text-lg leading-relaxed">

        {paragraphs.length > 0 && (
          <p className="first-letter:text-6xl first-letter:font-semibold first-letter:mr-3 first-letter:float-left first-letter:leading-none">
            {paragraphs[0]}
          </p>
        )}

        <div className="space-y-8 mt-8">
          {paragraphs.slice(1).map((para, index) => (
            <p key={index}>{para}</p>
          ))}
        </div>

      </article>

      {/* Footer */}
      <div className="mt-20 border-t border-gray-300 dark:border-neutral-700 pt-10 text-sm text-gray-500">
        Nation Path Editorial Board
      </div>

      {/* More Editorials */}
      <MoreEditorials currentSlug={article.slug} />

    </main>
  );
}

/* ================= MORE EDITORIALS ================= */

async function MoreEditorials({ currentSlug }: { currentSlug: string }) {
  const more = await prisma.article.findMany({
    where: {
      status: PostStatus.approved,
      isDeleted: false,
      isEditorial: true,
      NOT: { slug: currentSlug },
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  if (!more.length) return null;

  return (
    <section className="mt-24 border-t border-gray-300 dark:border-neutral-700 pt-14">
      <h3 className="text-xs uppercase tracking-[0.3em] text-gray-600 dark:text-gray-400 mb-8">
        More Editorials
      </h3>

      <div className="grid md:grid-cols-2 gap-10">
        {more.map((item) => (
          <Link key={item.id} href={`/editorial/${item.slug}`}>
            <p className="font-serif text-lg leading-snug hover:underline">
              {item.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}