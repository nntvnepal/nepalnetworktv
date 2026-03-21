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
  Vote,
  Inbox,
  Cpu
} from "lucide-react";

import { useState, useEffect, useRef } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();
  const router = useRouter();

  //////////////////////////////////////////////////////
  // AUTH
  //////////////////////////////////////////////////////

  const [user,setUser] = useState<any>(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    let mounted = true;

    async function checkAuth(){
      try{
        const res = await fetch("/api/auth/me",{cache:"no-store"});
        const data = await res.json();

        if(!data.user){
          router.replace("/login");
        }else{
          if(mounted) setUser(data.user);
        }
      }catch{
        router.replace("/login");
      }finally{
        if(mounted) setLoading(false);
      }
    }

    checkAuth();
    return ()=>{ mounted=false }

  },[router]);

  const userName = user?.name || user?.email || "Admin";

  //////////////////////////////////////////////////////
  // UI STATE
  //////////////////////////////////////////////////////

  const [collapsed,setCollapsed] = useState(false);
  const [openAds,setOpenAds] = useState(pathname.startsWith("/admin/ads"));
  const [openTV,setOpenTV] = useState(pathname.startsWith("/admin/tv-control"));
  const [openTools,setOpenTools] = useState(pathname.startsWith("/admin/tools"));

  const [profileOpen,setProfileOpen] = useState(false);
  const [notifOpen,setNotifOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  //////////////////////////////////////////////////////
  // NOTIFICATIONS
  //////////////////////////////////////////////////////

  const [notifications,setNotifications] = useState<any[]>([]);

  useEffect(()=>{
    let mounted = true;

    async function load(){
      try{
        const res = await fetch("/api/applications",{cache:"no-store"});
        const data = await res.json();

        if(data.success && mounted){
          setNotifications(data.applications.slice(0,5));
        }
      }catch{}
    }

    load();
    const interval = setInterval(load,5000);

    return ()=>{
      mounted=false;
      clearInterval(interval);
    }

  },[]);

  const appCount = notifications.length;

  //////////////////////////////////////////////////////
  // CLOSE DROPDOWNS
  //////////////////////////////////////////////////////

  useEffect(()=>{
    function handleClick(e:any){
      if(profileRef.current && !profileRef.current.contains(e.target)){
        setProfileOpen(false);
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown",handleClick);
    return ()=>document.removeEventListener("mousedown",handleClick);
  },[]);

  //////////////////////////////////////////////////////
  // NAV ITEMS (TOOLS REMOVED FROM HERE)
  //////////////////////////////////////////////////////

  const navItems = [
    { name:"Dashboard", href:"/admin", icon:LayoutDashboard },
    { name:"Categories", href:"/admin/categories", icon:Folder },
    { name:"News Control", href:"/admin/posts", icon:FileText },
    { name:"Breaking News", href:"/admin/breaking", icon:Zap },
    { name:"Horoscope", href:"/admin/astrology", icon:Sparkles },
    { name:"जनआवाज Poll", href:"/admin/polls", icon:Vote },
    { name:"Reporter Performance", href:"/admin/reporter-performance", icon:BarChart3 },
    { name:"Users", href:"/admin/user", icon:Users },
    { name:"Newsletter", href:"/admin/newsletter", icon:Bell },
    { name:"Applications", href:"/admin/applications", icon:Inbox },
  ];

  //////////////////////////////////////////////////////
  // LOGOUT
  //////////////////////////////////////////////////////

  async function handleLogout(){
    await fetch("/api/auth/logout",{method:"POST"});
    router.replace("/login");
  }

  //////////////////////////////////////////////////////
  // ACTIVE ROUTE
  //////////////////////////////////////////////////////

  function isActiveRoute(href:string){
    if(href === "/admin"){
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  }

  //////////////////////////////////////////////////////
  // LOADING
  //////////////////////////////////////////////////////

  if(loading){
    return(
      <div className="h-screen flex items-center justify-center text-white">
        Loading admin...
      </div>
    )
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return(

<div className="flex min-h-screen text-white bg-gradient-to-br from-[#1b0633] via-[#3b0845] to-[#5a0f5e]">

{/* SIDEBAR */}
<aside className={`${collapsed ? "w-20":"w-72"} transition-all duration-300 bg-black/40 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between`}>

<div>

{/* HEADER */}
<div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
{!collapsed && <h2 className="text-xl font-bold tracking-wide">NNTV Admin</h2>}
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

<nav className="p-4 space-y-2">

{/* MAIN ITEMS */}
{navItems.map(item=>{
const Icon = item.icon
const active = isActiveRoute(item.href)

return(
<Link
key={item.name}
href={item.href}
className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
active
? "bg-gradient-to-r from-[#5a0f5e] to-[#7a1b7f]"
: "text-gray-300 hover:bg-white/10"
}`}
>
<Icon size={18}/>
{!collapsed && item.name}
</Link>
)
})}

{/* 🧰 TOOLS DROPDOWN */}
<div className="pt-4 border-t border-white/10">
<button onClick={()=>setOpenTools(!openTools)}
className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-white/10">
<span className="flex items-center gap-3">
<Cpu size={18}/>
{!collapsed && "Tools"}
</span>
{!collapsed && <ChevronDown size={16} className={`${openTools ? "rotate-180":""}`}/>}
</button>

{!collapsed && openTools && (
<div className="ml-8 mt-2 space-y-2">
<SubItem href="/admin/tools/converter" label="Converter" pathname={pathname}/>
<SubItem href="/admin/tools/chess" label="Chess" pathname={pathname}/>
<SubItem href="/admin/tools/ludo" label="Ludo" pathname={pathname}/>
<SubItem href="/admin/tools/games" label="Other Games" pathname={pathname}/>
</div>
)}
</div>

{/* ADS (UNCHANGED) */}
<div>
<button onClick={()=>setOpenAds(!openAds)} className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-white/10">
<span className="flex items-center gap-3">
<Megaphone size={18}/>
{!collapsed && "Advertisements"}
</span>
{!collapsed && <ChevronDown size={16} className={`${openAds ? "rotate-180":""}`}/>}
</button>

{!collapsed && openAds && (
<div className="ml-8 mt-2 space-y-2">
<SubItem href="/admin/ads" label="All Ads" pathname={pathname}/>
<SubItem href="/admin/ads/create" label="Create Ad" pathname={pathname}/>
</div>
)}
</div>

{/* TV CONTROL (FULL RESTORED) */}
<div className="pt-4 border-t border-white/10">

{!collapsed && <p className="px-4 text-xs text-gray-400 mb-2">TV Control (Limited Access)</p>}

<button onClick={()=>setOpenTV(!openTV)} className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-white/10">
<span className="flex items-center gap-3">
<Tv size={18}/>
{!collapsed && "TV Control"}
</span>
{!collapsed && <ChevronDown size={16} className={`${openTV ? "rotate-180":""}`}/>
}
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
<button onClick={handleLogout}
className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600/30 hover:bg-red-600">
<LogOut size={18}/>
{!collapsed && "Logout"}
</button>
</div>

</aside>

{/* MAIN */}
<div className="flex-1 flex flex-col">

<header className="h-20 px-8 flex items-center justify-between bg-black/30 backdrop-blur-xl border-b border-white/10">

<div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl w-96">
<Search size={16}/>
<input placeholder="Search..." className="bg-transparent outline-none text-sm w-full"/>
</div>

<div className="flex items-center gap-6 relative" ref={profileRef}>

{/* BELL */}
<div className="relative">
<div onClick={()=>setNotifOpen(!notifOpen)} className="cursor-pointer relative">
<Bell/>
{appCount > 0 && (
<span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 rounded-full animate-pulse">
{appCount}
</span>
)}
</div>

{notifOpen && (
<div className="absolute right-0 mt-3 w-72 bg-black/90 border border-white/10 rounded-xl p-3 space-y-2 shadow-xl">
<p className="text-sm font-semibold mb-2">Recent Applications</p>

{notifications.length === 0 ? (
<p className="text-xs text-gray-400">No new activity</p>
) : (
notifications.map((n:any)=>(
<div key={n.id} className="text-xs border-b border-white/10 pb-1 hover:text-orange-400 cursor-pointer">
{n.name} • {n.role}
</div>
))
)}

</div>
)}
</div>

{/* PROFILE */}
<div onClick={()=>setProfileOpen(!profileOpen)} className="flex items-center gap-2 cursor-pointer">
<div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ffd700] to-[#caa54b] flex items-center justify-center text-black font-bold">
{userName.charAt(0)}
</div>
<ChevronDown size={16}/>
</div>

{profileOpen && (
<div className="absolute right-0 top-14 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 w-48">
<p className="text-sm mb-3">{userName}</p>
<button onClick={handleLogout} className="text-red-400 hover:text-white text-sm">
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
const active = pathname === href || pathname.startsWith(href + "/")
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