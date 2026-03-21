import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/getCurrentUser"
import EditUserForm from "@/components/admin/EditUserForm"

export const dynamic = "force-dynamic"
export const revalidate = 0

const ROLE_LEVEL:any = {
  super_admin: 7,
  admin: 6,
  tv_admin: 5,
  editor: 4,
  tv_operator: 3,
  reporter: 2,
  advertiser: 1,
}

function canManage(currentRole:string, targetRole:string){
  return ROLE_LEVEL[currentRole] > ROLE_LEVEL[targetRole]
}

type Params = {
  params: { id: string }
}

export default async function EditUserPage({ params }: Params) {

  //////////////////////////////////////////////////////
  // AUTH
  //////////////////////////////////////////////////////

  const currentUser = await getCurrentUser()
  if (!currentUser) redirect("/login")

  //////////////////////////////////////////////////////
  // USER FETCH
  //////////////////////////////////////////////////////

  const user = await prisma.user.findUnique({
    where: { id: params.id },
  })

  if (!user) redirect("/admin/user")

  //////////////////////////////////////////////////////
  // 🔥 HIERARCHY PROTECTION
  //////////////////////////////////////////////////////

  if (!canManage(currentUser.role, user.role)) {
    redirect("/admin/user")
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a002f] via-[#2b0045] to-[#0b001a] p-10 text-white space-y-6">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">Edit User</h1>
          <p className="text-purple-300 text-sm">
            Manage user account details
          </p>
        </div>

        <a href="/admin/user" className="bg-white/10 px-4 py-2 rounded hover:bg-white/20">
          ← Back
        </a>

      </div>

      <div className="bg-purple-900/30 p-5 rounded space-y-2 text-sm">

        <div><span className="text-purple-300">Name:</span> {user.name}</div>
        <div><span className="text-purple-300">Email:</span> {user.email}</div>
        <div><span className="text-purple-300">Role:</span> {user.role}</div>
        <div>
          <span className="text-purple-300">Status:</span>{" "}
          <span className={user.isActive ? "text-green-400" : "text-red-400"}>
            {user.isActive ? "Active" : "Inactive"}
          </span>
        </div>

      </div>

      <EditUserForm currentUser={currentUser} user={user} />

    </div>
  )
}