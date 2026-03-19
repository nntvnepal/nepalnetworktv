"use client"

import { useState } from "react"

export default function NewsletterForm(){

const [email,setEmail] = useState("")
const [loading,setLoading] = useState(false)

async function submit(e:any){

e.preventDefault()

setLoading(true)

await fetch("/api/newsletter",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({email})
})

setLoading(false)
setEmail("")
alert("Subscribed successfully")

}

return(

<form
onSubmit={submit}
className="flex gap-2"
>

<input
type="email"
required
placeholder="Enter email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="border px-3 py-2"
/>

<button
disabled={loading}
className="bg-purple-600 text-white px-4 py-2"
>

{loading ? "..." : "Subscribe"}

</button>

</form>

)

}