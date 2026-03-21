"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Role } from "@prisma/client"

type UserType = {
  id: string
  name: string
  email: string
  role: Role
  isActive: boolean
  isVerified?: boolean
}

type Props = {
  currentUser: UserType
  user: UserType
}

//////////////////////////////////////////////////////
// 🔥 ROLE HELPER
//////////////////////////////////////////////////////

const ROLE_LEVEL: any = {
  super_admin: 7,
  admin: 6,
  tv_admin: 5,
  editor: 4,
  tv_operator: 3,
  reporter: 2,
  advertiser: 1,
}

function canManage(currentRole: string, targetRole: string) {
  return ROLE_LEVEL[currentRole] > ROLE_LEVEL[targetRole]
}

function canAssign(currentRole: string, targetRole: string) {
  return ROLE_LEVEL[currentRole] > ROLE_LEVEL[targetRole]
}

export default function EditUserForm({ currentUser, user }: Props) {

  const router = useRouter()

  //////////////////////////////////////////////////////
  // STATE
  //////////////////////////////////////////////////////

  const [name, setName] = useState(user.name || "")
  const [email, setEmail] = useState(user.email || "")
  const [role, setRole] = useState<Role>(user.role)
  const [isActive, setIsActive] = useState(user.isActive)
  const [loading, setLoading] = useState(false)

  //////////////////////////////////////////////////////
  // ROLE FILTER 🔥
  //////////////////////////////////////////////////////

  const allowedRoles = Object.values(Role).filter(r =>
    canAssign(currentUser.role, r)
  )

  //////////////////////////////////////////////////////
  // SUBMIT
  //////////////////////////////////////////////////////

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      setLoading(true)

      const res = await fetch(`/api/admin/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          role,
          isActive,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      alert("User updated successfully")

      router.push("/admin/user")
      router.refresh()

    } catch (err: any) {
      alert(err.message || "Update failed")
    } finally {
      setLoading(false)
    }
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-xl bg-purple-900/30 p-6 rounded"
    >

      {/* NAME */}
      <div>
        <label className="block text-sm mb-1">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 bg-purple-900 border border-purple-700 rounded text-white"
        />
      </div>

      {/* EMAIL */}
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 bg-purple-900 border border-purple-700 rounded text-white"
        />
      </div>

      {/* VERIFIED */}
      <div>
        <label className="block text-sm mb-1">Verification</label>
        <div className={`px-3 py-2 rounded text-sm font-medium ${
          user.isVerified
            ? "bg-green-500/20 text-green-400"
            : "bg-yellow-500/20 text-yellow-400"
        }`}>
          {user.isVerified ? "Verified" : "Pending Verification"}
        </div>
      </div>

      {/* ROLE */}
      <div>
        <label className="block text-sm mb-1">Role</label>

        {canManage(currentUser.role, user.role) ? (
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full px-4 py-2 bg-purple-900 border border-purple-700 rounded text-white"
          >
            {allowedRoles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        ) : (
          <div className="px-3 py-2 bg-gray-800 rounded text-sm">
            {user.role}
          </div>
        )}

      </div>

      {/* STATUS */}
      <div className="flex items-center gap-2">
        {canManage(currentUser.role, user.role) ? (
          <>
            <input
              type="checkbox"
              checked={isActive}
              disabled={currentUser.id === user.id}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <label>Active</label>
          </>
        ) : (
          <span className="text-sm opacity-60">
            {user.isActive ? "Active" : "Inactive"}
          </span>
        )}
      </div>

      {/* ACTION */}
      {canManage(currentUser.role, user.role) && (
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 px-4 py-3 rounded text-white font-semibold"
        >
          {loading ? "Saving..." : "Update User"}
        </button>
      )}

    </form>
  )
}