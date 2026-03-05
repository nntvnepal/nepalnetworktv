import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditForm from "./EditForm";

export default async function EditAdPage({
  params,
}: {
  params: { id: string };
}) {
  const ad = await prisma.ad.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!ad) {
    notFound();
  }

  return (
    <div className="p-10 text-white">
      <h1 className="text-2xl font-bold mb-6">Edit Ad</h1>
      <EditForm ad={ad} />
    </div>
  );
}