import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PostStatus } from "@prisma/client";
export const dynamic = "force-dynamic";
export const revalidate = 0;
const zodiacList = [
  "aries","taurus","gemini","cancer","leo","virgo",
  "libra","scorpio","sagittarius","capricorn","aquarius","pisces"
];

export default async function ZodiacEditor({
  params,
}: {
  params: { zodiac: string };
}) {

  const zodiac = params.zodiac.toLowerCase();

  if (!zodiacList.includes(zodiac)) {
    return <div>Invalid Zodiac Sign</div>;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 🔍 Check if today's horoscope already exists
  const existing = await prisma.article.findFirst({
    where: {
      isAstrology: true,
      zodiacSign: zodiac,
      horoscopeDate: today,
      isDeleted: false,
    },
  });

  if (existing) {
    // ✅ Redirect to normal edit page
    redirect(`/admin/posts/edit/${existing.id}`);
  }

  // 🆕 Create new draft automatically
  const title = `${zodiac.toUpperCase()} Horoscope — ${today.toDateString()}`;

  const slug = `${zodiac}-${today
    .toISOString()
    .split("T")[0]}`;

  const newArticle = await prisma.article.create({
    data: {
      title,
      slug,
      content: "",
      images: [],
      isAstrology: true,
      zodiacSign: zodiac,
      horoscopeDate: today,
      status: PostStatus.draft,
      excerpt: "",
    },
  });

  redirect(`/admin/posts/edit/${newArticle.id}`);
}