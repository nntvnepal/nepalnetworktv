"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
};

export default function UsersPage() {

  const [users,setUsers] = useState<User[]>([])
  const [search,setSearch] = useState("")
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    fetchUsers()
  },[])

  async function fetchUsers(){

    setLoading(true)

    const res = await fetch("/api/users/list")
    const data = await res.json()

    setUsers(data)
    setLoading(false)

  }

  async function handleReset(id:string){

    const confirmReset = confirm("Reset password to Nation123 ?")

    if(!confirmReset) return

    await fetch("/api/users/reset",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({id})
    })

    alert("Password reset to Nation123")

  }

  async function handleDelete(id:string){

    const confirmDelete = confirm("Delete this user?")

    if(!confirmDelete) return

    const res = await fetch("/api/users/delete",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({id})
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

  const filteredUsers = users.filter((u)=>

    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())

  )

  const totalUsers = users.length
  const totalAdmins = users.filter(u=>u.role==="admin").length
  const totalEditors = users.filter(u=>u.role==="editor").length
  const totalReporters = users.filter(u=>u.role==="reporter").length
  const totalAdvertisers = users.filter(u=>u.role==="advertiser").length

  function roleBadge(role:string){

    const base = "px-3 py-1 text-xs rounded-full font-medium capitalize "

    switch(role){

      case "admin":
        return base+"bg-orange-500/20 text-orange-400"

      case "editor":
        return base+"bg-blue-500/20 text-blue-400"

      case "reporter":
        return base+"bg-green-500/20 text-green-400"

      case "advertiser":
        return base+"bg-purple-500/20 text-purple-400"

      default:
        return base+"bg-gray-500/20 text-gray-400"

    }

  }

  return(

<div className="space-y-10 text-white">

{/* HEADER */}

<div className="flex justify-between items-center">

<h1 className="text-2xl font-bold">
User Management
</h1>

<div className="space-x-3">

<a
href="/admin/user/create"
className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-white"
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

{/* STATS */}

<div className="grid grid-cols-2 md:grid-cols-5 gap-4">

<StatCard title="Total Users" value={totalUsers} />

<StatCard title="Admins" value={totalAdmins} color="text-orange-400"/>

<StatCard title="Editors" value={totalEditors} color="text-blue-400"/>

<StatCard title="Reporters" value={totalReporters} color="text-green-400"/>

<StatCard title="Advertisers" value={totalAdvertisers} color="text-purple-400"/>

</div>

{/* SEARCH */}

<input
placeholder="Search by name or email..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="w-full p-3 bg-[#0e1726] border border-gray-700 rounded"
/>

{/* TABLE */}

<div className="bg-[#0e1726] border border-gray-800 rounded-xl p-6 overflow-x-auto">

{loading ? (

<p>Loading users...</p>

) : (

<table className="w-full text-left">

<thead>

<tr className="border-b border-gray-700">

<th className="py-3">Name</th>
<th>Email</th>
<th>Role</th>
<th>Status</th>
<th>Created</th>
<th className="text-right">Actions</th>

</tr>

</thead>

<tbody>

{filteredUsers.map(user=>(

<tr
key={user.id}
className="border-b border-gray-800 hover:bg-[#111827]"
>

<td className="py-3">{user.name || "-"}</td>

<td>{user.email}</td>

<td>

<span className={roleBadge(user.role)}>
{user.role}
</span>

</td>

<td>

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

</td>

<td>

{new Date(user.createdAt).toLocaleDateString()}

</td>

<td className="text-right space-x-4">

<button
onClick={()=>handleReset(user.id)}
className="text-blue-400 hover:text-blue-500 text-sm"
>

Reset

</button>

<button
onClick={()=>handleDelete(user.id)}
className="text-red-400 hover:text-red-500 text-sm"
>

Delete

</button>

</td>

</tr>

))}

</tbody>

</table>

)}

</div>

</div>

)

}

function StatCard({
title,
value,
color
}:{title:string,value:number,color?:string}){

return(

<div className="bg-[#0e1726] border border-gray-800 rounded-xl p-6">

<p className="text-gray-400 text-sm">
{title}
</p>

<h2 className={`text-2xl font-bold ${color || ""}`}>
{value}
</h2>

</div>

)

}