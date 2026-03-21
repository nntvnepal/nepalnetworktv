"use client"

import { useEffect, useState, useCallback } from "react"

type Application = {
  id:string
  name:string
  email:string
  phone:string
  role:string
  status:string
  resumeUrl?:string
  createdAt:string
}

export default function ApplicationsPage(){

  const [apps,setApps] = useState<Application[]>([])
  const [loading,setLoading] = useState(true)
  const [selected,setSelected] = useState<Application | null>(null)
  const [updating,setUpdating] = useState(false)

  // NEW
  const [filter,setFilter] = useState("all")
  const [search,setSearch] = useState("")
  const [toast,setToast] = useState<string | null>(null)

  //////////////////////////////////////////////////////
  // FETCH
  //////////////////////////////////////////////////////

  const fetchApps = useCallback(async ()=>{
    try{
      setLoading(true)
      const res = await fetch("/api/applications",{ cache:"no-store" })
      const data = await res.json()
      setApps(data?.applications || [])
    }catch(err){
      console.error(err)
      setApps([])
    }finally{
      setLoading(false)
    }
  },[])

  useEffect(()=>{
    fetchApps()
  },[fetchApps])

  //////////////////////////////////////////////////////
  // STATUS UPDATE (NO RELOAD ⚡)
  //////////////////////////////////////////////////////

  async function updateStatus(id:string,status:string){
    try{
      setUpdating(true)

      const res = await fetch("/api/applications",{
        method:"PUT",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ id,status })
      })

      if(!res.ok) throw new Error()

      // instant UI update
      setApps(prev =>
        prev.map(a => a.id===id ? {...a,status} : a)
      )

      setSelected(null)
      showToast(`Application ${status}`)

    }catch{
      showToast("Update failed")
    }finally{
      setUpdating(false)
    }
  }

  //////////////////////////////////////////////////////
  // TOAST 🔔
  //////////////////////////////////////////////////////

  function showToast(msg:string){
    setToast(msg)
    setTimeout(()=>setToast(null),2000)
  }

  //////////////////////////////////////////////////////
  // FILTER + SEARCH
  //////////////////////////////////////////////////////

  const filteredApps = apps.filter(app=>{
    const matchFilter = filter==="all" || app.status===filter
    const matchSearch =
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  //////////////////////////////////////////////////////
  // STATS
  //////////////////////////////////////////////////////

  const stats = apps.reduce((acc,app)=>{
    acc.total++
    if(app.status==="pending") acc.pending++
    if(app.status==="approved") acc.approved++
    if(app.status==="rejected") acc.rejected++
    return acc
  },{
    total:0,
    pending:0,
    approved:0,
    rejected:0
  })

  //////////////////////////////////////////////////////
  // BADGE
  //////////////////////////////////////////////////////

  function badge(status:string){
    switch(status){
      case "pending": return "px-3 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400"
      case "approved": return "px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400"
      case "rejected": return "px-3 py-1 text-xs rounded-full bg-red-500/20 text-red-400"
      default: return "px-3 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400"
    }
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return(

    <div className="space-y-6 text-white p-4">

      {/* TOAST */}
      {toast && (
        <div className="fixed top-5 right-5 bg-black border border-gray-700 px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}

      <h1 className="text-3xl font-bold">Applications</h1>

      {/* FILTER + SEARCH */}
      <div className="flex flex-wrap gap-3 items-center">

        <input
          placeholder="Search name/email..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="p-2 bg-[#0e1726] border border-gray-700 rounded"
        />

        {["all","pending","approved","rejected"].map(f=>(
          <button
            key={f}
            onClick={()=>setFilter(f)}
            className={`px-3 py-1 rounded ${
              filter===f ? "bg-purple-600" : "bg-gray-800"
            }`}
          >
            {f}
          </button>
        ))}

      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total" value={stats.total}/>
        <StatCard title="Pending" value={stats.pending} color="text-yellow-400"/>
        <StatCard title="Approved" value={stats.approved} color="text-green-400"/>
        <StatCard title="Rejected" value={stats.rejected} color="text-red-400"/>
      </div>

      {/* TABLE */}
      <div className="bg-[#0e1726] border border-gray-800 rounded-xl p-6">

        {loading ? (
          <p>Loading...</p>
        ) : filteredApps.length === 0 ? (
          <p>No data</p>
        ) : (

          <table className="w-full">

            <thead>
              <tr className="border-b border-gray-700 text-left">
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Date</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredApps.map(app=>(

                <tr key={app.id} className="border-b border-gray-800 hover:bg-[#111827]">

                  <td>{app.name}</td>
                  <td>{app.email}</td>
                  <td>{app.role}</td>

                  <td>
                    <span className={badge(app.status)}>
                      {app.status}
                    </span>
                  </td>

                  <td>
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>

                  <td className="text-right">
                    <button
                      onClick={()=>setSelected(app)}
                      className="text-blue-400"
                    >
                      View
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

      {/* MODAL */}
      {selected && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">

          <div className="bg-[#0e1726] p-6 rounded-xl w-full max-w-lg space-y-4">

            <h2 className="text-xl font-bold">Application Details</h2>

            <p><b>Name:</b> {selected.name}</p>
            <p><b>Email:</b> {selected.email}</p>
            <p><b>Phone:</b> {selected.phone}</p>
            <p><b>Role:</b> {selected.role}</p>
            <p><b>Status:</b> {selected.status}</p>

            {selected.resumeUrl && (
              <a
                href={selected.resumeUrl}
                target="_blank"
                className="text-blue-400 underline"
              >
                Open Resume
              </a>
            )}

            <div className="flex justify-between pt-4">

              <button
                disabled={updating}
                onClick={()=>updateStatus(selected.id,"approved")}
                className="bg-green-600 px-4 py-2 rounded"
              >
                Approve
              </button>

              <button
                disabled={updating}
                onClick={()=>updateStatus(selected.id,"rejected")}
                className="bg-red-600 px-4 py-2 rounded"
              >
                Reject
              </button>

              <button
                onClick={()=>setSelected(null)}
                className="bg-gray-700 px-4 py-2 rounded"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  )
}

function StatCard({title,value,color}:{title:string,value:number,color?:string}){
  return(
    <div className="bg-[#0e1726] border border-gray-800 rounded-xl p-5">
      <p className="text-gray-400 text-xs">{title}</p>
      <h2 className={`text-2xl font-bold ${color || ""}`}>
        {value}
      </h2>
    </div>
  )
}