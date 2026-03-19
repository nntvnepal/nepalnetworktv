"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
LayoutDashboard,
FileText,
Folder,
Users,
Megaphone,
Bell,
Search,
ChevronDown,
Menu,
Sparkles,
LogOut,
Zap,
Tv,
BarChart3,
Vote
} from "lucide-react";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function AdminLayout({
children,
}:{
children:React.ReactNode
}){

const pathname = usePathname();
const router = useRouter();
const {data:session} = useSession();

const userName = session?.user?.name || "Admin";

const [collapsed,setCollapsed] = useState(false);
const [openAds,setOpenAds] = useState(true);
const [openTV,setOpenTV] = useState(false);
const [profileOpen,setProfileOpen] = useState(false);

/* NAV ITEMS */

const navItems = [

{ name:"Dashboard", href:"/admin", icon:LayoutDashboard },

{ name:"Categories", href:"/admin/categories", icon:Folder },

{ name:"News Control", href:"/admin/posts", icon:FileText },

{ name:"Breaking News", href:"/admin/breaking", icon:Zap },

{ name:"Horoscope", href:"/admin/astrology", icon:Sparkles },

/* NEW POLL MENU */

{ name:"जनआवाज Poll", href:"/admin/polls", icon:Vote },

{ name:"Reporter Performance", href:"/admin/reporter-performance", icon:BarChart3 },

{ name:"Users", href:"/admin/user", icon:Users },

{ name:"Newsletter", href:"/admin/newsletter", icon:Bell },

];

async function handleLogout(){
await signOut({redirect:false})
router.push("/")
}

/* ACTIVE LOGIC */

function isActiveRoute(href:string){

if(href==="/admin") return pathname==="/admin"

return pathname.startsWith(href)

}

return(

<div className="flex min-h-screen text-white bg-gradient-to-br from-[#1b0633] via-[#3b0845] to-[#5a0f5e]">

{/* SIDEBAR */}

<aside
className={`${collapsed ? "w-20":"w-72"} transition-all duration-300 bg-black/40 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between`}
>

<div>

{/* LOGO */}

<div className="flex items-center justify-between px-6 py-6 border-b border-white/10">

{!collapsed && (
<h2 className="text-xl font-bold tracking-wide">
NNTV Admin
</h2>
)}

<button onClick={()=>setCollapsed(!collapsed)}>
<Menu size={20}/>
</button>

</div>

{/* USER */}

{!collapsed && (

<div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">

<div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ffd700] to-[#caa54b] flex items-center justify-center text-black font-bold">
{userName.charAt(0)}
</div>

<div>
<p className="text-xs text-gray-400">Welcome</p>
<p className="font-semibold">{userName}</p>
</div>

</div>

)}

{/* NAVIGATION */}

<nav className="p-4 space-y-2">

{navItems.map(item=>{

const Icon = item.icon
const active = isActiveRoute(item.href)

return(

<Link
key={item.name}
href={item.href}
className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
active
? "bg-gradient-to-r from-[#5a0f5e] to-[#7a1b7f] text-white shadow-lg"
: "text-gray-300 hover:bg-white/10"
}`}
>

<Icon size={18}/>

{!collapsed && item.name}

</Link>

)

})}

{/* ADS SECTION */}

<div>

<button
onClick={()=>setOpenAds(!openAds)}
className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-white/10"
>

<span className="flex items-center gap-3">
<Megaphone size={18}/>
{!collapsed && "Advertisements"}
</span>

{!collapsed && (
<ChevronDown
size={16}
className={`${openAds ? "rotate-180":""} transition`}
/>
)}

</button>

{!collapsed && openAds && (

<div className="ml-8 mt-2 space-y-2">

<SubItem href="/admin/ads" label="All Ads" pathname={pathname}/>
<SubItem href="/admin/ads/create" label="Create Ad" pathname={pathname}/>

</div>

)}

</div>

{/* TV CONTROL */}

<div className="pt-4 border-t border-white/10">

{!collapsed && (
<p className="px-4 text-xs text-gray-400 mb-2">
TV Control (Limited Access)
</p>
)}

<button
onClick={()=>setOpenTV(!openTV)}
className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-white/10"
>

<span className="flex items-center gap-3">
<Tv size={18}/>
{!collapsed && "TV Control"}
</span>

{!collapsed && (
<ChevronDown
size={16}
className={`${openTV ? "rotate-180":""} transition`}
/>
)}

</button>

{!collapsed && openTV && (

<div className="ml-8 mt-2 space-y-2">

<SubItem href="/admin/tv-control" label="Dashboard" pathname={pathname}/>
<SubItem href="/admin/tv-control/breaking-news" label="Ticker Manager" pathname={pathname}/>
<SubItem href="/admin/tv-control/lower-third" label="Lower Third" pathname={pathname}/>
<SubItem href="/admin/elections" label="Election Control" pathname={pathname}/>
<SubItem href="/admin/tv-control/live-score" label="Live Score" pathname={pathname}/>
<SubItem href="/admin/tv-control/teleprompter" label="Teleprompter" pathname={pathname}/>
<SubItem href="/admin/tv-control/live-tv" label="Live TV" pathname={pathname}/>

</div>

)}

</div>

</nav>

</div>

{/* LOGOUT */}

<div className="p-4 border-t border-white/10">

<button
onClick={handleLogout}
className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600/30 hover:bg-red-600 transition"
>

<LogOut size={18}/>
{!collapsed && "Logout"}

</button>

</div>

</aside>

{/* MAIN CONTENT */}

<div className="flex-1 flex flex-col">

<header className="h-20 px-8 flex items-center justify-between bg-black/30 backdrop-blur-xl border-b border-white/10">

<div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl w-96">

<Search size={16}/>

<input
placeholder="Search..."
className="bg-transparent outline-none text-sm w-full"
/>

</div>

<div className="flex items-center gap-6 relative">

<Bell className="cursor-pointer"/>

<div
onClick={()=>setProfileOpen(!profileOpen)}
className="flex items-center gap-2 cursor-pointer"
>

<div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ffd700] to-[#caa54b] flex items-center justify-center text-black font-bold">
{userName.charAt(0)}
</div>

<ChevronDown size={16}/>

</div>

{profileOpen && (

<div className="absolute right-0 top-14 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 w-48">

<p className="text-sm mb-3">{userName}</p>

<button
onClick={handleLogout}
className="text-red-400 hover:text-white text-sm"
>
Logout
</button>

</div>

)}

</div>

</header>

<main className="flex-1 overflow-x-hidden px-1 py-1">

{children}

<div className="mt-20 text-center text-xs text-gray-400 opacity-70">
Made for NNTV Nepal — DAR GROUP
</div>

</main>

</div>

</div>

)

}

function SubItem({href,label,pathname}:any){

const active = pathname===href

return(

<Link
href={href}
className={`block px-4 py-2 rounded-lg text-sm ${
active
? "bg-[#5a0f5e] text-white"
: "text-gray-300 hover:bg-white/10"
}`}
>

{label}

</Link>

)

}