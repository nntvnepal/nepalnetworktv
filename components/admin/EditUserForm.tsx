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
  avatar?: string | null
}

type Props = {
  currentUser: UserType
  user: UserType
}

export default function EditUserForm({ currentUser, user }: Props) {

  const router = useRouter()

  //////////////////////////////////////////////////////
  // STATE
  //////////////////////////////////////////////////////

  const [name, setName] = useState<string>(user.name || "")
  const [email, setEmail] = useState<string>(user.email || "")
  const [role, setRole] = useState<Role>(user.role)
  const [isActive, setIsActive] = useState<boolean>(user.isActive)
  const [loading, setLoading] = useState(false)

  //////////////////////////////////////////////////////
  // SUBMIT
  //////////////////////////////////////////////////////

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      setLoading(true)

      const res = await fetch(`/api/users/${user.id}`, {
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

      if (!res.ok) {
        throw new Error("Failed to update user")
      }

      alert("User updated successfully")

      router.push("/admin/user")
      router.refresh()

    } catch (err) {
      console.error(err)
      alert("Update failed")
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
          required
          className="w-full px-4 py-2 bg-purple-900 border border-purple-700 rounded text-white"
        />
      </div>

      {/* EMAIL */}
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 bg-purple-900 border border-purple-700 rounded text-white"
        />
      </div>

      {/* ROLE */}
      <div>
        <label className="block text-sm mb-1">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="w-full px-4 py-2 bg-purple-900 border border-purple-700 rounded text-white"
        >
          {Object.values(Role).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* STATUS */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isActive}
          disabled={currentUser.id === user.id} // 🔥 self-disable protection
          onChange={(e) => setIsActive(e.target.checked)}
        />
        <label>Active</label>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4">

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        >
          {loading ? "Saving..." : "Update User"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-600 px-4 py-2 rounded text-white"
        >
          Cancel
        </button>

      </div>

      {/* FOOTER INFO */}
      <div className="text-xs text-purple-300">
        Logged in as: {currentUser.name}
      </div>

    </form>
  )
}