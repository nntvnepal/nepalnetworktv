"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function ElectionLayout({
  children,
}:{
  children: React.ReactNode
}){

const pathname = usePathname()

const tabs = [

{ name:"Dashboard", href:"/admin/elections" },
{ name:"Geography", href:"/admin/elections/geography" },
{ name:"Parties", href:"/admin/elections/parties" },
{ name:"Candidates", href:"/admin/elections/candidates" },
{ name:"Seats", href:"/admin/elections/seats" },
{ name:"Vote Entry", href:"/admin/elections/vote-entry" },
{ name:"Results", href:"/admin/elections/results" },
{ name:"Vote Shares", href:"/admin/elections/vote-shares" },
{ name:"Key Battles", href:"/admin/elections/key-battles" },
{ name:"Map View", href:"/admin/elections/map" }

]

function isActive(href:string){

if(href === "/admin/elections"){
  return pathname === "/admin/elections"
}

return pathname.startsWith(href)

}

return(

<div className="w-full">

{/* TAB BAR */}

<div className="bg-purple-900/70 backdrop-blur border-b border-purple-700">

<div className="flex gap-1 px-4 py-2 overflow-x-auto">

{tabs.map(tab=>{

const active = isActive(tab.href)

return(

<Link
key={tab.name}
href={tab.href}
className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition ${
active
? "bg-gradient-to-r from-[#5a0f5e] to-[#7a1b7f] text-white"
: "text-purple-200 hover:bg-white/10"
}`}
>

{tab.name}

</Link>

)

})}

</div>

</div>

{/* PAGE */}

<div className="min-h-screen bg-gradient-to-br from-[#1b0633] via-[#3b0845] to-[#5a0f5e]">

<div className="px-8 py-8">

{children}

</div>

</div>

</div>

)

}