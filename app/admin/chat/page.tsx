"use client"

import { useEffect, useState } from "react"
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default function ChatPage(){

const [users,setUsers] = useState<any[]>([])
const [messages,setMessages] = useState<any[]>([])
const [selectedUser,setSelectedUser] = useState<any>(null)
const [message,setMessage] = useState("")

const currentUser = "69a83f5e50bdb47e60a2c8f8"

useEffect(()=>{

fetch("/api/admin/chat/users")
.then(res=>res.json())
.then(data=>setUsers(data))

},[])

useEffect(()=>{

if(!selectedUser) return

fetch(`/api/admin/chat/messages?sender=${currentUser}&receiver=${selectedUser.id}`)
.then(res=>res.json())
.then(data=>setMessages(data))

},[selectedUser])

async function sendMessage(){

if(!message) return

await fetch("/api/admin/chat/send",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
senderId:currentUser,
receiverId:selectedUser.id,
message
})

})

setMessage("")

fetch(`/api/admin/chat/messages?sender=${currentUser}&receiver=${selectedUser.id}`)
.then(res=>res.json())
.then(data=>setMessages(data))

}

return(

<div className="flex h-[80vh] bg-[#020817] text-white rounded-xl overflow-hidden">

{/* USERS */}

<div className="w-1/4 border-r border-gray-800">

<h2 className="p-4 font-semibold">
Users
</h2>

{users.map(u=>(

<div
key={u.id}
onClick={()=>setSelectedUser(u)}
className="p-4 border-b border-gray-800 cursor-pointer hover:bg-[#0e1726]"
>

{u.name}

</div>

))}

</div>

{/* CHAT WINDOW */}

<div className="flex flex-col flex-1">

<div className="p-4 border-b border-gray-800">

{selectedUser ? selectedUser.name : "Select User"}

</div>

<div className="flex-1 overflow-y-auto p-4 space-y-2">

{messages.map(m=>(

<div key={m.id}>

<span className="text-sm text-gray-400">
{m.sender?.name}
</span>

<div className="bg-[#0e1726] p-2 rounded mt-1">
{m.message}
</div>

</div>

))}

</div>

{selectedUser &&(

<div className="p-4 border-t border-gray-800 flex gap-2">

<input
value={message}
onChange={(e)=>setMessage(e.target.value)}
className="flex-1 bg-[#0e1726] p-2 rounded"
placeholder="Type message"
/>

<button
onClick={sendMessage}
className="bg-orange-500 px-4 rounded"
>
Send
</button>

</div>

)}

</div>

</div>

)

}