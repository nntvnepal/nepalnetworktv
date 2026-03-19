"use client";

import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

type Sub = {
id: string;
email: string;
createdAt: string;
};

export default function NewsletterPage() {

const [subs,setSubs] = useState<Sub[]>([]);
const [search,setSearch] = useState("");
const [loading,setLoading] = useState(true);
const [todayCount,setTodayCount] = useState(0);

useEffect(()=>{
loadSubs();
},[]);

//////////////////////////////////////////////////////
// LOAD SUBSCRIBERS
//////////////////////////////////////////////////////

async function loadSubs(){


try{

  setLoading(true);

  const res = await fetch("/api/newsletter",{
    cache:"no-store"
  });

  const data = await res.json();

  const list:Sub[] = Array.isArray(data) ? data : [];

  setSubs(list);

  /* TODAY COUNT */

  const today = new Date().toDateString();

  const count = list.filter(
    s => new Date(s.createdAt).toDateString() === today
  ).length;

  setTodayCount(count);

}
catch(error){

  console.error("Newsletter load error:",error);
  setSubs([]);

}

setLoading(false);


}

//////////////////////////////////////////////////////
// DELETE SUBSCRIBER
//////////////////////////////////////////////////////

async function deleteSub(id:string){


const confirmDelete = confirm(
  "Delete this subscriber from NNTV newsletter?"
);

if(!confirmDelete) return;

try{

  await fetch("/api/newsletter/delete",{
    method:"DELETE",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({id})
  });

  loadSubs();

}catch(err){

  console.error("Delete error:",err);

}


}

//////////////////////////////////////////////////////
// EXPORT CSV
//////////////////////////////////////////////////////

function exportCSV(){


if(subs.length===0) return;

const rows = subs.map(s =>
  `${s.email},${new Date(s.createdAt).toLocaleDateString()}`
).join("\n");

const blob = new Blob([`email,date\n${rows}`]);

const url = URL.createObjectURL(blob);

const a = document.createElement("a");

a.href = url;
a.download = "nntv-newsletter-subscribers.csv";
a.click();

}

//////////////////////////////////////////////////////
// SEARCH FILTER
//////////////////////////////////////////////////////

const filtered = subs.filter(s =>
s.email.toLowerCase().includes(search.toLowerCase())
);

//////////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////////

return(


<div className="space-y-8 text-white">

  {/* HEADER */}

  <div className="flex justify-between items-center flex-wrap gap-4">

    <div>

      <h1 className="text-2xl font-bold">
        NNTV Newsletter Subscribers
      </h1>

      <p className="text-sm text-gray-400 mt-1">
        Manage Nepal Network Television newsletter audience
      </p>

    </div>

    <div className="flex gap-3">

      <input
        placeholder="Search subscriber email..."
        className="bg-[#0e1726] border border-gray-700 px-3 py-2 rounded text-sm"
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
      />

      <button
        onClick={exportCSV}
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
      >
        Export CSV
      </button>

    </div>

  </div>

  {/* STATS */}

  <div className="grid md:grid-cols-3 gap-4">

    <div className="bg-[#0e1726] border border-gray-800 rounded-xl p-4">

      <p className="text-gray-400 text-sm">
        Total Subscribers
      </p>

      <p className="text-2xl font-bold mt-1">
        {subs.length}
      </p>

    </div>

    <div className="bg-[#0e1726] border border-gray-800 rounded-xl p-4">

      <p className="text-gray-400 text-sm">
        Joined Today
      </p>

      <p className="text-2xl font-bold mt-1">
        {todayCount}
      </p>

    </div>

    <div className="bg-[#0e1726] border border-gray-800 rounded-xl p-4">

      <p className="text-gray-400 text-sm">
        Showing Results
      </p>

      <p className="text-2xl font-bold mt-1">
        {filtered.length}
      </p>

    </div>

  </div>

  {/* TABLE */}

  <div className="bg-[#0e1726] border border-gray-800 rounded-xl overflow-hidden">

    <table className="w-full text-left">

      <thead className="bg-[#111827] text-gray-300 text-sm">

        <tr>
          <th className="p-4">Email</th>
          <th>Joined</th>
          <th>Action</th>
        </tr>

      </thead>

      <tbody>

        {loading ?(

          <tr>
            <td colSpan={3} className="p-6 text-gray-400">
              Loading subscribers...
            </td>
          </tr>

        ):filtered.length===0?(

          <tr>
            <td colSpan={3} className="p-6 text-gray-400">
              No subscribers found
            </td>
          </tr>

        ):(

          filtered.map(sub=>(

            <tr
              key={sub.id}
              className="border-t border-gray-800 hover:bg-[#111827]"
            >

              <td className="p-4">
                {sub.email}
              </td>

              <td>
                {new Date(sub.createdAt).toLocaleDateString("en-GB")}
              </td>

              <td>

                <button
                  onClick={()=>deleteSub(sub.id)}
                  className="text-red-400 hover:text-red-500 text-sm"
                >
                  Delete
                </button>

              </td>

            </tr>

          ))

        )}

      </tbody>

    </table>

  </div>

</div>


);

}
