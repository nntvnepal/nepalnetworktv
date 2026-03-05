import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
import EditUserForm from "@/components/admin/EditUserForm";
export const dynamic = "force-dynamic";
export const revalidate = 0;
type Params = {
  params: {
    id: string;
  };
};

export default async function EditUserPage({ params }: Params) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!user) {
    redirect("/admin/user");
  }

  return (
    <div className="p-10 text-white">
      <h1 className="text-2xl font-bold mb-6">Edit User</h1>

      <EditUserForm
        currentUser={currentUser}
        user={user}
      />
    </div>
  );
}