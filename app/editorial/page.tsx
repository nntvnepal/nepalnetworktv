import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export const revalidate = 0;
type Editorial = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  images: string[];
};

async function getEditorials(): Promise<Editorial[]> {
  return await prisma.article.findMany({
    where: {
      isEditorial: true,
      status: "approved",
      isDeleted: false,
    },
    orderBy: {
      publishedAt: "desc",
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      images: true,
    },
  });
}

export default async function EditorialPage() {
  const editorials = await getEditorials();

  if (!editorials.length) {
    return (
      <main className="max-w-6xl mx-auto px-4 lg:px-6 py-24">
        <h1 className="font-serif text-5xl font-semibold mb-6">Editorial</h1>
        <p className="text-gray-500">No editorials published yet.</p>
      </main>
    );
  }

  const lead = editorials[0];
  const rest = editorials.slice(1);

  return (
    <main className="max-w-6xl mx-auto px-4 lg:px-6 py-24 text-gray-900 dark:text-gray-100">

      {/* ===== HEADER ===== */}
      <header className="mb-20">
        <p className="text-xs uppercase tracking-[0.35em] text-gray-500 mb-5">
          Opinion
        </p>
        <h1 className="font-serif text-5xl md:text-6xl font-semibold tracking-tight">
          Editorial
        </h1>
      </header>

      {/* ===== LEAD EDITORIAL ===== */}
      <section className="border-b border-gray-300 dark:border-neutral-700 pb-20 mb-20">
        <div className="grid lg:grid-cols-12 gap-14 items-start">

          {/* TEXT */}
          <div className="lg:col-span-7">
            <Link href={`/editorial/${lead.slug}`}>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold leading-tight hover:underline">
                {lead.title}
              </h2>
            </Link>

            {lead.excerpt && (
              <p className="mt-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-xl">
                {lead.excerpt}
              </p>
            )}
          </div>

          {/* IMAGE */}
          {lead.images?.[0] && (
            <div className="lg:col-span-5">
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={lead.images[0]}
                  alt={lead.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ===== SECONDARY GRID ===== */}
      <section className="grid md:grid-cols-2 gap-x-16 gap-y-16">
        {rest.map((item, index) => (
          <article
            key={item.id}
            className={`
              ${index % 2 === 0
                ? "md:pr-8"
                : "md:pl-8 md:border-l md:border-gray-300 md:dark:border-neutral-700"}
            `}
          >
            <Link href={`/editorial/${item.slug}`}>
              <h3 className="font-serif text-2xl font-semibold leading-snug hover:underline">
                {item.title}
              </h3>
            </Link>

            {item.excerpt && (
              <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed max-w-md">
                {item.excerpt}
              </p>
            )}
          </article>
        ))}
      </section>

      {/* ===== LOAD MORE (Future Pagination) ===== */}
      <div className="mt-28 pt-10 border-t border-gray-300 dark:border-neutral-700 text-center">
        <button className="text-sm uppercase tracking-[0.25em] text-gray-600 dark:text-gray-400 hover:underline">
          Load More
        </button>
      </div>

    </main>
  );
}