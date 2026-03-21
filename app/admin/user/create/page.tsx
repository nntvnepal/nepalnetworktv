"use client";

import { useEffect, useState } from "react";

const ROLE_LEVEL:any = {
  super_admin: 7,
  admin: 6,
  tv_admin: 5,
  editor: 4,
  tv_operator: 3,
  reporter: 2,
  advertiser: 1,
}

function canAssign(currentRole:string, targetRole:string){
  return ROLE_LEVEL[currentRole] > ROLE_LEVEL[targetRole]
}

export default function CreateUserPage() {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [currentUser,setCurrentUser] = useState<any>(null)

  useEffect(()=>{
    fetchMe()
  },[])

  async function fetchMe(){
    const res = await fetch("/api/auth/me",{cache:"no-store"})
    const data = await res.json()
    setCurrentUser(data.user)
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const formData = new FormData(e.target);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    };

    try {

      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMessage("✅ User created");
      e.target.reset();

    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }

    setLoading(false);
  }

  //////////////////////////////////////////////////////
  // ROLE OPTIONS FILTER
  //////////////////////////////////////////////////////

  const roles = [
    "admin",
    "editor",
    "reporter",
    "advertiser",
    "tv_admin",
    "tv_operator"
  ]

  const allowedRoles = currentUser
    ? roles.filter(r => canAssign(currentUser.role, r))
    : []

  return (
    <div className="max-w-xl space-y-6">

      <h1 className="text-2xl font-bold">Create User</h1>

      {message && (
        <div className="p-3 rounded bg-black text-white border border-gray-700">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <input name="name" placeholder="Full Name" required className="w-full p-3 bg-white border rounded text-black"/>
        <input name="email" type="email" placeholder="Email" required className="w-full p-3 bg-white border rounded text-black"/>
        <input name="password" type="password" placeholder="Password" required className="w-full p-3 bg-white border rounded text-black"/>

        <select name="role" className="w-full p-3 bg-white border rounded text-black">

          {allowedRoles.map(r=>(
            <option key={r} value={r}>{r}</option>
          ))}

        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 py-3 rounded text-white font-semibold"
        >
          {loading ? "Creating..." : "Create User"}
        </button>

      </form>
    </div>
  );
}