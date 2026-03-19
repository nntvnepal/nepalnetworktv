import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/getCurrentUser"
import EditUserForm from "@/components/admin/EditUserForm"
import { Role } from "@prisma/client"

export const dynamic = "force-dynamic"
export const revalidate = 0

type Params = {
  params: {
    id: string
  }
}

export default async function EditUserPage({ params }: Params) {

  //////////////////////////////////////////////////////
  // AUTH CHECK
  //////////////////////////////////////////////////////

  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login")
  }

  //////////////////////////////////////////////////////
  // FETCH USER
  //////////////////////////////////////////////////////

  const user = await prisma.user.findUnique({
    where: { id: params.id },
  })

  if (!user) {
    redirect("/admin/user")
  }

  //////////////////////////////////////////////////////
  // ROLE PROTECTION (FIXED ✅)
  //////////////////////////////////////////////////////

  if (currentUser.role !== Role.admin) {
    redirect("/admin")
  }

  //////////////////////////////////////////////////////
  // SELF-PROTECTION (optional 🔥)
  //////////////////////////////////////////////////////

  // Example: prevent editing super admin (optional logic)
  // if (user.role === Role.SUPER_ADMIN && currentUser.id !== user.id) {
  //   redirect("/admin")
  // }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <div className="
      min-h-screen
      bg-gradient-to-br
      from-[#1a002f]
      via-[#2b0045]
      to-[#0b001a]
      p-10
      text-white
      space-y-6
    ">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">
            Edit User
          </h1>

          <p className="text-purple-300 text-sm">
            Manage user account details
          </p>
        </div>

        {/* BACK BUTTON */}
        <a
          href="/admin/user"
          className="bg-white/10 px-4 py-2 rounded hover:bg-white/20"
        >
          ← Back
        </a>

      </div>

      {/* USER INFO CARD */}
      <div className="bg-purple-900/30 p-5 rounded space-y-2 text-sm">

        <div>
          <span className="text-purple-300">Name:</span>{" "}
          <span className="text-white font-semibold">{user.name}</span>
        </div>

        <div>
          <span className="text-purple-300">Email:</span>{" "}
          <span className="text-white">{user.email}</span>
        </div>

        <div>
          <span className="text-purple-300">Role:</span>{" "}
          <span className="text-white">{user.role}</span>
        </div>

        <div>
          <span className="text-purple-300">Status:</span>{" "}
          <span className={`font-semibold ${user.isActive ? "text-green-400" : "text-red-400"}`}>
            {user.isActive ? "Active" : "Inactive"}
          </span>
        </div>

      </div>

      {/* FORM */}
      <EditUserForm
        currentUser={currentUser}
        user={user}
      />

    </div>
  )
}