"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"

type User = {
  id:string
  name:string | null
  email:string
  role:string
  isActive:boolean
  createdAt:string
  isVerified?:boolean
}

//////////////////////////////////////////////////////
// 🔥 ROLE HELPER
//////////////////////////////////////////////////////

const ROLE_LEVEL:any = {
  super_admin: 7,
  admin: 6,
  tv_admin: 5,
  editor: 4,
  tv_operator: 3,
  reporter: 2,
  advertiser: 1
}

function canManage(currentRole:string, targetRole:string){
  return ROLE_LEVEL[currentRole] > ROLE_LEVEL[targetRole]
}

export default function UsersPage(){

  const [users,setUsers] = useState<User[]>([])
  const [currentUser,setCurrentUser] = useState<any>(null)
  const [search,setSearch] = useState("")
  const [loading,setLoading] = useState(true)
  const [page,setPage] = useState(1)

  const USERS_PER_PAGE = 10

  useEffect(()=>{
    fetchUsers()
    fetchMe()
  },[])

  async function fetchMe(){
    const res = await fetch("/api/auth/me",{cache:"no-store"})
    const data = await res.json()
    setCurrentUser(data.user)
  }

  async function fetchUsers(){
    try{
      setLoading(true)

      const res = await fetch("/api/users/list",{ cache:"no-store" })
      const data = await res.json()

      if(Array.isArray(data)) setUsers(data)
      else if(Array.isArray(data.users)) setUsers(data.users)
      else setUsers([])

    }catch(e){
      console.error("Users fetch error",e)
      setUsers([])
    }

    setLoading(false)
  }

  //////////////////////////////////////////////////////
  // ACTIONS
  //////////////////////////////////////////////////////

  async function handleReset(id:string){
    if(!confirm("Reset password?")) return

    const res = await fetch("/api/users/reset",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({id})
    })

    const data = await res.json()

    if(data.success){
      alert(`Temp Password: ${data.tempPassword}`)
    }
  }

  async function handleDelete(id:string){
    if(!confirm("Delete this user?")) return

    const res = await fetch(`/api/admin/user/${id}`,{
      method:"DELETE"
    })

    const data = await res.json()

    if(data.success){
      alert("User deleted")
      fetchUsers()
    }
  }

  async function toggleStatus(id:string,isActive:boolean){
    await fetch("/api/users/status",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ id, isActive:!isActive })
    })
    fetchUsers()
  }

  //////////////////////////////////////////////////////
  // FILTER
  //////////////////////////////////////////////////////

  const filteredUsers = users.filter((u)=>{
    const name = u.name?.toLowerCase() || ""
    const email = u.email.toLowerCase()

    return (
      name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase())
    )
  })

  //////////////////////////////////////////////////////
  // PAGINATION
  //////////////////////////////////////////////////////

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE)
  const start = (page-1) * USERS_PER_PAGE
  const paginatedUsers = filteredUsers.slice(start,start+USERS_PER_PAGE)

  //////////////////////////////////////////////////////
  // STATS
  //////////////////////////////////////////////////////

  const stats = {
    total: users.length,
    admin: users.filter(u=>u.role==="admin").length,
    editor: users.filter(u=>u.role==="editor").length,
    reporter: users.filter(u=>u.role==="reporter").length,
    advertiser: users.filter(u=>u.role==="advertiser").length,
    tv_admin: users.filter(u=>u.role==="tv_admin").length,
    tv_operator: users.filter(u=>u.role==="tv_operator").length,
    verified: users.filter(u=>u.isVerified).length
  }

  //////////////////////////////////////////////////////
  // ROLE BADGE
  //////////////////////////////////////////////////////

  function roleBadge(role:string){
    const base="px-3 py-1 text-xs rounded-full font-medium capitalize "
    const map:any = {
      super_admin:"bg-red-500/20 text-red-400",
      admin:"bg-orange-500/20 text-orange-400",
      editor:"bg-blue-500/20 text-blue-400",
      reporter:"bg-green-500/20 text-green-400",
      advertiser:"bg-purple-500/20 text-purple-400",
      tv_admin:"bg-pink-500/20 text-pink-400",
      tv_operator:"bg-cyan-500/20 text-cyan-400"
    }
    return base + (map[role] || "bg-gray-500/20 text-gray-400")
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return(

    <div className="space-y-10 text-white">

      <div className="flex justify-between items-center flex-wrap gap-3">

        <h1 className="text-3xl font-bold">
          User Management
        </h1>

        <div className="space-x-3">

          <a
            href="/admin/user/create"
            className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded text-white font-semibold"
          >
            + Create User
          </a>

          <button
            onClick={fetchUsers}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
          >
            Refresh
          </button>

        </div>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">

        <StatCard title="Total" value={stats.total}/>
        <StatCard title="Admins" value={stats.admin} color="text-orange-400"/>
        <StatCard title="Editors" value={stats.editor} color="text-blue-400"/>
        <StatCard title="Reporters" value={stats.reporter} color="text-green-400"/>
        <StatCard title="Advertisers" value={stats.advertiser} color="text-purple-400"/>
        <StatCard title="TV Admin" value={stats.tv_admin} color="text-pink-400"/>
        <StatCard title="TV Ops" value={stats.tv_operator} color="text-cyan-400"/>
        <StatCard title="Verified" value={stats.verified} color="text-green-400"/>

      </div>

      <input
        placeholder="Search name / email..."
        value={search}
        onChange={(e)=>{
          setSearch(e.target.value)
          setPage(1)
        }}
        className="w-full p-3 bg-[#0e1726] border border-gray-700 rounded"
      />

      <div className="bg-[#0e1726] border border-gray-800 rounded-xl p-6 overflow-x-auto">

        {loading ? (
          <p className="opacity-60">Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="opacity-60">No users found</p>
        ) : (

          <>
            <table className="w-full text-left">

              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3">Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Verified</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>

                {paginatedUsers.map(user=>(

                  <tr key={user.id} className="border-b border-gray-800 hover:bg-[#111827]">

                    <td className="py-3">{user.name || "-"}</td>

                    <td>{user.email}</td>

                    <td>
                      <span className={roleBadge(user.role)}>
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <span className={`text-xs px-2 py-1 rounded ${
                        user.isVerified
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {user.isVerified ? "Verified" : "Pending"}
                      </span>
                    </td>

                    <td>
                      {currentUser && canManage(currentUser.role, user.role) ? (
                        <button
                          onClick={()=>toggleStatus(user.id,user.isActive)}
                          className={`px-3 py-1 rounded text-xs ${
                            user.isActive
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {user.isActive ? "Active" : "Suspended"}
                        </button>
                      ) : (
                        <span className="text-xs opacity-50">
                          {user.isActive ? "Active" : "Suspended"}
                        </span>
                      )}
                    </td>

                    <td>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="text-right space-x-4">

                      {currentUser && canManage(currentUser.role, user.role) && (
                        <>
                          {(currentUser.role === "admin" || currentUser.role === "super_admin") && (
                            <button
                              onClick={()=>handleReset(user.id)}
                              className="text-blue-400 hover:text-blue-500 text-sm"
                            >
                              Reset
                            </button>
                          )}

                          <button
                            onClick={()=>handleDelete(user.id)}
                            className="text-red-400 hover:text-red-500 text-sm"
                          >
                            Delete
                          </button>
                        </>
                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            <div className="flex justify-center gap-3 mt-6">

              <button
                disabled={page===1}
                onClick={()=>setPage(p=>p-1)}
                className="px-4 py-2 bg-gray-700 rounded disabled:opacity-40"
              >
                Prev
              </button>

              <span className="px-4 py-2">
                Page {page} / {totalPages || 1}
              </span>

              <button
                disabled={page===totalPages}
                onClick={()=>setPage(p=>p+1)}
                className="px-4 py-2 bg-gray-700 rounded disabled:opacity-40"
              >
                Next
              </button>

            </div>

          </>
        )}

      </div>

    </div>

  )
}

function StatCard({title,value,color}:{title:string,value:number,color?:string}){
  return(
    <div className="bg-[#0e1726] border border-gray-800 rounded-xl p-5">
      <p className="text-gray-400 text-xs">{title}</p>
      <h2 className={`text-2xl font-bold ${color || ""}`}>{value}</h2>
    </div>
  )
}